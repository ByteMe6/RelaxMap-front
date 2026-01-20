import { NavLink } from "react-router-dom";
import Container from "../Container/Container";
import styles from "./Header.module.scss";
// import "../../../node_modules/normalize.css/normalize.css"
import "normalize.css";

function Header() {
  return (
    <header className={styles.header}>
      <Container isHeader>
        <div className={styles.logoDiv}>
          <img src="/assets/logo.png" alt="logo" />
          <span className={styles.logoText}>Relax Map</span>
        </div>

        <div className={styles.half}>
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              <li className={styles.navListElement}>
                <NavLink
                  to="/"
                  className={({ isActive }) => (isActive ? styles.active : "")}
                >
                  Головна
                </NavLink>{" "}
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

          <div className={styles.authBox}>
            <button className={styles.loginBtn}>Вхід</button>
            <button className={styles.regBtn}>Регістрація</button>
          </div>
        </div>
      </Container>
    </header>
  );
}

export default Header;
