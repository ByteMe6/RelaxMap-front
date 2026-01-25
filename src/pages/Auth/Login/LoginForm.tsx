import Container from "../../../components/Container/Container";
import styles from "../Auth.module.scss";
import "normalize.css";
import { Formik, Form, Field } from "formik";

export default function LoginForm() {
  return (
      <Container>
        <Formik
          initialValues={{ mail: "", password: "" }} // <-- добавили mail и password
          onSubmit={(values) => console.log(values)}
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
