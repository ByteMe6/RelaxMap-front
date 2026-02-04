import LocationDescription from "./LocationDescription/LocationDescription";
import LocationDetBlock from "./LocationDetBlock";
import LocationGallery from "./LocationGallery/LocationGallery";
import ReviewsSection from "./ReviewsSection";
import Container from "../../components/Container/Container";
import { useAppSelector } from "../../redux/hooks/hook";
import LocationInfoBlock from "../LocationsPage/LocationInfoBlock/LocationInfoBlock";
import styles from "./LocationDetailsPage.module.scss";
import { host } from "../../backendHost";

function LocationDeteilsPage() {
  const info = useAppSelector((state) => state.location.info);
  const imageUrl = info.imageName ? `${ host }/images/${ info.imageName }` : "/default-image.png";
  return (
      <Container>
        <div className={ styles.wrapperLocationDetail }>
          <LocationDetBlock/>
          <div className={ styles.wrapperLocationDesktop }>
            <LocationGallery image={ imageUrl }/>
            <LocationInfoBlock/>
          </div>
          <LocationDescription description={ info?.description }/>
          <div style={ { width: "100%" } }>
            <ReviewsSection/>
          </div>
        </div>
      </Container>
  );
}

export default LocationDeteilsPage;
