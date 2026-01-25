import Container from "../../../components/Container/Container";
import LoginForm from "./LoginForm";
import styles from "../Auth.module.scss";
// import { Link } from "react-router-dom";
import AuthNav from "../AuthNav";

export default function LoginPage() {
  return (
    <div className={styles.loginForm}>
      <Container isLogin>
        <AuthNav/>

        <div className={styles.loginFormContent}>
          <h1 className={styles.heading}>Вхід</h1>

          <LoginForm />
        </div>
      </Container>
      <div className={styles.copyright}>© 2025 Relax Map</div>
    </div>
  );
}
