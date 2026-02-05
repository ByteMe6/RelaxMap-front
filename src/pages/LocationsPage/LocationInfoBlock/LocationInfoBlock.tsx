import styles from "./LocationInfoBlock.module.scss"
import { useState } from "react";
import Star from "../../LocationDeteilsPage/RatingLocation/Star/Star";
interface LocationBlock {
    name:string,
    region:string | null,
    placeType: string | null
}
type LocationProps = {
    location?: LocationBlock;
}
function LocationInfoBlock({location}: LocationProps) {
    const [hover, setHover] = useState<number | null>(null)
    const [rating, setRating] = useState(0)
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
            <p className={styles.titleLocationDetail}>{location?.name}</p>
            <p className={styles.textLocation}><span className={styles.spanLocation}>Регіон:</span>{location?.region}</p>
            <p className={styles.textLocation}><span className={styles.spanLocation}>Тип локації:</span>{location?.placeType}</p>
        </div>
    )
}
export default LocationInfoBlock;