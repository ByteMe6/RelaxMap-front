import { Formik, Form, Field } from "formik";
import styles from "../LocationFormPage/LocationForm.module.scss";
import { updateLocation } from "../../redux/thunk/thunkLocationUpdate";
import { useAppDispatch } from "../../redux/hooks/hook";
import { useRef } from "react";
import { host } from "../../backendHost";
import { resetLocation, saveOrUpdateLocation } from "../../redux/slice/locationSlice";
import { useNavigate } from "react-router-dom";
const handleCityInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
) => {
    const value = e.target.value;
    setFieldValue("name", value);
};
type LocationEditProps = {
    location: any;
};
function EditLocationForm({ location }: LocationEditProps) {
    console.log(location);
    const dispatch = useAppDispatch();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const imageUrl = location.imageName
        ? `${host}/images/${location.imageName}`
        : null;
    const optionsLocation: string[] = ["місто", "село", "море", "гори", "затока"];
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
        "Київська область",
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

    const navigate = useNavigate();
    return (
        <>
            <Formik
                enableReinitialize
                initialValues={{
                    name: location.name || "",
                    placeType: location.placeType || null,
                    region: location.region || null,
                    description: location.description || "",
                    file: null,
                }}
                onSubmit={(values) => {
                    const updated = {
                        ...location,
                        name: values.name,
                        placeType: values.placeType,
                        region: values.region,
                        description: values.description,
                        imageName: values.file ? URL.createObjectURL(values.file) : location.imageName,
                    };
                   dispatch(updateLocation(updated));
                    saveOrUpdateLocation(updated);
                    navigate(`/locations/${location.id}`);
                }}
            >
                {({ setFieldValue, resetForm, values }) => (
                    <Form className={styles.containerFormLocation} style={{marginTop:"10%"}}>
                           <p className={styles.titleNewLocation}>Редагування місця</p>
                        <label htmlFor="file" className={styles.labelLocation}>
                            Обкладинка статті
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            ref={fileRef}
                            onChange={(e) => {
                                const file = e.currentTarget.files?.[0] || null;
                                setFieldValue("file", file);
                            }}
                            style={{ display: "none" }}
                            id="file"
                        />
                        <label className={`${styles.photoInput} ${styles.photoInputLarge}`}>
                            {!values.file && imageUrl && (
                                <img src={imageUrl} className={styles.imageLocation} />
                            )}
                            {values.file && (
                                <img
                                    src={URL.createObjectURL(values.file)}
                                    className={styles.imageLocation}
                                    alt="preview"
                                />
                            )}
                        </label>
                        <button
                            onClick={() => fileRef.current?.click()}
                            className={styles.btnDownload}
                            type="button"
                        >
                            Завантажити фото
                        </button>
                        <label htmlFor="name" className={styles.labelLocation}>
                            Назва місця
                        </label>
                        <Field
                            name="name"
                            value={values.name}
                            placeholder="Введіть назву місця"
                            className={styles.inputLocation}
                            onChange={(e: any) => {
                                handleCityInput(e, setFieldValue);
                            }}
                        />
                        <label htmlFor="placeType" className={styles.labelLocation}>
                            Тип місця
                        </label>
                        <Field
                            as="select"
                            name="placeType"
                            className={`${styles.inputLocation} ${styles.inputLocationSelect}`}
                        >
                            <option>Оберіть тип місця</option>
                            {optionsLocation.map((location, index) => (
                                <option key={index}>{location}</option>
                            ))}
                        </Field>
                        <label htmlFor="region" className={styles.labelLocation}>
                            Регіон
                        </label>
                        <Field
                            as="select"
                            name="region"
                            className={`${styles.inputLocation} ${styles.inputLocationSelect}`}
                        >
                            <option value="">Оберіть регіон</option>
                            {regions.map((location, index) => (
                                <option key={index} value={location}>
                                    {location || "Регіон"}
                                </option>
                            ))}
                        </Field>
                        <label htmlFor="description" className={styles.labelLocation}>
                            Детальний опис
                        </label>
                        <Field
                            as="textarea"
                            name="description"
                            placeholder="Детальний опис локації"
                            className={styles.inputLocationArea}
                        />
                        <div className={styles.wrapperButton}>
                            <button
                                className={styles.btnLocation}
                                type="button"
                                onClick={() => {
                                    resetForm();
                                    dispatch(resetLocation());
                                }}
                            >
                                Відмінити
                            </button>
                            <button
                                className={`${styles.btnLocation} ${styles["btnLocation--post"]}`}
                                type="submit"
                            >
                                Опублікувати
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
}
export default EditLocationForm;
