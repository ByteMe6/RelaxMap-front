import { Formik, Form, Field } from "formik";
import Container from "../../../components/Container/Container";
import styles from "../Auth.module.scss";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hook";
import { registerUser } from "../../../redux/thunk/authThunk";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((s) => s.auth);

  return (
    <Container>
      <Formik
        initialValues={{ email: "", password: "", name: "" }}
        onSubmit={async (values) => {
          const resultAction = await dispatch(registerUser(values));

          if (registerUser.fulfilled.match(resultAction)) {
            navigate("/");
          }
        }}
      >
        {() => (
          <Form className={styles.loginFormContent}>
            <label htmlFor="name">Імʼя*</label>
            <Field
              id="name"
              name="name"
              placeholder="Ваше імʼя"
              className={styles.inputField}
            />

            <label htmlFor="email">Пошта*</label>
            <Field
              id="email"
              name="email"
              placeholder="example@example.com"
              className={styles.inputField}
            />

            <label htmlFor="password">Пароль*</label>
            <Field
              id="password"
              type="password"
              name="password"
              placeholder="Password123"
              className={styles.inputField}
            />

            {error && <p className={styles.error}>{error}</p>}

            <button type="submit" className={styles.btn} disabled={loading}>
              {loading ? "Завантаження..." : "Зареєструватися"}
            </button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
