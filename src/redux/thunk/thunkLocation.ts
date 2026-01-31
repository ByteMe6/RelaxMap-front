import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { host } from "../../backendHost";
import type { RootState } from "../store";
import type { LocationInfo } from "../slice/locationSlice";
interface NewLocation {
    imageName: File | null;
    name: string;
    placeType: string;
    region: string | null;
    description: string;
}

export const postNewLocation = createAsyncThunk<
    LocationInfo,
    NewLocation,
    { state: RootState }
>("location/postNewLocation", async (newLocation, thunkApi) => {
    try {
        const formData = new FormData();
        formData.append("name", newLocation.name);
        formData.append("placeType", newLocation.placeType);
        formData.append("region", newLocation.region ?? "");
        formData.append("description", newLocation.description);
        if (newLocation.imageName) {
            formData.append("imageName", newLocation.imageName);
        }
        const username = "user";
        const password = "ebcb6dd5-8de9-4383-ad73-9bf6db2b4a79";
        const token = btoa(`${username}:${password}`);

        const response = await axios.post(`${host}/places`, formData, {
            headers: {
                Authorization: `Basic ${token}`,
            },
        });
        const data: LocationInfo = await response.data;
        console.log(data);
        return data;
    } catch (error) {
        return thunkApi.rejectWithValue(error);
    }
});
