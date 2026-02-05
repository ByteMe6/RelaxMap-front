import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { searchLocation } from "../thunk/thunkLocationMap";
import { postNewLocation } from "../thunk/thunkLocation";
import { searchCities, searchRegions } from "../thunk/thunkTypeLocation";
export interface LocationData {
    lat: number | null,
    lng: number | null,
}
export interface LocationInfo {
    id:number,
    image: string,
    name: string,
    placeType: null | string,
    region: null | string,
    description: string,
    imageName?: string
}

interface LocationState {
    loading: boolean,
    info: LocationInfo | null,
    locations: LocationInfo[],
    location: LocationData | null,
    listCity: any[],
    listRegion: any[]
}
const initialState: LocationState = {
    loading: false,
    info: {
        id:1,
        name: "",
        image: "",
        placeType: null,
        region: null,
        description: "",
    },
    locations: [],
    listCity: [],
    listRegion: [],
    location: null
}
console.log(initialState.locations)
const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocationData: (state, action: PayloadAction<LocationInfo>) => {
            state.info = action.payload
        },
        resetLocation: (state) => {
            state.info = null;
            state.location = null
            state.listCity = []
            state.listRegion = []
            state.loading = false
        }
    }, extraReducers(builder) {
        builder
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
            .addCase(postNewLocation.pending, (state) => {
                state.loading = true
            })
            .addCase(postNewLocation.fulfilled, (state, action) => {
                state.loading = false
                state.info = action.payload
                state.locations.push(action.payload)
                console.log("aa", state.info)
                console.log("bb", state.locations)
                console.log("bb copy", [...state.locations])
                console.log("length", state.locations.length)
            })
            .addCase(postNewLocation.rejected, (state) => {
                state.loading = false
            })
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
            .addCase(searchRegions.pending, (state) => {
                state.loading = true
            })
            .addCase(searchRegions.fulfilled, (state, action) => {
                state.loading = false
                state.listRegion = action.payload
                console.log(state.listRegion)
            })
            .addCase(searchRegions.rejected, (state) => {
                state.loading = false
            })
    },
})
export const { setLocationData, resetLocation } = locationSlice.actions
export default locationSlice.reducer