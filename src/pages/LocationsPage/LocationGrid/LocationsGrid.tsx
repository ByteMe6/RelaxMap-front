import LocationCard from "../LocationCard/LocationCards";
import Container from "../../../components/Container/Container";
import styles from "./LocationGrid.module.scss"
type LocationProps = {
    locations: any[]
}
function LocationsGrid({ locations }: LocationProps) {
    return (
        <Container>
            <ul className={styles.wrapperLocationCards}>
                <LocationCard info={locations} />
            </ul>
            <button className={styles.btnLoadLocation}>Показати ще</button>
        </Container>
    )
}

export default LocationsGrid;