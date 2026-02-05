// import LocationInfoBlock from "./LocationInfoBlock/LocationInfoBlock";
import FilterPanel from "./FilterPanel/FilterPanel";
import LocationsGrid from "./LocationGrid/LocationsGrid";
import { useReducer } from "react";
import { useAppSelector } from "../../redux/hooks/hook";
export type FiltersState = {
  search: string,
  region: string,
  locationType: string
};
export type FiltersAction =
  | { type: "search", payload: string }
  | { type: "setRegion", payload: string }
  | { type: "setLocationType", payload: string };
const initialFiltersState: FiltersState = {
  search: "",
  region: "",
  locationType: ""
}
function filtersReducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case "search":
      return { ...state, search: action.payload }
    case "setRegion":
      return { ...state, region: action.payload }
    case "setLocationType":
      return { ...state, locationType: action.payload }
    default:
      return state;
  }
}

function LocationsPage() {
  const locations = useAppSelector((state) => state.location.locations)
  const [filters, dispatch] = useReducer(filtersReducer, initialFiltersState)
  const filterBySearch = (location:any, search:string) => 
    !search || location.name.toLowerCase().includes(search.toLowerCase())
  
  const filterByRegion = (location:any, region: string) => 
    !region || location.region === region;
  
  const filterByType = (location:any, type:string) => 
   !type || location.placeType === type
  
  const filteredLocation = locations.filter(location => 
    filterBySearch(location, filters.search) && filterByRegion(location, filters.region) && filterByType(location, filters.locationType))
  console.log(filteredLocation)
  return (
    <>
      <FilterPanel filters={filters} dispatch={dispatch}></FilterPanel>
      <LocationsGrid locations={filteredLocation}></LocationsGrid>
      {/* <LocationInfoBlock></LocationInfoBlock> */}
    </>
  );
}

export default LocationsPage;
