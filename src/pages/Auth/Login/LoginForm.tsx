import Container from "../../../components/Container/Container";
import styles from "../Auth.module.scss";
import "normalize.css";
import { Formik, Form, Field } from "formik";
import axios from "axios";
import { host } from "../../../backendHost"

export default function LoginForm() {
  function loginUser(mail: string, password: string) {
    console.log(mail, password);
    let refreshToken: string;
    let accessToken: string = "";
    const post = axios.post(`${host}/auth/login`, {
      email: mail,
      password: password,
    });
    post.then((promise) => {
      refreshToken = promise.data.refresh;
      accessToken = promise.data.access;
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("accesToken", accessToken);
      localStorage.setItem("email", mail)
      localStorage.setItem("password", password)
    });
    return post;
  }
  return (
    <Container>
      <Formik
        initialValues={{ mail: "", password: "" }}
        onSubmit={(v) => (
          loginUser(v.mail, v.password)
        )}
      >
        {() => (
          <Form className={styles.loginFormContent}>
            <label
              htmlFor="mail"
              className={`${styles.labelField} ${styles.leftText}`}
            >
              Пошта*
            </label>
            <Field
              id="mail"
              name="mail"
              placeholder="example@example.com"
              className={styles.inputField}
            />

            <label
              htmlFor="password"
              className={`${styles.labelField} ${styles.leftText}`}
            >
              Пороль*
            </label>
            <Field
              id="password"
              type="password"
              name="password"
              placeholder="Password123"
              className={styles.inputField}
            />

            <div className={styles.buttonWrapper}>
              <button
                type="submit"
                className={`${styles.btn} ${styles["btn--submit"]}`}
              >
                Увійти
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
