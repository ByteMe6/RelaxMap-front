// src/api/axiosInstance.ts
import axios from "axios";
import { host } from "../backendHost";
import store from "../redux/store"; // <-- default import
import { setCredentials } from "../redux/slice/authSlice";

// простий logout-хелпер
const doLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  store.dispatch(
    setCredentials({
      accessToken: "",
      refreshToken: "",
    })
  );
  window.location.href = "/login";
};

export const api = axios.create({
  baseURL: host,
});

// додаємо accessToken до кожного запиту
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

let isRefreshing = false;
let pendingRequests: ((token: string | null) => void)[] = [];

// обробляємо 401: refresh або logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    if (originalRequest._retry) {
      return Promise.reject(error);
    }

    if (status === 401) {
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        doLogout();
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        try {
          const res = await axios.post(`${host}/auth/refresh`, {
            refreshToken,
          });

          const {
            accessToken: newAccess,
            refreshToken: newRefresh,
          } = res.data;

          localStorage.setItem("accessToken", newAccess);
          localStorage.setItem("refreshToken", newRefresh);
          store.dispatch(
            setCredentials({
              accessToken: newAccess,
              refreshToken: newRefresh,
            })
          );

          pendingRequests.forEach((cb) => cb(newAccess));
          pendingRequests = [];
          isRefreshing = false;

          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch (e) {
          pendingRequests = [];
          isRefreshing = false;
          doLogout();
          return Promise.reject(e);
        }
      }

      return new Promise((resolve, reject) => {
        pendingRequests.push((newToken) => {
          if (!newToken) {
            reject(error);
            return;
          }
          originalRequest._retry = true;
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);
