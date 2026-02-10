import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { host } from "../../backendHost";
import type { RootState } from "../store";
import type { LocationInfo } from "../slice/locationSlice";

const refreshAccessToken = async (refreshToken: string) => {
    const { data } = await axios.post<{ access: string; refresh: string }>(
        `${host}/auth/refresh`,
        { refreshToken }
    );
    localStorage.setItem("accessToken", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    return data.access;
};

export const updateLocationRating = createAsyncThunk<
    LocationInfo,
    { id: number; rating: number },
    { state: RootState }
>(
    "location/updateRating",
    async ({ id, rating }, thunkApi) => {
        try {
            let token = localStorage.getItem("accessToken");
            const refreshToken = localStorage.getItem("refreshToken");

            if (!token || !refreshToken) throw new Error("Немає доступу.");

            try {
                const response = await axios.patch(
                    `${host}/places/${id}`,
                    { rating },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                return response.data as LocationInfo;
            } catch (error: any) {
                if (error.response?.status === 401) {
                    token = await refreshAccessToken(refreshToken);
                    const response = await axios.patch(
                        `${host}/places/${id}`,
                        { rating },
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    return response.data as LocationInfo;
                }
                return thunkApi.rejectWithValue(error.message || "Помилка");
            }

        } catch (error: any) {
            return thunkApi.rejectWithValue(error.message || "Помилка");
        }
    }
);
