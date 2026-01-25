import { NavLink } from "react-router-dom";
import Container from "../../components/Container/Container";
import LocationCard from "./LocationCard";
import styles from "./PopularLocationsBlock.module.scss";

import firstImg from "./img/first.png";
import secondImg from "./img/second.png";
import thirdImg from "./img/third.png";

function PopularLocationsBlock() {
  const locations = [
    {
      title: "Сонячна Рів'єра",
      category: "Море",
      rating: 4.5,
      image: firstImg
    },
    {
      title: "Тилігульський Спокій",
      category: "Море",
      rating: 4.5,
      image: secondImg
    },
    {
      title: "Кінбурнська Вольниця",
      category: "Море",
      rating: 4.5,
      image: thirdImg
    }
  ];

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
          {locations.map((loc, index) => (
            <LocationCard
              key={index}
              {...loc}
            />
          ))}
        </div>

        <div className={styles['popular-locations__pagination']}>
          <button aria-label="Previous" className={styles['popular-locations__pagination-btn']}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </button>
          <button aria-label="Next" className={styles['popular-locations__pagination-btn']}>
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