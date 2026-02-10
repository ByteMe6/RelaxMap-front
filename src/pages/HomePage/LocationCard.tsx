import styles from "./LocationCard.module.scss";
import { useNavigate } from "react-router-dom";

type ReviewLike = {
  rating?: number | string | null;
};

interface LocationCardProps {
  image: string;
  category: string;
  title: string;
  reviews?: ReviewLike[];
  rating?: number | null; // computed from reviews upstream (preferred)
  id?: number | string;
}

function LocationCard({ image, category, title, reviews, rating: ratingProp, id }: LocationCardProps) {
  const navigate = useNavigate();
  const navigateTo = () => {
    if (!id) return;
    navigate(`/locations/${id}`);
  };

  const computedRatings = (reviews || [])
    .map((r) => Number(r?.rating) || 0)
    .filter((v) => v > 0);
  const computedRating = computedRatings.length
    ? computedRatings.reduce((a, b) => a + b, 0) / computedRatings.length
    : null;

  const ratingRaw = ratingProp ?? computedRating;
  const rating = typeof ratingRaw === "number" ? Math.max(0, Math.min(5, ratingRaw)) : 0;
  const hasRating = typeof ratingRaw === "number";

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className={styles['location-card']}>
      <div className={styles['location-card__image-wrapper']}>
        <img src={image} alt={title} />
      </div>
      <div className={styles['location-card__content']}>
        <span className={styles['location-card__category']}>{category}</span>

        <div className={styles['location-card__rating']}>
          {Array.from({ length: fullStars }).map((_, i) => (
            <svg key={`full-${i}`} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
          {hasHalfStar && (
            <svg key="half" viewBox="0 0 24 24">
              <defs>
                <linearGradient id="halfGrad">
                  <stop offset="50%" stopColor="currentColor" />
                  <stop offset="50%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <path
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                fill="url(#halfGrad)"
                stroke="currentColor"
                strokeWidth="1"
              />
            </svg>
          )}
          {Array.from({ length: emptyStars }).map((_, i) => (
            <svg key={`empty-${i}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
          <span style={{ marginLeft: 8, fontWeight: 600 }}>
            {hasRating ? rating.toFixed(1) : "—"}
          </span>
        </div>

        <h3 className={styles['location-card__title']}>{title}</h3>

        <button className={styles['location-card__button']} onClick={navigateTo}>Переглянути локацію</button>
      </div>
    </div>
  );
}

export default LocationCard;