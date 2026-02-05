import LocationCard from "../LocationCard/LocationCards";
import Container from "../../../components/Container/Container";
import { useAppSelector } from "../../../redux/hooks/hook";
import styles from "./LocationGrid.module.scss"
function LocationsGrid() {
const locations = useAppSelector((state) => state.location.locations)
console.log(locations)
    return (
        <Container>
            <p></p>
            <ul className={styles.wrapperLocationCards}>
              <LocationCard info={locations} />
            </ul>
            <button className={styles.btnLoadLocation}>Показати ще</button>
        </Container>
    )
}

export default LocationsGrid;