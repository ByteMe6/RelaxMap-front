import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Container from "../Container/Container";
import styles from "./Header.module.scss";
import "normalize.css";
import AOS from "aos";
import "aos/dist/aos.css";

function Header() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  useEffect(() => {
    if (isBurgerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBurgerOpen]);

  const handleBurgerToggle = () => {
    setIsBurgerOpen((prev) => !prev);
  };

  const handleLinkClick = () => {
    setIsBurgerOpen(false);
  };

  return (
    <>
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
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                    onClick={handleLinkClick}
                  >
                    Головна
                  </NavLink>
                </li>
                <li className={styles.navListElement}>
                  <NavLink
                    to="/locations"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                    onClick={handleLinkClick}
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

            <button
              className={styles.burgerBtn}
              type="button"
              onClick={handleBurgerToggle}
            >
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
              <span className={styles.burgerLine}></span>
            </button>
          </div>
        </Container>
      </header>

      {isBurgerOpen && (
        <div className={styles.burgerOverlay} data-aos="fade-down">
          <div className={styles.burgerContent}>
            <nav className={styles.burgerNav}>
              <ul className={styles.burgerNavList}>
                <li className={styles.burgerNavItem}>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                    onClick={handleLinkClick}
                  >
                    Головна
                  </NavLink>
                </li>
                <li className={styles.burgerNavItem}>
                  <NavLink
                    to="/locations"
                    className={({ isActive }) =>
                      isActive ? styles.active : ""
                    }
                    onClick={handleLinkClick}
                  >
                    Місця відпочинку
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className={styles.burgerAuthBox}>
              <button className={styles.loginBtn}>Вхід</button>
              <button className={styles.regBtn}>Регістрація</button>
            </div>

            <button
              className={styles.burgerCloseBtn}
              type="button"
              onClick={handleBurgerToggle}
            >
              Закрити
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
