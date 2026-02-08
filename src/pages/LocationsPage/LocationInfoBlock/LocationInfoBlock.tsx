import styles from "./LocationInfoBlock.module.scss"
import { useState,useEffect } from "react";
import Star from "../../LocationDeteilsPage/RatingLocation/Star/Star";
interface LocationBlock {
    id:number
    name:string,
    region:string | null,
    placeType: string | null
}

type LocationProps = {
    location?: LocationBlock | null;
}
function LocationInfoBlock({location }: LocationProps) {
    const [hover, setHover] = useState<number | null>(null)
    const [rating, setRating] = useState(0)
  const [currentLocation, setCurrentLocation] = useState(location);

  useEffect(() => {
    const data = localStorage.getItem("locations");
    if (data && location?.id) {
      const locations: LocationBlock[] = JSON.parse(data);
      const updated = locations.find((l) => l.id === location.id);
      setCurrentLocation(updated || location);
    }
  }, [location]);
  console.log(currentLocation)
    return (
        <div className={styles.wrapperInfoBlock}>
            <div>
                {[1, 2, 3, 4, 5].map((star) => {
                    return (
                        <Star  active={star <= (hover ?? rating)}
                            key={star}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(null)}
                            onClick={() => setRating(star)}
                        />
                    )
                })}
            </div>
            <p className={styles.titleLocationDetail}>{currentLocation?.name  || ""}</p>
            <p className={styles.textLocation}><span className={styles.spanLocation}>Регіон:</span>{currentLocation?.region || null}</p>
            <p className={styles.textLocation}><span className={styles.spanLocation}>Тип локації:</span>{currentLocation?.placeType || null}</p>
        </div>
    )
}
export default LocationInfoBlock;