import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hook";
import { fetchAllLocations } from "../../redux/thunk/thunkLocation";
import Container from "../../components/Container/Container";
import LocationCard from "./LocationCard";
import styles from "./PopularLocationsBlock.module.scss";
import { host } from "../../backendHost";

function PopularLocationsBlock() {
  const dispatch = useAppDispatch();
  const allLocations = useAppSelector((state) => state.location.locations);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    dispatch(fetchAllLocations());
  }, [dispatch]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Convert locations to card format
  const locations = allLocations.map((loc) => ({
    title: loc.name,
    category: loc.placeType || "Локація",
    rating: loc.rating || 0,
    image: loc.imageName ? `${host}/images/${loc.imageName}` : "/assets/placeholder.jpg",
    id: loc.id,
  }));

  const nextLocation = () => {
    if (locations.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % locations.length);
    }
  };

  const prevLocation = () => {
    if (locations.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + locations.length) % locations.length);
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

        <div className={styles['popular-locations__grid']}>
          {isMobile ? (
            <LocationCard {...locations[currentIndex]} />
          ) : (
            locations.map((loc, index) => (
              <LocationCard key={index} {...loc} />
            ))
          )}
        </div>

        <div className={styles['popular-locations__pagination']}>
          <button
            aria-label="Previous"
            className={styles['popular-locations__pagination-btn']}
            onClick={prevLocation}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <button
            aria-label="Next"
            className={styles['popular-locations__pagination-btn']}
            onClick={nextLocation}
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

export default PopularLocationsBlock;