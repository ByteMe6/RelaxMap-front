import styles from "./LocationCard.module.scss";

interface LocationCardProps {
  image: string;
  category: string;
  title: string;
  rating: number;
}

function LocationCard({ image, category, title, rating }: LocationCardProps) {
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
        </div>

        <h3 className={styles['location-card__title']}>{title}</h3>

        <button className={styles['location-card__button']}>Переглянути локацію</button>
      </div>
    </div>
  );
}

export default LocationCard;