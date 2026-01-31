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
    async ({ name }, thunkApi) => {
        try {
            const apiKey = "6764bd2847e64b93954f19ad39fa852b"
            const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
                    name
                )}&key=${apiKey}&language=uk&pretty=1`
            );
            const data = await response.json();
            const { lat, lng } = data.results[0].geometry;
            return { lat, lng } as LocationData;
        } catch (error) {
            return thunkApi.rejectWithValue(error)
        }
    }
)