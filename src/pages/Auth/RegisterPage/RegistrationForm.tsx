import Container from "../../../components/Container/Container";
import styles from "../Auth.module.scss";
import "normalize.css";
import { Formik, Form, Field } from "formik";
import axios from "axios";

export default function RegistrationForm() {

    function registerUser(mail: string, name: string, password: string){
        console.log(mail, name, password)
        let refreshToken: string;
        let accessToken: string = "";
        const post = axios.post("http://localhost:8080/auth/register", {"name": name,"email": mail, "password": password});
        post.then((promise)=>{
            // console.log(promise.data)
            refreshToken = promise.data.refresh
            accessToken = promise.data.access
            localStorage.setItem("refreshToken", refreshToken)
            localStorage.setItem("accesToken", accessToken)
        })
        // localStorage.setItem(post);
        return post;

    }

  return (
    <Container>
      <Formik
        initialValues={{ mail: "", password: "", name: "" }}
        onSubmit={(values) => registerUser(values.mail, values.name, values.password)}
      >
        {() => (
          <Form className={styles.loginFormContent}>
            <label
              htmlFor="name"
              className={`${styles.labelField} ${styles.leftText}`}
            >
              Імʼя*
            </label>
            <Field
              id="name"
              name="name"
              placeholder="Ваше імʼя"
              className={styles.inputField}
            />

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
                Зареєструватися
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  );
}
