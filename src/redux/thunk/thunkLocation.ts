// src/redux/thunk/thunkLocation.ts
import { createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"
import { host } from "../../backendHost"
import type { RootState } from "../store"
import type { LocationInfo } from "../slice/locationSlice"

interface NewLocation {
  file: File | null
  name: string
  placeType: string
  region: string | null
  description: string
}

const refreshAccessToken = async (refreshToken: string) => {
  const { data } = await axios.post<{ access: string; refresh: string }>(
    `${host}/auth/refresh`,
    { refreshToken },
  );
  localStorage.setItem("accessToken", data.access);
  localStorage.setItem("refreshToken", data.refresh);
  return data.access as string;
}

export const postNewLocation = createAsyncThunk<
  LocationInfo,
  NewLocation,
  { state: RootState; rejectValue: string }
>("location/postNewLocation", async (newLocation, thunkApi) => {
  try {
    const token = localStorage.getItem("accessToken")
    const refreshToken = localStorage.getItem("refreshToken")

    if (!token || !refreshToken) {
      return thunkApi.rejectWithValue("Немає доступу. Будь ласка, увійдіть у систему.")
    }

    if (!newLocation.name || !newLocation.placeType || !newLocation.description) {
      return thunkApi.rejectWithValue("Потрібно заповнити всі обов'язкові поля.")
    }

    const formData = new FormData()
    formData.append("name", newLocation.name)
    formData.append("placeType", newLocation.placeType)
    formData.append("region", newLocation.region ?? "")
    formData.append("description", newLocation.description)
    if (newLocation.file) {
      formData.append("file", newLocation.file)
    }

    for (const [key, value] of formData.entries()) {
      console.log(key, value)
    }

    const url = `${host}/places`

    try {
      const { data } = await axios.post<LocationInfo>(url, formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log("created place:", data)
      return data
    } catch (error: any) {
      if (error.response?.status === 401) {
        const newAccessToken = await refreshAccessToken(refreshToken)
        const { data } = await axios.post<LocationInfo>(url, formData, {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        })
        return data
      }

      const message =
        error.response?.data?.message ||
        error.message ||
        "Сталася помилка під час створення локації."
      return thunkApi.rejectWithValue(message)
    }
  } catch (error: any) {
    const message = error.message || "Сталася неочікувана помилка."
    return thunkApi.rejectWithValue(message)
  }
})

// ---- GET /places/all ----

type PlacesPageResponse = {
  content: LocationInfo[]
  totalElements: number
  totalPages: number
  pageNumber: number
  pageSize: number
}

export const fetchAllLocations = createAsyncThunk<
  LocationInfo[],
  void,
  { state: RootState; rejectValue: string }
>("location/fetchAllLocations", async (_, thunkApi) => {
  try {
    const { data } = await axios.get<PlacesPageResponse>(`${host}/places/all`, {
      params: {
        page: 0,
        size: 50,
      },
    })

    return data.content
  } catch (error: any) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Не вдалося завантажити список локацій."
    return thunkApi.rejectWithValue(message)
  }
})
