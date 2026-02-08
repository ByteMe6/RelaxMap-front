// src/pages/LocationsGrid/LocationsGrid.tsx
import { useEffect } from "react"
import LocationCard from "../LocationCard/LocationCards"
import Container from "../../../components/Container/Container"
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/hook"
import { fetchAllLocations } from "../../../redux/thunk/thunkLocation"
import styles from "./LocationGrid.module.scss"
import { useState } from "react"
import type { LocationInfo } from "../../../redux/slice/locationSlice"
type Props = {
  locations: LocationInfo[];
};
function LocationsGrid({ locations }: Props) {
  const dispatch = useAppDispatch()
  const [visibleCount, setVisibleCount] = useState(6);
 const visibleLocations = locations.slice(0, visibleCount);
 
  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 6);
    console.log(visibleCount)
  };
  useEffect(() => {
    dispatch(fetchAllLocations())
  }, [dispatch])

  return (
    <Container>
      <p></p>
      <ul className={styles.wrapperLocationCards}>
        <LocationCard info={visibleLocations} />
      </ul>
       {visibleCount < locations.length && (
      <button className={styles.btnLoadLocation} onClick={handleLoadMore}>Показати ще</button>
       )}
    </Container>
  )
}

export default LocationsGrid
