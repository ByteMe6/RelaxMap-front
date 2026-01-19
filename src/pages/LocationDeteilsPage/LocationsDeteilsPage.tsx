import LocationDescription from "./LocationDescription";
import LocationDetBlock from "./LocationDetBlock";
import LocationGallery from "./LocationGallery";
import ReviewsSection from "./ReviewsSection";

function LocationDeteilsPage() {
  return (
    <>
      <LocationDetBlock />
      <LocationGallery />
      <LocationDescription />
      <ReviewsSection/>
    </>
  );
}
export default LocationDeteilsPage;
