// src/redux/thunk/authThunk.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { host } from "../../backendHost";
import { authStart, authSuccess, authFailure } from "../slice/authSlice";

interface AuthPayload {
  email: string;
  password: string;
  name?: string; // только для регистрации
}

// ---------------- LOGIN ----------------
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }: AuthPayload, { dispatch }) => {
    try {
      dispatch(authStart());

      const response = await axios.post(`${host}/auth/login`, {
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
        })
      );

      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Невірний логін або пароль";
      dispatch(authFailure(msg));
      throw err;
    }
  }
);

// ---------------- REGISTER ----------------
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async ({ email, password, name }: AuthPayload, { dispatch }) => {
    try {
      dispatch(authStart());

      const response = await axios.post(`${host}/auth/register`, {
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
        })
      );

      return response.data;
    } catch (err: any) {
      const msg = err.response?.data?.message || "Помилка реєстрації";
      dispatch(authFailure(msg));
      throw err;
    }
  }
);