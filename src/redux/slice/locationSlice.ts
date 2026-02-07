// src/redux/slice/locationSlice.ts
import { createSlice } from "@reduxjs/toolkit"
import type { PayloadAction } from "@reduxjs/toolkit"
import { searchLocation } from "../thunk/thunkLocationMap"
import { postNewLocation } from "../thunk/thunkLocation"
import { searchCities, searchRegions } from "../thunk/thunkTypeLocation"
import { fetchAllLocations } from "../thunk/thunkLocation"

export interface LocationData {
  lat: number | null
  lng: number | null
}

export interface LocationInfo {
  id: number
  image: string
  name: string
  placeType: string | null
  region: string | null
  description: string
  imageName?: string
}

interface LocationState {
  loading: boolean
  info: LocationInfo | null
  locations: LocationInfo[]
  location: LocationData | null
  listCity: any[]
  listRegion: any[]
  isSuccess: boolean
}

const initialState: LocationState = {
  loading: false,
  info: {
    id: 1,
    name: "",
    image: "",
    placeType: null,
    region: null,
    description: "",
  },
  locations: [],
  listCity: [],
  listRegion: [],
  location: null,
  isSuccess: false,
}

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocationData: (state, action: PayloadAction<LocationInfo>) => {
      state.info = action.payload
    },
    resetLocation: (state) => {
      state.info = null
      state.location = null
      state.listCity = []
      state.listRegion = []
      state.loading = false
    },
  },
  extraReducers(builder) {
    builder
      // пошук координат
      .addCase(searchLocation.pending, (state) => {
        state.loading = true
      })
      .addCase(searchLocation.fulfilled, (state, action) => {
        state.loading = false
        state.location = action.payload
      })
      .addCase(searchLocation.rejected, (state) => {
        state.loading = false
      })

      // створення нової локації
      .addCase(postNewLocation.pending, (state) => {
        state.loading = true
      })
      .addCase(postNewLocation.fulfilled, (state, action) => {
        state.loading = false
        state.info = action.payload
        state.locations.push(action.payload)
        state.isSuccess = true
      })
      .addCase(postNewLocation.rejected, (state) => {
        state.loading = false
      })

      // міста
      .addCase(searchCities.pending, (state) => {
        state.loading = true
      })
      .addCase(searchCities.fulfilled, (state, action) => {
        state.loading = false
        state.listCity = action.payload
      })
      .addCase(searchCities.rejected, (state) => {
        state.loading = false
      })

      // регіони
      .addCase(searchRegions.pending, (state) => {
        state.loading = true
      })
      .addCase(searchRegions.fulfilled, (state, action) => {
        state.loading = false
        state.listRegion = action.payload
      })
      .addCase(searchRegions.rejected, (state) => {
        state.loading = false
      })

      // завантаження всіх локацій
      .addCase(fetchAllLocations.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAllLocations.fulfilled, (state, action) => {
        state.loading = false
        state.locations = action.payload
      })
      .addCase(fetchAllLocations.rejected, (state) => {
        state.loading = false
      })
  },
})

export const { setLocationData, resetLocation } = locationSlice.actions
export default locationSlice.reducer
