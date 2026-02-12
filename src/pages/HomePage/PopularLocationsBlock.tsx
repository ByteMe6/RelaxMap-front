import { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hook";
import { fetchLocationsPage } from "../../redux/thunk/thunkLocation";
import Container from "../../components/Container/Container";
import LocationCard from "./LocationCard";
import styles from "./PopularLocationsBlock.module.scss";
import { host } from "../../backendHost";
import { api } from "../../api/axiosInstance";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

type ReviewsResponse = { content?: any[] };

function PopularLocationsBlock() {
  const dispatch = useAppDispatch();
  const allLocations = useAppSelector((state) => state.location.locations);
  const currentPage = useAppSelector((state) => state.location.currentPage);
  const totalPages = useAppSelector((state) => state.location.totalPages);
  const [reviewsByPlaceId, setReviewsByPlaceId] = useState<Record<string, any[]>>({});
  const [ratingByPlaceId, setRatingByPlaceId] = useState<Record<string, number>>({});
  const loadedRef = useRef<Set<string>>(new Set());
  const prevBtnRef = useRef<HTMLButtonElement | null>(null);
  const nextBtnRef = useRef<HTMLButtonElement | null>(null);
  const prefetchTriggered = useRef<boolean>(false);

  useEffect(() => {
    dispatch(fetchLocationsPage({ page: 0, size: 50 }));
  }, [dispatch]);

  useEffect(() => {
    if (currentPage < totalPages - 1 && !prefetchTriggered.current) {
      prefetchTriggered.current = true;
      dispatch(fetchLocationsPage({ page: currentPage + 1, size: 50 })).finally(() => {
        prefetchTriggered.current = false;
      });
    }
  }, [currentPage, totalPages, dispatch]);

  const total = (allLocations || []).length;

  const preloadReviews = async (placeId: number) => {
    const key = String(placeId);
    if (loadedRef.current.has(key)) return;
    loadedRef.current.add(key);
    try {
      const res = (await api.get(`/reviews/for-place/${placeId}`)).data as ReviewsResponse;
      const content = res?.content || [];
      const ratings = content
        .map((r: any) => Number(r?.rating) || 0)
        .filter((v: number) => v > 0);
      const avg = ratings.length
        ? ratings.reduce((a: number, b: number) => a + b, 0) / ratings.length
        : 0;
      setReviewsByPlaceId((prev) => ({ ...prev, [key]: content }));
      setRatingByPlaceId((prev) => ({ ...prev, [key]: avg }));
    } catch {
      setReviewsByPlaceId((prev) => ({ ...prev, [key]: [] }));
      setRatingByPlaceId((prev) => ({ ...prev, [key]: 0 }));
    }
  };

  return (
    <section className={styles['popular-locations']}>
      <Container>
        <div className={styles['popular-locations__header']}>
          <h2 className={styles['popular-locations__title']}>Популярні локації</h2>
          <NavLink to="/locations" className={styles['popular-locations__view-all-btn']}>
            Всі локації
          </NavLink>
        </div>

        {total > 0 && (
          <Swiper
            modules={[Navigation]}
            navigation={{
              prevEl: prevBtnRef.current,
              nextEl: nextBtnRef.current,
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              769: { slidesPerView: 3 },
            }}
            loop={total > 3}
            onBeforeInit={(swiper) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const nav = (swiper.params as any).navigation;
              if (nav) {
                nav.prevEl = prevBtnRef.current;
                nav.nextEl = nextBtnRef.current;
              }
            }}
            onInit={(swiper) => {
              const start = swiper.realIndex || 0;
              const ids = [
                allLocations[start]?.id,
                allLocations[(start + 1) % total]?.id,
                allLocations[(start + 2) % total]?.id,
              ].filter((v): v is number => typeof v === "number");
              ids.forEach((id) => preloadReviews(id));
            }}
            onSlideChange={(swiper) => {
              const start = swiper.realIndex || 0;
              const ids = [
                allLocations[start]?.id,
                allLocations[(start + 1) % total]?.id,
                allLocations[(start + 2) % total]?.id,
              ].filter((v): v is number => typeof v === "number");
              ids.forEach((id) => preloadReviews(id));
              
              if (start >= allLocations.length - 10 && currentPage < totalPages - 1) {
                dispatch(fetchLocationsPage({ page: currentPage + 1, size: 50 }));
              }
            }}
          >
            {allLocations.map((loc) => (
              <SwiperSlide key={loc.id}>
                <LocationCard
                  title={loc.name}
                  category={loc.placeType || "Локація"}
                  reviews={reviewsByPlaceId[String(loc.id)] || []}
                  rating={typeof ratingByPlaceId[String(loc.id)] === "number" ? ratingByPlaceId[String(loc.id)] : null}
                  image={loc.imageName ? `${host}/images/${loc.imageName}` : "/assets/placeholder.jpg"}
                  id={loc.id}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}

        <div className={styles["popular-locations__pagination"]}>
          <button
            ref={prevBtnRef}
            aria-label="Previous"
            className={styles["popular-locations__pagination-btn"]}
            disabled={total <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
            ref={nextBtnRef}
            aria-label="Next"
            className={styles["popular-locations__pagination-btn"]}
            disabled={total <= 1}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
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
      </Container>
    </section>
  );
}

export default PopularLocationsBlock;