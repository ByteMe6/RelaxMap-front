import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

import { api } from "../../api/axiosInstance";
import { useReviews } from "./ReviewsContext";
import { useAddReviewModal } from "../../components/Modals/AddReviewModal/AddReviewModalContext";
import { useAppSelector } from "../../redux/hooks/hook";

import reviewsBlockStyles from "./ReviewsSection.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { Pagination } from "swiper/modules";
import { Star } from "../HomePage/ReviewsBlock";


function ReviewsSection() {
  const { id } = useParams();
  const { response, setResponse } = useReviews();
  const { setIsOpen } = useAddReviewModal();
  const currentUserEmail = useAppSelector((state) => state.auth.email);
  const swiperRef = useRef<SwiperType | null>(null);

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


  const visibleReviews = !response || response.content.length === 0 ? [] : response.content;

  // chunk reviews into groups of up to 3 for slides
  const chunkedReviews: any[] = [];
  for (let i = 0; i < visibleReviews.length; i += 3) {
    chunkedReviews.push(visibleReviews.slice(i, i + 3));
  }

  return (
    <section className={reviewsBlockStyles.reviews}>
      <div className={reviewsBlockStyles["reviews__box"]}>
        <div>
          <h2 className={reviewsBlockStyles["reviews__title"]}>Відгуки</h2>
        </div>

        {currentUserEmail ? (
          <button
            className={reviewsBlockStyles["reviews__button"]}
            onClick={() => setIsOpen(true)}
          >
            Залишити відгук
          </button>
        ) : (
          <p className={reviewsBlockStyles["reviews__auth-msg"]}>
            <Link to="/auth/login">Увійдіть</Link>, щоб оцінити локацію
          </p>
        )}
      </div>

      {!response || response.content.length === 0 ? (
        <p className={reviewsBlockStyles["reviews__empty"]}>
          Тут ще немає відгуків. Станьте першим!
        </p>
      ) : (
        <>
          <Swiper
            onSwiper={(s) => (swiperRef.current = s)}
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
          >
            {chunkedReviews.map((group, gi) => (
              <SwiperSlide key={gi}>
                <div className={reviewsBlockStyles["reviews__grid"]}>
                  {group.map((review: any) => (
                    <div key={review.id} className={reviewsBlockStyles["review-card"]}>
                      <div className={reviewsBlockStyles["review-card__rating"]}>
                        {Array.from({ length: 5 }).map((_, i) => {
                          let type: "full" | "half" | "empty" = "empty";
                          if (review.rating >= i + 1) type = "full";
                          else if (review.rating > i) type = "half";
                          return <Star key={i} type={type} />;
                        })}
                      </div>
                      <p className={reviewsBlockStyles["review-card__text"]}>{review.text}</p>
                      <div className={reviewsBlockStyles["review-card__author"]}>
                        <Link to={`/profile/${review.userResponse.email}`} className={reviewsBlockStyles["review-card__author-name"]}>
                          {review.userResponse.name}
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className={reviewsBlockStyles["reviews__pagination"]}>
            <button
              aria-label="Previous"
              className={reviewsBlockStyles["reviews__pagination-btn"]}
              onClick={() => swiperRef.current?.slidePrev()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
            </button>
            <button
              aria-label="Next"
              className={reviewsBlockStyles["reviews__pagination-btn"]}
              onClick={() => swiperRef.current?.slideNext()}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        </>
      )}
    </section>
  );
}

export default ReviewsSection;
