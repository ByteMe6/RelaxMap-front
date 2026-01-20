// Header.tsx
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import Container from "../Container/Container";
import styles from "./Header.module.scss";
import "normalize.css";
import AOS from "aos";
import "aos/dist/aos.css";

function Header() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <header className={styles.header}>
      <Container isHeader>
        <div className={styles.logoDiv} data-aos="fade-down">
          <img src="assets/logo.png" alt="logo" />
          <span className={styles.logoText}>Relax Map</span>
        </div>

        <div className={styles.half} data-aos="fade-left">
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navListElement}>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  Головна
                </NavLink>
              </li>
              <li className={styles.navListElement}>
                <NavLink
                  to="/locations"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  Місця відпочинку
                </NavLink>
              </li>
            </ul>
          </nav>

          <div className={styles.authBox} data-aos="fade-up">
            <button className={styles.loginBtn}>Вхід</button>
            <button className={styles.regBtn}>Регістрація</button>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
