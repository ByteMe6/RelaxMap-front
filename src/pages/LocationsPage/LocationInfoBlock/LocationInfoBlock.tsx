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
    location?: LocationBlock;
    onRatingChange?: (newRating: number) => void;
}
function LocationInfoBlock({location,onRatingChange}: LocationProps) {
    const [hover, setHover] = useState<number | null>(null)
      const [averageRating, setAverageRating] = useState<number>(2);

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
            <p className={styles.titleLocationDetail}>{location?.name}</p>
            <p className={styles.textLocation}><span className={styles.spanLocation}>Регіон:</span>{location?.region}</p>
            <p className={styles.textLocation}><span className={styles.spanLocation}>Тип локації:</span>{location?.placeType}</p>
        </div>
    )
}
export default LocationInfoBlock;