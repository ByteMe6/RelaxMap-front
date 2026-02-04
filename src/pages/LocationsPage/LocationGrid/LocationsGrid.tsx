import LocationCard from "../LocationCard/LocationCards";
import Container from "../../../components/Container/Container";
import { useAppSelector } from "../../../redux/hooks/hook";
import { host } from "../../../backendHost";
import styles from "./LocationGrid.module.scss"
function LocationsGrid() {
const info = useAppSelector((state) => state.location.info)
const image = info.imageName ? `${host}/images/${info.imageName}` : "/default-image.png";
    return (
        <Container>
            <ul className={styles.wrapperLocationCards}>
              <LocationCard info={info} image={image}/>
            </ul>
        </Container>
    )
}

export default LocationsGrid;