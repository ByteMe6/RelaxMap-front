// src/api/authClient.ts
import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
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
  return { accessToken, refreshToken, email };
}

async function refreshAccessToken() {
  const { refreshToken, email } = getTokens();

  if (!refreshToken) {
    throw new Error("No refresh token");
  }

  const res = await axios.post(`${host}/auth/refresh`, { refreshToken });

  const { access, refresh } = res.data as { access: string; refresh: string };

  localStorage.setItem("accessToken", access);
  localStorage.setItem("refreshToken", refresh);

  store.dispatch(
    authSuccess({
      accessToken: access,
      refreshToken: refresh,
      email,
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

  const withToken = (token: string) => ({
    ...config,
    headers: {
      ...(config.headers || {}),
      Authorization: `Bearer ${token}`,
    },
  });

  try {
    const res = await api.request(withToken(accessToken));
    return res.data as T;
  } catch (err) {
    const error = err as AxiosError;

    const status = error.response?.status;

    // если не 400/401 — считаем обычной ошибкой, не про токен
    if (status !== 400 && status !== 401) {
      throw error;
    }

    // пробуем обновить токен и повторить
    try {
      const newAccess = await refreshAccessToken();
      const res = await api.request(withToken(newAccess));
      return res.data as T;
    } catch {
      store.dispatch(logout());
      throw error;
    }
  }
}
