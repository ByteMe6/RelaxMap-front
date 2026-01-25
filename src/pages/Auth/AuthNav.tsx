import { Link } from "react-router-dom";
import styles from "./Auth.module.scss";

export default function AuthNav() {
  return (
    // <Container>
      <ul className={styles.linksBox}>
        <li className={styles.linksBoxItem}>
          <Link to="/auth/register">Реєстрація</Link>
        </li>
        <li className={`${styles.linksBoxItem} ${styles.activeLinkBoxItem}`}>
          <Link to="/auth/login">Вхід</Link>
        </li>
      </ul>
    // </Container>
  );
}
