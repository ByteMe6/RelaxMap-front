// import LocationInfoBlock from "./LocationInfoBlock/LocationInfoBlock";
import FilterPanel from "./FilterPanel/FilterPanel";
import LocationsGrid from "./LocationGrid/LocationsGrid";
import { useReducer } from "react";
import { useAppSelector } from "../../redux/hooks/hook";
import type { LocationInfo } from "../../redux/slice/locationSlice";
export type FiltersState = {
  search: string,
  region: string,
  locationType: string,
  sort: string;
};
export type FiltersAction =
  | { type: "search", payload: string }
  | { type: "setRegion", payload: string }
  | { type: "setLocationType", payload: string }
  | { type: "setSort", payload: string };
const initialFiltersState: FiltersState = {
  search: "",
  region: "",
  locationType: "",
  sort:""
}
function filtersReducer(state: FiltersState, action: FiltersAction): FiltersState {
  switch (action.type) {
    case "search":
      return { ...state, search: action.payload }
    case "setRegion":
      return { ...state, region: action.payload }
    case "setLocationType":
      return { ...state, locationType: action.payload }
      case "setSort":
  return { ...state, sort: action.payload }
    default:
      return state;
  }
}

function LocationsPage() {
  const locations:LocationInfo[] = useAppSelector((state) => state.location.locations)
  const [filters, dispatch] = useReducer(filtersReducer, initialFiltersState)
  const filterBySearch = (location:LocationInfo, search:string) => 
    !search || location.name.toLowerCase().includes(search.toLowerCase())
  
  const filterByRegion = (location:LocationInfo, region: string) => 
    !region || location.region === region;
  
  const filterByType = (location:LocationInfo, type:string) => 
   !type || location.placeType === type
  
  const filteredLocation = locations
  .filter((location: LocationInfo) =>
    filterBySearch(location, filters.search) &&
    filterByRegion(location, filters.region) &&
    filterByType(location, filters.locationType)
  )
  .sort((a: LocationInfo, b: LocationInfo) => {
    switch (filters.sort) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "region-asc":
        return (a.region ?? "").localeCompare(b.region ?? "");
      case "region-desc":
        return (b.region ?? "").localeCompare(a.region ?? "");
      default:
        return 0;
    }
  });



  return (
    <>
      <FilterPanel filters={filters} dispatch={dispatch}></FilterPanel>
      <LocationsGrid locations={filteredLocation}></LocationsGrid>
      {/* <LocationInfoBlock></LocationInfoBlock> */}
    </>
  );
}

export default LocationsPage;
