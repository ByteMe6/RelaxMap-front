import LocationInfoBlock from "./LocationInfoBlock";
import FilterPanel from "./FilterPanel";
import LocationsGrid from "./LocationsGrid";

function LocationsPage() {
  return (
    <>
      <FilterPanel></FilterPanel>
      <LocationsGrid></LocationsGrid>
      <LocationInfoBlock></LocationInfoBlock>
    </>
  );
}

export default LocationsPage;
