import { createAsyncThunk } from "@reduxjs/toolkit";
import type { LocationData } from "../slice/locationSlice";
import type { RootState } from "../store";
interface NewLocation {
    name: string
}
export const searchLocation = createAsyncThunk<
    LocationData,
    NewLocation,
    { state: RootState }
>(
    "location/searchLocation",
    async ({name}, thunkApi) => {
        try {
            const response = await fetch(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(name)}`
            );
            const data = await response.json();
            const { lat, lon } = data[0];
            return {
                lat: parseFloat(lat),
                lng: parseFloat(lon),
            } as LocationData;
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)