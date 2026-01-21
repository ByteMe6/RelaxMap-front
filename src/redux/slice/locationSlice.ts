import { createSlice } from "@reduxjs/toolkit";
interface Location {
    name:string
}
const initialState:Location = {
    name:""
}
const  locationSlice = createSlice({
    name:"location",
    initialState,
    reducers:{}
})
export default locationSlice.reducer