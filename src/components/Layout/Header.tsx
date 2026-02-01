import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import Container from "../Container/Container";
import styles from "./Header.module.scss";
import "normalize.css";

import AOS from "aos";
import "aos/dist/aos.css";

import { useAppSelector, useAppDispatch } from "../../redux/hooks/hook";
import { logoutUser } from "../../redux/thunk/authThunk";


function Header() {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const { email } = useAppSelector((s) => s.auth);
  const isAuth = Boolean(accessToken);

  /* AOS */
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  /* Lock scroll on burger */
  useEffect(() => {
    document.body.style.overflow = isBurgerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isBurgerOpen]);

  const handleBurgerToggle = () => setIsBurgerOpen((prev) => !prev);
  const handleLinkClick = () => setIsBurgerOpen(false);

  // const profileLink = email ? `/profile/${encodeURIComponent(email)}` : "/profile";
const profileLink = email ? `/profile/${encodeURIComponent(email)}` : "/auth/login";

  return (
    <>
      <header className={styles.header}>
        <Container isHeader>
          {/* LOGO */}
          <div className={styles.logoDiv} data-aos="fade-down">
            <img src="assets/logo.png" alt="logo" />
            <span className={styles.logoText}>Relax Map</span>
          </div>

          <div className={styles.half} data-aos="fade-left">
            {/* NAV */}
            <nav className={styles.nav}>
              <ul className={styles.navList}>
                <li className={styles.navListElement}>
                  <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? styles.active : "")}
                    onClick={handleLinkClick}
                  >
                    Головна
                  </NavLink>
                </li>
                <li className={styles.navListElement}>
                  <NavLink
                    to="/locations"
                    className={({ isActive }) => (isActive ? styles.active : "")}
                    onClick={handleLinkClick}
                  >
                    Місця відпочинку
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className={styles.authBox} data-aos="fade-up">
              {!isAuth ? (
  <>
    <Link to="/auth/login" className={styles.loginBtn}>
      Вхід
    </Link>
    <Link to="/auth/register" className={styles.regBtn}>
      Реєстрація
    </Link>
  </>
) : (
  <>
    <Link to={profileLink} className={styles.loginBtn}>
      Профіль
    </Link>
    <button
      className={styles.regBtn}
      onClick={() => dispatch(logoutUser())}
    >
      Вийти
    </button>
  </>
)}
            </div>

            {/* BURGER BTN */}
            <button
              className={styles.burgerBtn}
              type="button"
              onClick={handleBurgerToggle}
            >
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
              <span className={styles.burgerLine} />
            </button>
          </div>
        </Container>
      </header>

      {/* BURGER MENU */}
      {isBurgerOpen && (
        <div className={styles.burgerOverlay} data-aos="fade-down">
          <div className={styles.burgerContent}>
            <nav className={styles.burgerNav}>
              <ul className={styles.burgerNavList}>
                <li className={styles.burgerNavItem}>
                  <NavLink
                    to="/"
                    className={({ isActive }) => (isActive ? styles.active : "")}
                    onClick={handleLinkClick}
                  >
                    Головна
                  </NavLink>
                </li>
                <li className={styles.burgerNavItem}>
                  <NavLink
                    to="/locations"
                    className={({ isActive }) => (isActive ? styles.active : "")}
                    onClick={handleLinkClick}
                  >
                    Місця відпочинку
                  </NavLink>
                </li>
              </ul>
            </nav>

            {/* AUTH BURGER */}
            <div className={styles.burgerAuthBox}>
{!isAuth ? (
  <>
    <Link to="/auth/login" className={styles.loginBtn}>
      Вхід
    </Link>
    <Link to="/auth/register" className={styles.regBtn}>
      Реєстрація
    </Link>
  </>
) : (
  <>
    <Link to={profileLink} className={styles.loginBtn}>
      Профіль
    </Link>
    <button
      className={styles.regBtn}
      onClick={() => dispatch(logoutUser())}
    >
      Вийти
    </button>
  </>
)}
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