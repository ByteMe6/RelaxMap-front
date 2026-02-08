import LocationDescription from "./LocationDescription/LocationDescription";
import LocationDetBlock from "./LocationDetBlock";
import LocationGallery from "./LocationGallery/LocationGallery";
import ReviewsSection from "./ReviewsSection";
import Container from "../../components/Container/Container";
import { useAppSelector } from "../../redux/hooks/hook";
import LocationInfoBlock from "../LocationsPage/LocationInfoBlock/LocationInfoBlock";
import styles from "./LocationDetailsPage.module.scss";
import { host } from "../../backendHost";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import type { LocationInfo } from "../../redux/slice/locationSlice.ts";
import AddReviewModal from "../../components/Modals/AddReviewModal/AddReviewModal.tsx";
import { useEffect, useState } from "react";
import { selectLocations } from "../../redux/slice/locationSlice";

function LocationDeteilsPage() {
  const [locationNew, setLocation] = useState<LocationInfo | null>(null);
  const { id } = useParams<{ id?: string }>();
  const locations = useAppSelector(selectLocations);
  const location = locations.find((loc) => loc.id === Number(id));
  console.log(location);
  const imageSrc = location?.imageName
    ? `${host}/images/${location.imageName}`
    : "/default-image.png";
  const [averageRating, setAverageRating] = useState<number>(2);
  const navigate = useNavigate();
  useEffect(() => {
    if (!location) return;
    const storage = JSON.parse(localStorage.getItem("locationRatings") || "{}");
    if (storage[location.id]) {
      const { total, count } = storage[location.id];
      setAverageRating(total / count);
    } else {
      setAverageRating(location.rating ?? 2);
    }
  }, [location]);
  const handleRatingUpdate = (newRating: number) => {
    setAverageRating(newRating);
  };
  useEffect(() => {
    const data = localStorage.getItem("locations");
    if (data) {
      const locations: LocationInfo[] = JSON.parse(data);
      const loc = locations.find((l) => l.id === Number(id));
      setLocation(loc || null);
    }
  }, [id]);
  console.log(locationNew);
  return (
    <Container>
      <div className={styles.wrapperLocationDetail}>
        <LocationDetBlock />
        <div className={styles.wrapperLocationDesktop}>
          <div className={styles.wrapperLocation}>
            <LocationGallery image={imageSrc} />
            <div>
              <LocationInfoBlock
                location={location}
                onRatingChange={handleRatingUpdate}
              />
              <div style={{ marginTop: "8px" }}>
                ⭐ Average Rating: {averageRating.toFixed(1)}
              </div>
            </div>
          </div>
          <LocationDescription
            description={
              locationNew?.description || location?.description || ""
            }
          />
        </div>
        <button
          onClick={() => navigate(`/locations/${location?.id}/edit`)}
          className={styles.btnEdit}
        >
          Редагувати
        </button>
        <div style={{ width: "100%" }}>
          <ReviewsSection />
        </div>
        <AddReviewModal />
      </div>
    </Container>
  );
}

export default LocationDeteilsPage;
