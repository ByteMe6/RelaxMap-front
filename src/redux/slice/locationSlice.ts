import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { searchLocation } from "../thunk/thunkLocationMap";
import { postNewLocation } from "../thunk/thunkLocation";
export interface LocationData {
    lat: number | null,
    lng: number | null,
}
export interface LocationInfo {
    image: string,
    name: string,
    placeType: null | string,
    region: null | string,
    description: string,
}
interface LocationState {
    loading: boolean
    info: LocationInfo
    location: LocationData | null
}
const initialState: LocationState = {
    loading: false,
    info: {
        name: "",
        image: "",
        placeType: null,
        region: null,
        description: "",
    },

    location: null
}
console.log(initialState.info)
const locationSlice = createSlice({
    name: "location",
    initialState,
    reducers: {
        setLocationData: (state, action: PayloadAction<LocationInfo>) => {
            state.info = action.payload
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
            console.log(state.info)
            })
            .addCase(postNewLocation.rejected, (state) => {
                state.loading = false
            })
    },
})
export const {setLocationData} = locationSlice.actions
export default locationSlice.reducer