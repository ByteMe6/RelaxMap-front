import styles from "./LocationInfoBlock.module.scss"
import { useState,useEffect } from "react";
import Star from "../../LocationDeteilsPage/RatingLocation/Star/Star";
interface LocationBlock {
    id:number
    name:string,
    region:string | null,
    placeType: string | null
    rating?:number
}

type LocationProps = {
    location?: LocationBlock | null;
    onRatingChange?: (newRating: number,) => void;
}
function LocationInfoBlock({location,onRatingChange }: LocationProps) {
    const [hover, setHover] = useState<number | null>(null)
    const [rating, setRating] = useState(0)
  const [currentLocation, setCurrentLocation] = useState(location);
const [averageRating, setAverageRating] = useState<number>(2);
  useEffect(() => {
    const data = localStorage.getItem("locations");
    if (data && location?.id) {
      const locations: LocationBlock[] = JSON.parse(data);
      const updated = locations.find((l) => l.id === location.id);
      setCurrentLocation(updated || location);
    }
  }, [location]);
      useEffect(() => {
    if (!location) return;

    const storage = JSON.parse(localStorage.getItem("locationRatings") || "{}");
    if (storage[location.id]) {
      const { total, count } = storage[location.id];
      setAverageRating(total / count);
    } else {
      const defaultRating = location.rating ?? 2;
      storage[location.id] = { total: defaultRating, count: 1 };
      localStorage.setItem("locationRatings", JSON.stringify(storage));
      setAverageRating(defaultRating);
    }
  }, [location]);

  const handleRating = (star: number) => {
    if (!location) return;

    const storage = JSON.parse(localStorage.getItem("locationRatings") || "{}");
    const current = storage[location.id] || { total: location.rating ?? 2, count: 1 };

    const newTotal = current.total + star;
    const newCount = current.count + 1;

    storage[location.id] = { total: newTotal, count: newCount };
    localStorage.setItem("locationRatings", JSON.stringify(storage));

    const newAverage = newTotal / newCount;
    setAverageRating(newAverage);

    if (onRatingChange) onRatingChange(newAverage); 
  }

  console.log(currentLocation)
    return (
        <div className={styles.wrapperInfoBlock}>
            <div>
                {[1, 2, 3, 4, 5].map((star) => {
                    return (
                        <Star  active={star <= (hover ?? averageRating)}
                            key={star}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(null)}
                             onClick={() => handleRating(star)}
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