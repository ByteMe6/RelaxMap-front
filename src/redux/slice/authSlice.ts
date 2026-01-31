import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  email: string | null;
  name: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: "",
  refreshToken: "",
  email: null,
  name: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    authStart(state) {
      state.loading = true;
      state.error = null;
    },
    authSuccess(
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        email: string;
        name?: string;
      }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.email = action.payload.email;
      state.name = action.payload.name || null;
      state.loading = false;
      state.error = null;
    },
    authFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.accessToken = "";
      state.refreshToken = "";
      state.email = null;
      state.name = null;
      state.loading = false;
      state.error = null;
    },
    updateUserName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
  },
});

export const { authStart, authSuccess, authFailure, logout, updateUserName } =
  authSlice.actions;
export default authSlice.reducer;