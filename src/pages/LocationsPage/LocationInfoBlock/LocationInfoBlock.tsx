import styles from "./LocationInfoBlock.module.scss"
import { useState,useEffect } from "react";
import Star from "../../LocationDeteilsPage/RatingLocation/Star/Star";
import { api } from "../../../api/axiosInstance";
 export interface LocationBlock {
    id:number
    name:string,
    region:string | null,
    placeType: string | null
    rating?:number
}

type LocationProps = {
    location?: LocationBlock | null;
}
function LocationInfoBlock({location }: LocationProps) {
  const [currentLocation, setCurrentLocation] = useState(location);
const [averageRating, setAverageRating] = useState<number>(0);
  useEffect(() => {
    const data = localStorage.getItem("locations");
    if (data && location?.id) {
      const locations: LocationBlock[] = JSON.parse(data);
      const updated = locations.find((l) => l.id === location.id);
      setCurrentLocation(updated || location);
    }
  }, [location]);
  // Рейтинг берётся только из reviews
  useEffect(() => {
    if (!location?.id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = (await api.get(`/reviews/for-place/${location.id}`)).data;
        const content = res?.content || [];
        const ratings = content
          .map((r: any) => Number(r?.rating) || 0)
          .filter((v: number) => v > 0);
        const avg = ratings.length
          ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
          : 0;
        if (!cancelled) setAverageRating(avg);
      } catch {
        if (!cancelled) setAverageRating(0);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [location?.id]);

  console.log(currentLocation)
    return (
        <div className={styles.wrapperInfoBlock}>
            <div>
                {[1, 2, 3, 4, 5].map((star) => {
                    return (
                        <Star  active={star <= averageRating}
                            key={star}
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