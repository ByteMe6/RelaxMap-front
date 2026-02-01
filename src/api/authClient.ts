// src/api/authClient.ts
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

async function refreshAccessToken() {
  const { refreshToken, email, name } = getTokens();

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await axios.post(`${host}/auth/refresh`, {
    refresh: refreshToken,
  });

  const { access, refresh } = res.data as { access: string; refresh: string };

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
  const { accessToken } = getTokens();

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

  try {
    const res = await api.request<T>(withToken(accessToken));
    // @ts-expect-error AxiosResponse
    return res.data ?? res;
  } catch (err) {
    const error = err as AxiosError;
    const status = error.response?.status;

    // Refresh только на 401
    if (status !== 401) {
      throw error;
    }

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
