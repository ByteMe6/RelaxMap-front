import { useState, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hook";
import { fetchAllLocations } from "../../redux/thunk/thunkLocation";
import Container from "../../components/Container/Container";
import styles from "./ReviewsBlock.module.scss";
import { api } from "../../api/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Pagination } from "swiper/modules";

export function Star({ type }: { type: "full" | "half" | "empty" }) {
  if (type === "full") {
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
    );
  }
  if (type === "half") {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <defs>
            <linearGradient id="halfGrad">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path fill="url(#halfGrad)"
                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
        </svg>
    );
  }
  return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </svg>
  );
}

function ReviewsBlock() {
  const dispatch = useAppDispatch();
  const locations = useAppSelector((state) => state.location.locations);
  const [reviews, setReviews] = useState<any[]>([]);

  // responsive behavior handled by Swiper breakpoints; no local `isMobile` needed

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);

  useEffect(() => {
    // fetch reviews using pageable backend: /reviews/all
    const pageSize = 3;
    let active = true;
    const fetchPage = async () => {
      try {
        const res = (await api.get(`/reviews/all`, { params: { page: 0, size: pageSize } })).data;
        if (!active) return;
        setReviews(res.content || []);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
        setReviews([]);
      }
    };

    fetchPage();
  }, [locations]);

  const swiperRef = useRef<SwiperType | null>(null);
  const visibleReviews = reviews.slice(0, 3);

  // navigation handled by Swiper instance methods; local index not required

  return (
      <section className={ styles.reviews }>
        <Container>
          <h2 className={ styles['reviews__title'] }>Останні відгуки</h2>

        <Swiper
          onSwiper={(s) => (swiperRef.current = s)}
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={styles['reviews__grid']}
        >
          {visibleReviews.map((review, index) => (
            <SwiperSlide key={review.id || index}>
              <div className={styles['review-card']}>
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
                  <span className={styles['review-card__author-name']}>{review.userResponse?.name || review.author}</span>
                  <span className={styles['review-card__author-location']}>{review.placeResponse?.name || review.location}</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles['reviews__pagination']}>
          <button
            aria-label="Previous"
            className={styles['reviews__pagination-btn']}
            onClick={() => swiperRef.current?.slidePrev()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <button
            aria-label="Next"
            className={styles['reviews__pagination-btn']}
            onClick={() => swiperRef.current?.slideNext()}
          >
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