// import LocationInfoBlock from "./LocationInfoBlock/LocationInfoBlock";
import FilterPanel from "./FilterPanel";
import LocationsGrid from "./LocationGrid/LocationsGrid";

function LocationsPage() {
  return (
    <>
      <FilterPanel></FilterPanel>
      <LocationsGrid></LocationsGrid>
      {/* <LocationInfoBlock></LocationInfoBlock> */}
    </>
  );
}

export default LocationsPage;
