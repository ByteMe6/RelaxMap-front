import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
export const searchCities = createAsyncThunk(
    "location/searchCities",
    async (query: string) => {
        if (!query) return [];
        const response = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/cities", {
            params: {
                namePrefix: query,
                limit: 10
            },
            headers: {
                "X-RapidAPI-Key": "e6e83b0471mshb5abc6956b1d857p16bc3ajsn0b40e73207f6",
                "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
            }
        })
        return response.data.data;
    }
)

export const searchRegions = createAsyncThunk(
    "location/searchRegions",
    async(countryCode:string) => {
        if(!countryCode) return [];
        const response = await axios.get("https://wft-geo-db.p.rapidapi.com/v1/geo/regions", {
            params:{
                countryIds: countryCode,
                limit: 50
            }, 
            headers:{
                "X-RapidAPI-Key":"e6e83b0471mshb5abc6956b1d857p16bc3ajsn0b40e73207f6",
                "X-RapidAPI-Host":"wft-geo-db.p.rapidapi.com"
            }
        })
        return response.data.data;
    }
)