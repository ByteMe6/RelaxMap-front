import styles from "./LocationCard.module.scss";
import Star from "../../LocationDeteilsPage/RatingLocation/Star/Star";
import { useState } from "react";
import { host } from "../../../backendHost";
import { useNavigate } from "react-router-dom";
import { updateLocationRating } from "../../../redux/thunk/thunkUpdateRating"
import type { LocationInfo } from "../../../redux/slice/locationSlice";
import { useAppDispatch } from "../../../redux/hooks/hook";
type CardProps = {
    info: LocationInfo;
};
function LocationCard({ info }: CardProps) {
    const [hover, setHover] = useState<number | null>(null);
    const navigate = useNavigate();
    const dispatch = useAppDispatch()
    return (
        <>
                <li key={info.id} className={styles.wrapperCard}>
                    <img
                        src={
                            info.imageName
                                ? `${host}/images/${info.imageName}`
                                : "/default-image.png"
                        }
                        alt="location-image"
                        className={styles.cardImage}
                    />
                    <div className={styles.wrapperInfoCard}>
                        <p className={styles.textPlace}>{info.placeType}</p>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    active={star <= (hover ?? info.rating)} 
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(null)}
                                    onClick={() => {
                                        dispatch(updateLocationRating({ id: info.id, rating: star }));
                                        console.log(info.id)
                                    }}
                                />
                            ))}
                        </div>
                        <p className={styles.textNameLocation}>{info.name}</p>
                    </div>
                    <button
                        className={styles.btnLocation}
                        onClick={() => {
                            navigate(`/locations/${info.id}`);
                            console.log(info.id);
                        }}
                    >
                        Переглянути локацію
                    </button>
                </li>
        </>
    );
}

export default LocationCard;
