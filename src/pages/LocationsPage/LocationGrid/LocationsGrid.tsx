import LocationCard from "../LocationCard/LocationCards";
import Container from "../../../components/Container/Container";
import { useAppSelector } from "../../../redux/hooks/hook";
import { host } from "../../../backendHost";
import styles from "./LocationGrid.module.scss"
function LocationsGrid() {
const locations = useAppSelector((state) => state.location.locations)
const getImage = locations.map(image => image.imageName)
const image = getImage ? `${host}/images/${getImage}` : "/default-image.png";
    return (
        <Container >
            <ul className={styles.wrapperLocationCards}>
              <LocationCard info={locations} image={image}/>
            </ul>
            <button className={styles.btnLoadLocation}>Показати ще</button>
        </Container>
    )
}

export default LocationsGrid;