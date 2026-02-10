import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/axiosInstance";

export interface UpdateLocationArgs {
  id: number;
  name: string;
  placeType: string;
  region: string;
  description: string;
  file: File | null;
}

export interface UpdatedLocationResponse {
  id: number;
  name: string;
  placeType: string;
  region: string;
  description: string;
  imageName?: string;
}

export interface UpdateLocationError {
  status: number;
  message: string;
}

export const updateLocation = createAsyncThunk<
  UpdatedLocationResponse,
  UpdateLocationArgs,
  { rejectValue: UpdateLocationError }
>("locations/updateLocation", async (args, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("name", args.name);
    formData.append("placeType", args.placeType);
    formData.append("region", args.region);
    formData.append("description", args.description);
    if (args.file) {
      // якщо бекенд чекає 'image' → зміни тут
      formData.append("file", args.file);
    }

    console.log("PATCH /places", {
      id: args.id,
      name: args.name,
      placeType: args.placeType,
      region: args.region,
      description: args.description,
      file: args.file ? args.file.name : null,
    });

    // TOKEN: гарантируем Authorization даже для multipart
    const token = localStorage.getItem("accessToken");

    const res = await api.patch(`/places/${args.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return res.data as UpdatedLocationResponse;
  } catch (error: any) {
    if (error.response) {
      const status: number = error.response.status;
      const backendMessage: string =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.statusText ||
        "Error";

      console.error("updateLocation error:", status, error.response.data);

      return rejectWithValue({
        status,
        message: backendMessage,
      });
    }

    console.error("updateLocation network error:", error);

    return rejectWithValue({
      status: 0,
      message: error.message || "Network error",
    });
  }
});
