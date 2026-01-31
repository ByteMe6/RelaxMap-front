import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  accessToken: string;
  refreshToken: string;
  email: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  accessToken: "",
  refreshToken: "",
  email: null,
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
      action: PayloadAction<{ accessToken: string; refreshToken: string; email: string }>
    ) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.email = action.payload.email;
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
      state.loading = false;
      state.error = null;
    },
  },
});

export const { authStart, authSuccess, authFailure, logout } = authSlice.actions;
export default authSlice.reducer;