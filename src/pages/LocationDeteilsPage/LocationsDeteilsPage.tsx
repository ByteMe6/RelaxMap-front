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
import AddReviewModal from "../../components/Modals/AddReviewModal/AddReviewModal.tsx";
import { useEffect, useState } from "react";
function LocationDeteilsPage() {
  const { id } = useParams<{ id?: string }>()
  const location = useAppSelector((state) => state.location.locations.find((loc) => loc.id === Number(id)));
  console.log(location)
  const getImage = location?.imageName ? `${host}/images/${location.imageName}` : "/default-image.png"
  console.log(getImage)
  const [averageRating, setAverageRating] = useState<number>(2);
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
  }
  return (
    <Container>
      <div className={styles.wrapperLocationDetail}>
        <LocationDetBlock />
        <div className={styles.wrapperLocationDesktop}>
          <div className={styles.wrapperLocation}>
            <LocationGallery image={getImage} />
            <div >
              <LocationInfoBlock location={location} onRatingChange={handleRatingUpdate}/>
              <div style={{ marginTop: "8px" }}>
                ⭐ Average Rating: {averageRating.toFixed(1)}
              </div>
            </div>
          </div>
          <LocationDescription description={location?.description || ""} />
        </div>
        <div style={{ width: "100%" }}>
          <ReviewsSection />
        </div>
        <AddReviewModal />
      </div>
    </Container>
  );
}

export default LocationDeteilsPage;
