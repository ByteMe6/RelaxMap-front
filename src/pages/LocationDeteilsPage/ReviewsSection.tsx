import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

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
  const { setIsOpen } = useAddReviewModal();
  const currentUserEmail = useAppSelector((state) => state.auth.email);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = (await api.get(`/reviews/for-place/${id}`)).data;
        setResponse(res);

        // Calculate average rating
        if (res.content && res.content.length > 0) {
          const avgRating =
            res.content.reduce((sum: number, review: any) => sum + review.rating, 0) /
            res.content.length;
          setAverageRating(Math.round(avgRating * 10) / 10);
        }
      } catch (e) {
        setResponse({
          content: [],
          totalElements: 0,
          totalPages: 0,
          pageNumber: 0,
          pageSize: 0,
        });
        setAverageRating(0);
      }
    })();
  }, [id, setResponse]);

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % (response?.content?.length || 1));
  };

  const prevReview = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + (response?.content?.length || 1)) % (response?.content?.length || 1)
    );
  };

  const visibleReviews = !response || response.content.length === 0
    ? []
    : isMobile
      ? [response.content[currentIndex]]
      : response.content;

  return (
    <section className={reviewsBlockStyles.reviews}>
      <div className={reviewsBlockStyles["reviews__box"]}>
        <div>
          <h2 className={reviewsBlockStyles["reviews__title"]}>Відгуки</h2>
          {response && response.content.length > 0 && (
            <p className={reviewsBlockStyles["reviews__rating"]}>Рейтинг: {averageRating}</p>
          )}
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
          <div className={reviewsBlockStyles["reviews__grid"]}>
            {visibleReviews.map((review: any) => {
              const reviewIndex = isMobile ? currentIndex : response.content.indexOf(review);
              return (
                <div key={review.id} className={reviewsBlockStyles["review-card"]}>
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
              );
            })}
          </div>

          {isMobile && response.content.length > 1 && (
            <div className={reviewsBlockStyles["reviews__pagination"]}>
              <button
                aria-label="Previous"
                className={reviewsBlockStyles["reviews__pagination-btn"]}
                onClick={prevReview}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
              </button>
              <button
                aria-label="Next"
                className={reviewsBlockStyles["reviews__pagination-btn"]}
                onClick={nextReview}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default ReviewsSection;
