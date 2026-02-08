import Container from "../../../components/Container/Container";
import Header from "../../../components/Layout/Header";
import styles from "../Auth.module.scss";
import AuthNav from "../AuthNav";
import RegistrationForm from "./RegistrationForm";


export default function RegisterPage() {
  return (
    <div className={styles.loginForm}>
      <Header/>
      <Container isLogin>
        <AuthNav />

        <div className={styles.loginFormContent}>
          <h1 className={styles.heading}>Реєстарція</h1>
          <RegistrationForm />
        </div>
      </Container>
      <div className={styles.copyright}>© 2025 Relax Map</div>
    </div>
  );
}
