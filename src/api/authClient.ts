import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import { host } from "../backendHost";
import store from "../redux/store";
import { logout, authSuccess } from "../redux/slice/authSlice";

const api = axios.create({
  baseURL: host,
});

function getTokens() {
  const accessToken = localStorage.getItem("accessToken") || "";
  const refreshToken = localStorage.getItem("refreshToken") || "";
  const email = localStorage.getItem("email") || "";
  const name = localStorage.getItem("userName") || "";
  return { accessToken, refreshToken, email, name };
}

// POST /auth/is-valid  { "token": "..." } -> { "isTokenValid": boolean }
async function isTokenValid(token: string): Promise<boolean> {
  if (!token) return false;

  try {
    const res = await axios.post<{ isTokenValid: boolean }>(
      `${host}/auth/is-valid`,
      { token },
    );
    return Boolean(res.data?.isTokenValid);
  } catch {
    return false;
  }
}

// POST /auth/refresh { "refreshToken": "..." } -> { "access": "...", "refresh": "..." }
async function refreshAccessToken() {
  const { refreshToken, email, name } = getTokens();

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await axios.post<{ access: string; refresh: string }>(
    `${host}/auth/refresh`,
    {
      refreshToken, // поле строго как в Swagger
    },
  );

  const { access, refresh } = res.data;

  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);

  store.dispatch(
    authSuccess({
      accessToken: access,
      refreshToken: refresh,
      email,
      name: name || undefined,
    }),
  );

  return access;
}

export async function authorizedRequest<T = unknown>(
  config: AxiosRequestConfig,
): Promise<T> {
  let { accessToken } = getTokens();

  if (!accessToken) {
    store.dispatch(logout());
    throw new Error("No access token");
  }

  const withToken = (token: string): AxiosRequestConfig => ({
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  // 1. Проверяем токен через /auth/is-valid
  const valid = await isTokenValid(accessToken);
  if (!valid) {
    try {
      accessToken = await refreshAccessToken();
    } catch (e) {
      store.dispatch(logout());
      throw e;
    }
  }

  try {
    const res = await api.request<T>(withToken(accessToken));
    // @ts-expect-error AxiosResponse
    return res.data ?? res;
  } catch (err) {
    const error = err as AxiosError;
    const status = error.response?.status;

    if (status !== 401) {
      throw error;
    }

    // 2. Fallback: на 401 ещё раз пробуем обновить
    try {
      const newAccess = await refreshAccessToken();
      const res = await api.request<T>(withToken(newAccess));
      // @ts-expect-error
      return res.data ?? res;
    } catch {
      store.dispatch(logout());
      throw error;
    }
  }
}
