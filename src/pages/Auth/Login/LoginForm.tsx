import { Formik, Form, Field } from "formik";
import Container from "../../../components/Container/Container";
import styles from "../Auth.module.scss";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks/hook";
import { loginUser } from "../../../redux/thunk/authThunk";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((s) => s.auth);
  const navigate = useNavigate();

  return (
    <Container>

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          const resultAction = await dispatch(loginUser(values));

          if (loginUser.fulfilled.match(resultAction)) {
            navigate("/");
          }
        }}
      >
        {() => (
          <Form className={styles.loginFormContent}>
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
              {loading ? "Завантаження..." : "Увійти"}
            </button>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
