import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { host } from "../../backendHost";
import { authStart, authSuccess, authFailure, logout } from "../slice/authSlice";

interface AuthPayload {
  email: string;
  password: string;
  name?: string;
}

interface AuthResponse {
  access: string;
  refresh: string;
}

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: AuthPayload, { dispatch }) => {
    try {
      dispatch(authStart());

      const response = await axios.post<AuthResponse>(`${host}/auth/login`, {
        email,
        password,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("email", email);

      dispatch(
        authSuccess({
          accessToken: access,
          refreshToken: refresh,
          email,
        }),
      );

      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Невірний логін або пароль";
      dispatch(authFailure(msg));
      throw err;
    }
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, name }: AuthPayload, { dispatch }) => {
    try {
      dispatch(authStart());

      const response = await axios.post<AuthResponse>(`${host}/auth/register`, {
        email,
        password,
        name,
      });

      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("email", email);

      dispatch(
        authSuccess({
          accessToken: access,
          refreshToken: refresh,
          email,
        }),
      );

      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Помилка реєстрації";
      dispatch(authFailure(msg));
      throw err;
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { dispatch }) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("email");
  dispatch(logout());
});
