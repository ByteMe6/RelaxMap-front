import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  email: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  name: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  email: localStorage.getItem("email"),
  accessToken: localStorage.getItem("accessToken"),
  refreshToken: localStorage.getItem("refreshToken"),
  name: localStorage.getItem("name"),
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCredentials: (
      state,
      action: PayloadAction<{ 
        accessToken: string; 
        refreshToken: string; 
        email?: string;
        name?: string;
      }>
    ) => {
      const { accessToken, refreshToken, email, name } = action.payload;
      
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      if (email) {
        state.email = email;
        localStorage.setItem("email", email);
      }
      if (name) {
        state.name = name;
        localStorage.setItem("name", name);
      }

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    },
    updateUserName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
      localStorage.setItem("name", action.payload);
    },
    logout: (state) => {
      state.email = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.name = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("email");
      localStorage.removeItem("name");
    },
  },
});

export const { 
  authStart, 
  authFailure, 
  setCredentials, 
  updateUserName, 
  logout 
} = authSlice.actions;

export const authSuccess = setCredentials;

export default authSlice.reducer;