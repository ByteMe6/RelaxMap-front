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
  const [hover, setHover] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(2);

  const currentUserEmail = useAppSelector((state) => state.auth.email);

  useEffect(() => {
    // compute average rating from reviews data provided by ReviewsContext
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

  // ratings are display-only in details; no client-side rating action
  const handleRating = (_star: number) => {};

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
              <img
                className={styles.imageLocation}
                src={
                  location.imageName
                    ? `${host}/images/${location.imageName}`
                    : "/assets/placeholder.jpg"
                }
                alt={location.name}
              />
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
