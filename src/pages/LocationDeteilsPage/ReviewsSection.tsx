import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";

import { api } from "../../api/axiosInstance";
import { useReviews } from "./ReviewsContext";
import { useAddReviewModal } from "../../components/Modals/AddReviewModal/AddReviewModalContext";
import { useAppSelector } from "../../redux/hooks/hook";

import { Star } from "../HomePage/ReviewsBlock";
import reviewsBlockStyles from "../HomePage/ReviewsBlock.module.scss";
import styles from "./ReviewsSection.module.scss";

function ReviewsSection() {
  const { id } = useParams();
  const { response, setResponse } = useReviews();
  const swiperRef = useRef<SwiperType | null>(null);
  const { setIsOpen } = useAddReviewModal();
  const currentUserEmail = useAppSelector((state) => state.auth.email);

  useEffect(() => {
    (async () => {
      try {
        const res = (await api.get(`/reviews/for-place/${id}`)).data;
        setResponse(res);
      } catch (e) {
        setResponse({
          content: [],
          totalElements: 0,
          totalPages: 0,
          pageNumber: 0,
          pageSize: 0,
        });
      }
    })();
  }, [id, setResponse]);

  return (
    <section className={styles.reviews}>
      <div className={styles["reviews__box"]}>
        <h2 className={styles["reviews__title"]}>Відгуки</h2>

        {currentUserEmail ? (
          <button
            className={styles["reviews__button"]}
            onClick={() => setIsOpen(true)}
          >
            Залишити відгук
          </button>
        ) : (
          <p className={styles["reviews__auth-msg"]}>
            <Link to="/login">Увійдіть</Link>, щоб оцінити локацію
          </p>
        )}
      </div>

      {!response || response.content.length === 0 ? (
        <p className={styles["reviews__empty"]}>
          Тут ще немає відгуків. Станьте першим! 👨🏻🦰
        </p>
      ) : (
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          slidesPerView={1}
          spaceBetween={20}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className={reviewsBlockStyles["reviews__grid"]}
        >
          {response.content.map((review: any) => (
            <SwiperSlide key={review.id}>
              <div className={reviewsBlockStyles["review-card"]}>
                <div className={reviewsBlockStyles["review-card__rating"]}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      type={review.rating >= i + 1 ? "full" : "empty"}
                    />
                  ))}
                </div>
                <p className={reviewsBlockStyles["review-card__text"]}>
                  {review.text}
                </p>
                <div className={reviewsBlockStyles["review-card__author"]}>
                  <Link
                    to={`/profile/${review.userResponse.email}`}
                    className={reviewsBlockStyles["review-card__author-name"]}
                  >
                    {review.userResponse.name}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
}

export default ReviewsSection;
