import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { host } from "../../backendHost";
import type { RootState } from "../store"
import type { LocationInfo } from "../slice/locationSlice";
interface UpdateLocation {
    id: number;
    file: File | null;
    name: string;
    placeType: string;
    region: string | null;
    description: string
}
const refreshAccessToken = async (refreshToken: string) => {
    const { data } = await axios.post(`${host}/auth/refresh`, { refresh: refreshToken })
    localStorage.setItem("accessToken", data.access);
    return data.access;
}
export const updateLocation = createAsyncThunk<
    LocationInfo,
    UpdateLocation,
    { state: RootState }
>(
    "location/updateLocation",
    async (updatedLocation, thunkApi) => {
        try {
            const token = localStorage.getItem("accessToken")
            const refreshToken = localStorage.getItem("refreshToken");
            if (!token || !refreshToken) {
                throw new Error("Немає доступу. Будь ласка логінізуйтеся.");
            }
            if (!updatedLocation.name || !updatedLocation.placeType || !updatedLocation.description) {
                return thunkApi.rejectWithValue("Потрібно заповнити всі обов'язкові поля");
            }
            const formData = new FormData();
            formData.append("name", updatedLocation.name);
            formData.append("placeType", updatedLocation.placeType);
            formData.append("region", updatedLocation.region ?? "");
            formData.append("description", updatedLocation.description);
            if (updatedLocation.file) {
                formData.append("file", updatedLocation.file);
            }
            try {

                const response = await axios.put(`${host}/places/${updatedLocation.id}`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                return response.data as LocationInfo;
            } catch (error: any) {
                if (error.response?.status === 401) {
                    const newToken = await refreshAccessToken(refreshToken);

                    const { data } = await axios.put(`${host}/places/${updatedLocation.id}`, formData, {
                        headers: {
                            Authorization: `Bearer ${newToken}`,
                        },
                    });
                      return data;
                }
                  return thunkApi.rejectWithValue(error.message || "Error");
            }
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)