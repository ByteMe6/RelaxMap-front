import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { searchLocation } from "../thunk/thunkLocationMap";
export interface LocationData {
    lat: number | null,
    lng: number | null,
}
export interface LocationInfo {
    image: string,
    name: string,
    type: null | string,
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
        type: null,
        region: null,
        description: "",
    },

    location: null
}
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
    },
})
export const {setLocationData} = locationSlice.actions
export default locationSlice.reducer