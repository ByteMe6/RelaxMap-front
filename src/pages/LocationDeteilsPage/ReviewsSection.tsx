import { useEffect, useRef } from "react";
import axios from "axios";
import { host } from "../../backendHost.ts";
import { useParams } from "react-router-dom";
import Container from "../../components/Container/Container.tsx";
import { Star } from "../HomePage/ReviewsBlock.tsx";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import reviewsBlockStyles from "../HomePage/ReviewsBlock.module.scss";
import styles from "./ReviewsSection.module.scss";
import { useReviews } from "./ReviewsContext.tsx";
import { useAddReviewModal } from "../../components/Modals/AddReviewModal/AddReviewModalContext.tsx";

interface Review {
  id: number;
  text: string;
  rating: number;
  userResponse: {
    id: number;
    name: string;
    email: string;
  };
  placeResponse: {
    id: number;
    name: string;
    placeType: string;
    region: string;
    imageName: string;
  };
}

interface ReviewData {
  content: Review[];
  totalElements: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

function ReviewsSection() {
  const { id } = useParams();
  const { response, setResponse } = useReviews();
  const swiperRef = useRef<SwiperType | null>(null);
  const { setIsOpen } = useAddReviewModal();

  useEffect(() => {
    (async () => {
      try {
        const res: ReviewData = (
            await axios.get(`${ host }/reviews/for-place/${ id }`)
        ).data;
        setResponse(res);
      } catch (e) {
        console.error("Failed to load reviews", e);
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

  const handleOpen = () => {
    setIsOpen(true);
  };

  const hasReviews = response && response.content.length > 0;
  const canLoop = response && response.content.length > 3;

  return (
      <section className={ styles["reviews"] }>
        <Container>
          <div className={ styles["reviews__box"] }>
            <h2 className={ styles["reviews__title"] }>Відгуки</h2>
            <button className={ styles["reviews__button"] } onClick={ handleOpen }>
              Залишити відгук
            </button>
          </div>

          {/* EMPTY STATE */ }
          { response && response.content.length === 0 && (
              <div className={ styles["reviews__empty"] }>
                <p className={ styles["reviews__empty-text"] }>
                  Поки що немає жодного відгуку
                </p>
                <button className={ styles["reviews__empty-btn"] } onClick={ handleOpen }>
                  Залишити перший відгук
                </button>
              </div>
          ) }

          {/* SLIDER */ }
          { hasReviews && (
              <>
                <Swiper
                    onSwiper={ (swiper) => (swiperRef.current = swiper) }
                    slidesPerView={ 3 }
                    spaceBetween={ 24 }
                    loop={ !!canLoop }
                    className={ reviewsBlockStyles["reviews__grid"] }
                >
                  { response!.content.map((review) => (
                      <SwiperSlide key={ review.id }>
                        <div className={ reviewsBlockStyles["review-card"] }>
                          <div
                              className={
                                reviewsBlockStyles["review-card__rating"]
                              }
                          >
                            { Array.from({ length: 5 }).map((_, i) => {
                              let type: "full" | "half" | "empty" = "empty";
                              if (review.rating >= i + 1) type = "full";
                              else if (review.rating > i) type = "half";

                              return <Star key={ i } type={ type }/>;
                            }) }
                          </div>

                          <p
                              className={
                                reviewsBlockStyles["review-card__text"]
                              }
                          >
                            { review.text }
                          </p>

                          <div
                              className={
                                reviewsBlockStyles["review-card__author"]
                              }
                          >
                      <span
                          className={
                            reviewsBlockStyles[
                                "review-card__author-name"
                                ]
                          }
                      >
                        { review.userResponse.name }
                      </span>
                            <span
                                className={
                                  reviewsBlockStyles[
                                      "review-card__author-location"
                                      ]
                                }
                            >
                        { review.placeResponse.name }
                      </span>
                          </div>
                        </div>
                      </SwiperSlide>
                  )) }
                </Swiper>

                { canLoop && (
                    <div
                        className={
                          reviewsBlockStyles["reviews__pagination"]
                        }
                    >
                      <button
                          onClick={ () =>
                              swiperRef.current?.slidePrev()
                          }
                          aria-label="Previous"
                          className={
                            reviewsBlockStyles["reviews__pagination-btn"]
                          }
                      >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={ 1.5 }
                            stroke="currentColor"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                          />
                        </svg>
                      </button>

                      <button
                          onClick={ () =>
                              swiperRef.current?.slideNext()
                          }
                          aria-label="Next"
                          className={
                            reviewsBlockStyles["reviews__pagination-btn"]
                          }
                      >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={ 1.5 }
                            stroke="currentColor"
                        >
                          <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                          />
                        </svg>
                      </button>
                    </div>
                ) }
              </>
          ) }
        </Container>
      </section>
  );
}

export default ReviewsSection;
