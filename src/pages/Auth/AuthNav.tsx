import { NavLink } from "react-router-dom";
import styles from "./Auth.module.scss";

export default function AuthNav() {
  return (
    <ul className={styles.linksBox}>
      <li className={styles.linksBoxItem}>
        <NavLink
          to="/auth/register"
          className={({ isActive }) =>
            isActive ? `${styles.linksBoxItem} ${styles.activeLinkBoxItem}` : styles.linksBoxItem
          }
        >
          Реєстрація
        </NavLink>
      </li>

      <li className={styles.linksBoxItem}>
        <NavLink
          to="/auth/login"
          className={({ isActive }) =>
            isActive ? `${styles.linksBoxItem} ${styles.activeLinkBoxItem}` : styles.linksBoxItem
          }
        >
          Вхід
        </NavLink>
      </li>
    </ul>
  );
}