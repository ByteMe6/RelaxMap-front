import styles from "./LocationCard.module.scss"
import Star from "../../LocationDeteilsPage/RatingLocation/Star/Star"
import { useState } from "react"
import { host } from "../../../backendHost"
import { useNavigate } from "react-router-dom"
type CardData = {
    id?:number,
    name: string,
    placeType: string | null,
    region: string | null,
    description: string,
    imageName?:string
}
type CardProps = {
    info: CardData[],
}
function LocationCard({ info }: CardProps) {
    const [hover, setHover] = useState<number | null>(null)
    const [rating, setRating] = useState(0)
    const navigate = useNavigate()
    return (
        <>
            {info.map((location) => (
                <li className={styles.wrapperCard}>
                    <img src={location.imageName ? `${host}/images/${location.imageName}` : "/default-image.png"} alt="location-image" className={styles.cardImage} />
                    <div className={styles.wrapperInfoCard}>
                        <p className={styles.textPlace}>{location.placeType}</p>
                        <div>
                            {[1, 2, 3, 4, 5].map((star) => {
                                return (
                                    <Star active={star <= (hover ?? rating)}
                                        key={star}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(null)}
                                        onClick={() => setRating(star)}
                                    />
                                )
                            })}
                        </div>
                        <p className={styles.textNameLocation}>{location.name}</p>
                    </div>
                    <button className={styles.btnLocation} onClick={() => {
                        navigate(`/locations/${location.id}`)
                        console.log(location.id)
                    }}>Переглянути локацію</button>
                </li>
            ))
            }

        </>
    )
}
export default LocationCard;