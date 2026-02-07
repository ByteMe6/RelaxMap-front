// src/pages/LocationsGrid/LocationsGrid.tsx
import { useEffect } from "react"
import LocationCard from "../LocationCard/LocationCards"
import Container from "../../../components/Container/Container"
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/hook"
import { fetchAllLocations } from "../../../redux/thunk/thunkLocation"
import styles from "./LocationGrid.module.scss"

function LocationsGrid() {
  const dispatch = useAppDispatch()
  const locations = useAppSelector((state) => state.location.locations)

  console.log("locations from Redux:", locations)

  useEffect(() => {
    dispatch(fetchAllLocations())
  }, [dispatch])

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

export default LocationsGrid
