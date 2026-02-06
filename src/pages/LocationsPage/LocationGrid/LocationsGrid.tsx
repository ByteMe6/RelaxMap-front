import LocationCard from "../LocationCard/LocationCards";
import Container from "../../../components/Container/Container";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/hook";
import styles from "./LocationGrid.module.scss"
import { useEffect } from "react";
import { setLocations } from "../../../redux/slice/locationSlice";
function LocationsGrid() {
const locations = useAppSelector((state) => state.location.locations)
console.log(locations)
const dispatch = useAppDispatch()
useEffect(() => {
  if (locations) {
    dispatch(setLocations(locations));
  }
}, [locations, dispatch]);
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