import { useEffect } from "react"
import Container from "../../../components/Container/Container"
import {  useAppDispatch } from "../../../redux/hooks/hook"
import { fetchAllLocations } from "../../../redux/thunk/thunkLocation"
import { useState } from "react"
import type { LocationInfo } from "../../../redux/slice/locationSlice"
import LocationCard from "../LocationCard/LocationCards"
import styles from "./LocationGrid.module.scss"
type Props = {
  locations: LocationInfo[];
};
function LocationsGrid({ locations }: Props) {
const newLocations = localStorage.getItem("locations")
console.log(newLocations)
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
              {visibleLocations.map(location => (
          <LocationCard key={location.id} info={location} />
        ))}
      </ul>
       {visibleCount < locations.length && (
      <button className={styles.btnLoadLocation} onClick={handleLoadMore}>Показати ще</button>
       )}
    </Container>
    )
}

export default LocationsGrid
