// import LocationInfoBlock from "./LocationInfoBlock/LocationInfoBlock";
import FilterPanel from "./FilterPanel/FilterPanel";
import LocationsGrid from "./LocationGrid/LocationsGrid";
import { useReducer, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hook";
import { selectLocations } from "../../redux/slice/locationSlice";
import { fetchAllLocations } from "../../redux/thunk/thunkLocation";
import { type LocationInfo, selectLocations } from "../../redux/slice/locationSlice";

export type FiltersState = {
  search: string;
  region: string;
  locationType: string;
  sort: string;
};
export type FiltersAction =
  | { type: "search"; payload: string }
  | { type: "setRegion"; payload: string }
  | { type: "setLocationType"; payload: string }
  | { type: "setSort"; payload: string };
const initialFiltersState: FiltersState = {
  search: "",
  region: "",
  locationType: "",
  sort: "",
};
function filtersReducer(
  state: FiltersState,
  action: FiltersAction,
): FiltersState {
  switch (action.type) {
    case "search":
      return { ...state, search: action.payload };
    case "setRegion":
      return { ...state, region: action.payload };
    case "setLocationType":
      return { ...state, locationType: action.payload };
    case "setSort":
      return { ...state, sort: action.payload };
    default:
      return state;
  }
}

function LocationsPage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const locations = useAppSelector(selectLocations);

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);
  const [filters, dispatch] = useReducer(filtersReducer, {
    ...initialFiltersState,
    search: searchParams.get("search") ?? "",
  });

  useEffect(() => {
    const fromUrl = searchParams.get("search") ?? "";
    if (fromUrl !== filters.search) {
      dispatch({ type: "search", payload: fromUrl });
    }
  }, [searchParams]);

  useEffect(() => {
    const current = searchParams.get("search") ?? "";
    if (filters.search !== current) {
      const next = new URLSearchParams(searchParams);
      if (filters.search) {
        next.set("search", filters.search);
      } else {
        next.delete("search");
      }
      setSearchParams(next, { replace: true });
    }
  }, [filters.search]);

  const filterBySearch = (location: LocationInfo, search: string) =>
    !search || location.name.toLowerCase().includes(search.toLowerCase());

  const filterByRegion = (location: LocationInfo, region: string) =>
    !region || location.region === region;

  const filterByType = (location: LocationInfo, type: string) =>
    !type || location.placeType === type;

  const filteredLocation = locations
    .filter(
      (location) =>
        filterBySearch(location, filters.search) &&
        filterByRegion(location, filters.region) &&
        filterByType(location, filters.locationType),
    )
    .sort((a, b) => {
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
