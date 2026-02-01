import styles from "./LocationInfoBlock.module.scss"
import { useAppSelector } from "../../../redux/hooks/hook";
import { useState } from "react";
import Star from "../../LocationDeteilsPage/RatingLocation/Star/Star";
function LocationInfoBlock() {
    const info = useAppSelector((state) => state.location.info)
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
            <p className={styles.titleLocationDetail}>{info?.name}</p>
            <p className={styles.textLocation}><span className={styles.spanLocation}>Регіон:</span>{info?.region}</p>
            <p className={styles.textLocation}><span className={styles.spanLocation}>Тип локації:</span>:{info?.placeType}</p>
        </div>
    )
}
export default LocationInfoBlock;