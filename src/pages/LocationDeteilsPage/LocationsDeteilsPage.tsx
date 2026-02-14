// src/pages/LocationDeteilsPage/LocationsDeteilsPage.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hook";
import { api } from "../../api/axiosInstance";
import { host } from "../../backendHost";
import Container from "../../components/Container/Container";
import ReviewsSection from "./ReviewsSection";
import styles from "./LocationDetailsPage.module.scss";
import { AddReviewModalProvider } from "../../components/Modals/AddReviewModal/AddReviewModalContext";
import AddReviewModal from "../../components/Modals/AddReviewModal/AddReviewModal";
import { ReviewProvider, useReviews } from "./ReviewsContext";
import Star from "./RatingLocation/Star/Star";

const LocationsDeteilsPageContent: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { response } = useReviews();

  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hover] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currentUserEmail = useAppSelector((state) => state.auth.email);

  useEffect(() => {
    if (!response || !response.content) return;
    const ratings = response.content
      .map((r: any) => Number(r.rating) || 0)
      .filter((v: number) => v > 0);
    if (ratings.length === 0) {
      setAverageRating(location?.rating ?? 2);
    } else {
      const sum = ratings.reduce((a: number, b: number) => a + b, 0);
      setAverageRating(sum / ratings.length);
    }
  }, [response, location]);

  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/places/${id}`);
        setLocation(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLocation();
  }, [id]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isFullscreen]);

  if (loading) {
    return (
      <div className={styles.wrapperLocationDetail}>

      </div>
    );
  }

  if (!location) {
    return (
      <div className={styles.wrapperLocationDetail}>
        Error
      </div>
    );
  }

  const authorEmail = location.userResponse?.email;
  const authorName = location.userResponse?.name || "Мандрівник";
  const totalReviews = response?.totalElements || 0;

  const isAuthor =
    currentUserEmail &&
    authorEmail &&
    authorEmail.toLowerCase() === currentUserEmail.toLowerCase();

  return (
    <AddReviewModalProvider>
      <div className={styles.wrapperLocationDetail}>
        <Container>
          <div className={styles.wrapperLocation}>
            <div className={styles.imageBox}>
              <div className={styles.imageWrapper} onClick={() => setIsFullscreen(true)}>
                <img
                  className={styles.imageLocation}
                  src={
                    location.imageName
                      ? `${host}/images/${location.imageName}`
                      : "/assets/placeholder.jpg"
                  }
                  alt={location.name}
                  loading="eager"
                  decoding="async"
                  fetchPriority="high"
                />
                <div className={styles.fullscreenHint}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                  <span>Натисніть для повноекранного перегляду</span>
                </div>
              </div>
            </div>

            <div className={styles.infoBox}>
              <div className={styles.topInfo}>
                <span className={styles.category}>{location.placeType}</span>
              </div>

              <h1 className={styles.title}>{location.name}</h1>

              <div className={styles.authorSection}>
                <span>Додав: </span>
                {authorEmail ? (
                  <Link
                    to={`/profile/${authorEmail}`}
                    className={styles.authorLink}
                  >
                    {authorName}
                  </Link>
                ) : (
                  <span>Анонім</span>
                )}
              </div>

              <p className={styles.description}>{location.description}</p>
              <p className={styles.region}>
                <strong>Регіон:</strong> {location.region}
              </p>

              <div className={styles.ratingRow}>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      active={star <= (hover ?? Math.round(averageRating))}
                    />
                  ))}
                </div>
                <div className={styles.ratingNumber}>
                  {averageRating.toFixed(1)}
                  <span className={styles.reviewsCount}>
                    ({totalReviews})
                  </span>
                </div>
              </div>

              {isAuthor && (
                <button
                  className={styles.btnEdit}
                  onClick={() =>
                    navigate(`/locations/${id}/edit`, {
                      state: { place: location },
                    })
                  }
                >
                  Редагувати
                </button>
              )}
            </div>
          </div>

          <hr className={styles.divider} />

          <div id="reviews-section">
            <ReviewsSection />
          </div>
        </Container>
      </div>

      {id && <AddReviewModal placeId={Number(id)} />}
      
      {isFullscreen && (
        <div
          className={styles.fullscreenOverlay}
          onClick={() => setIsFullscreen(false)}
        >
          <button
            className={styles.fullscreenClose}
            onClick={() => setIsFullscreen(false)}
            aria-label="Закрити"
          >
            ×
          </button>
          <img
            className={styles.fullscreenImage}
            src={
              location.imageName
                ? `${host}/images/${location.imageName}`
                : "/assets/placeholder.jpg"
            }
            alt={location.name}
            onClick={(e) => e.stopPropagation()}
            loading="eager"
            decoding="async"
          />
        </div>
      )}
    </AddReviewModalProvider>
  );
};

const LocationsDeteilsPage: React.FC = () => {
  return (
    <ReviewProvider>
      <LocationsDeteilsPageContent />
    </ReviewProvider>
  );
};

export default LocationsDeteilsPage;
