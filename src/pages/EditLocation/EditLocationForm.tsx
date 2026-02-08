// src/pages/EditLocation/EditLocationForm.tsx

import { Formik, Form, Field } from "formik";
import styles from "../LocationFormPage/LocationForm.module.scss";
import { updateLocation } from "../../redux/thunk/thunkLocationUpdate";
import { useAppDispatch } from "../../redux/hooks/hook";
import { useRef } from "react";
import { host } from "../../backendHost";
import { saveOrUpdateLocation } from "../../redux/slice/locationSlice";
import { setCredentials } from "../../redux/slice/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Location {
  id: number;
  name: string;
  placeType: string | null;
  region: string | null;
  description: string;
  imageName?: string;
  image?: string;
  rating?: number;
}

interface LocationEditProps {
  location: Location | null;
}

interface FormValues {
  name: string;
  placeType: string;
  region: string;
  description: string;
  file: File | null;
}

function EditLocationForm({ location }: LocationEditProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement | null>(null);

  if (!location) return <div>Завантаження...</div>;

  const imageUrl = location.imageName
    ? `${host}/images/${location.imageName}`
    : null;

  const optionsLocation = ["місто", "село", "море", "гори", "затока"];
  const regions = [
    "Київська область",
    "Вінницька область",
    "Волинська область",
    "Дніпропетровська область",
    "Донецька область",
    "Житомирська область",
    "Закарпатська область",
    "Запорізька область",
    "Івано-Франківська область",
    "Кіровоградська область",
    "Луганська область",
    "Львівська область",
    "Миколаївська область",
    "Одеська область",
    "Полтавська область",
    "Рівненська область",
    "Сумська область",
    "Тернопільська область",
    "Харківська область",
    "Херсонська область",
    "Хмельницька область",
    "Черкаська область",
    "Чернівецька область",
    "Чернігівська область",
  ];

  // універсальний logout: чистимо токени й перекидаємо на /login
  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // якщо setCredentials вимагає конкретний тип, можна передати null або порожні строки
    dispatch(
      setCredentials({
        accessToken: "",
        refreshToken: "",
      })
    );
    navigate("/login");
  };

  // якщо accessToken прострочений — пробуємо оновити й повторити update
  const handleRefreshAndRetry = async (values: FormValues) => {
    const refreshToken = localStorage.getItem("refreshToken");

    if (!refreshToken) {
      logout();
      return;
    }

    try {
      const res = await axios.post(`${host}/auth/refresh`, { refreshToken });
      const { accessToken, refreshToken: newRefresh } = res.data;

      // оновлюємо токени в redux + localStorage (інтерсептор їх підхопить)
      dispatch(setCredentials({ accessToken, refreshToken: newRefresh }));
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", newRefresh);

      const resultAction = await (dispatch as any)(
        updateLocation({
          id: location.id,
          name: values.name,
          placeType: values.placeType,
          region: values.region,
          description: values.description,
          file: values.file,
        })
      );

      if (updateLocation.fulfilled.match(resultAction)) {
        (dispatch as any)(saveOrUpdateLocation(resultAction.payload));
        navigate(`/locations/${location.id}`);
      } else {
        const error = resultAction.payload as
          | { status: number; message: string }
          | undefined;

        // якщо навіть після refresh знову 401 → logout
        if (error?.status === 401 || error?.message === "Unauthorized") {
          logout();
        } else if (error) {
          alert(`Помилка при оновленні місця: ${error.message}`);
        }
      }
    } catch (e) {
      // refreshToken невалідний / бекенд впав → logout
      logout();
    }
  };

  const performUpdate = async (values: FormValues) => {
    // мінімальна валідація обов’язкових полів
    if (!values.name.trim() || !values.placeType.trim() || !values.region.trim()) {
      alert("Будь ласка, заповніть Назву, Тип місця та Регіон.");
      return;
    }

    const resultAction = await (dispatch as any)(
      updateLocation({
        id: location.id,
        name: values.name,
        placeType: values.placeType,
        region: values.region,
        description: values.description,
        file: values.file,
      })
    );

    if (updateLocation.fulfilled.match(resultAction)) {
      (dispatch as any)(
        saveOrUpdateLocation({
          ...location,
          ...resultAction.payload,
        })
      );
      navigate(`/locations/${location.id}`);
    } else {
      const error = resultAction.payload as
        | { status: number; message: string }
        | undefined;

      // accessToken невалідний → пробуємо refresh
      if (error?.status === 401 || error?.message === "Unauthorized") {
        await handleRefreshAndRetry(values);
      } else if (error) {
        alert(`Помилка при оновленні місця: ${error.message}`);
      } else {
        alert("Сталася невідома помилка при оновленні місця.");
      }
    }
  };

  return (
    <Formik<FormValues>
      enableReinitialize
      initialValues={{
        name: location.name,
        placeType: location.placeType ?? "",
        region: location.region ?? "",
        description: location.description,
        file: null,
      }}
      onSubmit={performUpdate}
    >
      {({ setFieldValue, values }) => (
        <Form
          className={styles.containerFormLocation}
          style={{ marginTop: "10%" }}
        >
          <p className={styles.titleNewLocation}>Редагування місця</p>

          <input
            type="file"
            accept="image/*"
            ref={fileRef}
            onChange={(e) =>
              setFieldValue("file", e.currentTarget.files?.[0] || null)
            }
            style={{ display: "none" }}
          />

          <div
            className={styles.photoInput}
            onClick={() => fileRef.current?.click()}
            style={{ cursor: "pointer" }}
          >
            {!values.file && imageUrl && (
              <img src={imageUrl} className={styles.imageLocation} alt="loc" />
            )}
            {values.file && (
              <img
                src={URL.createObjectURL(values.file)}
                className={styles.imageLocation}
                alt="pre"
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className={styles.btnDownload}
          >
            Змінити фото
          </button>

          <label className={styles.labelLocation}>Назва місця</label>
          <Field
            name="name"
            className={styles.inputLocation}
            placeholder="Назва"
          />

          <label className={styles.labelLocation}>Тип місця</label>
          <Field as="select" name="placeType" className={styles.inputLocation}>
            <option value="">Оберіть тип</option>
            {optionsLocation.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </Field>

          <label className={styles.labelLocation}>Регіон</label>
          <Field as="select" name="region" className={styles.inputLocation}>
            <option value="">Оберіть регіон</option>
            {regions.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </Field>

          <label className={styles.labelLocation}>Детальний опис</label>
          <Field
            as="textarea"
            name="description"
            className={styles.inputLocationArea}
          />

          <div className={styles.wrapperButton}>
            <button
              type="button"
              className={styles.btnLocation}
              onClick={() => navigate(-1)}
            >
              Відмінити
            </button>
            <button type="submit" className={styles.btnLocation}>
              Зберегти зміни
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default EditLocationForm;
