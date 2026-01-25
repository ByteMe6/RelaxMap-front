import Container from "../../components/Container/Container";
import styles from "./ReviewsBlock.module.scss";

function Star({ type }: { type: "full" | "half" | "empty" }) {
  if (type === "full") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  if (type === "half") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <defs>
          <linearGradient id="halfGrad">
            <stop offset="50%" stopColor="currentColor" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
        <path fill="url(#halfGrad)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
  );
}

function ReviewsBlock() {
  const reviews = [
    {
      text: "Неймовірні краєвиди та спокійна атмосфера — це одне з моїх найулюбленіших місць в Україні.",
      author: "Олена Коваль",
      location: "Бакота",
      rating: 4.5
    },
    {
      text: "“Чудове місце для відпочинку на природі: чисте повітря, мальовничі пагорби та спокійна річка.”",
      author: "Ігор Петров",
      location: "Карпати",
      rating: 5
    },
    {
      text: "Тут відчуваєш гармонію та справжню силу української природи — варто приїхати хоча б раз у житті.",
      author: "Ігор Шевченко",
      location: "Місце",
      rating: 4.5
    }
  ];

  return (
    <section className={styles.reviews}>
      <Container>
        <h2 className={styles['reviews__title']}>Останні відгуки</h2>

        <div className={styles['reviews__grid']}>
          {reviews.map((review, index) => (
            <div key={index} className={styles['review-card']}>
              <div className={styles['review-card__rating']}>
                {Array.from({ length: 5 }).map((_, i) => {
                  let type: "full" | "half" | "empty" = "empty";
                  if (review.rating >= i + 1) {
                    type = "full";
                  } else if (review.rating > i) {
                    type = "half";
                  }
                  return <Star key={i} type={type} />;
                })}
              </div>
              <p className={styles['review-card__text']}>{review.text}</p>
              <div className={styles['review-card__author']}>
                <span className={styles['review-card__author-name']}>{review.author}</span>
                <span className={styles['review-card__author-location']}>{review.location}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles['reviews__pagination']}>
          <button aria-label="Previous" className={styles['reviews__pagination-btn']}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <button aria-label="Next" className={styles['reviews__pagination-btn']}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </Container>
    </section>
  );
}

export default ReviewsBlock;