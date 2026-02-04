import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { host } from "../../backendHost";
import type { RootState } from "../store";
import type { LocationInfo } from "../slice/locationSlice";
interface NewLocation {
    file: File | null;
    name: string;
    placeType: string;
    region: string | null;
    description: string;
}
const refreshAccessToken = async (refreshToken: string) => {
    const { data } = await axios.post(`${host}/auth/refresh`, { refresh: refreshToken })
    localStorage.setItem("accessToken", data.access);
    return data.access;
}
export const postNewLocation = createAsyncThunk<
    LocationInfo,
    NewLocation,
    { state: RootState }
>("location/postNewLocation", async (newLocation, thunkApi) => {
    try {
        const token = localStorage.getItem("accessToken")
        const refreshToken = localStorage.getItem("refreshToken");
        if (!token || !refreshToken) {
            throw new Error("Немає доступу. Будь ласка логінізуйтеся.");
        }
        if (!newLocation.name || !newLocation.placeType || !newLocation.description) {
            return thunkApi.rejectWithValue("Потрібно заповнити всі обов'язкові поля");
        }
        const formData = new FormData();
        formData.append("name", newLocation.name);
        formData.append("placeType", newLocation.placeType);
        formData.append("region", newLocation.region ?? "");
        formData.append("description", newLocation.description);
        if (newLocation.file) {
            formData.append("file", newLocation.file);
        }
        for (const [key, value] of formData.entries()) {
    console.log(key, value);
}
        try {
            const response = await axios.post(`${host}/places`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });
            console.log(response.data)
            return response.data as LocationInfo;
        } catch (error: any) {
            if (error.response?.status === 401) {
                let token = await refreshAccessToken(refreshToken)
                const { data } = await axios.post(`${host}/places`, formData, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                return data
            }
            return thunkApi.rejectWithValue(error.message || "Error");
        }
    } catch (error) {
        return thunkApi.rejectWithValue(error)
    }
}
);
