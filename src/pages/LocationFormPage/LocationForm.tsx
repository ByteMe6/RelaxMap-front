import styles from "./LocationForm.module.scss"
import { Formik, Form, Field } from "formik"
import { useRef } from "react"
import type { RootState,} from "../../redux/store";
import type {useAppSelector, useAppDispatch} from "../../redux/hooks/hook"
import { searchLocation } from "../../redux/thunk/thunkLocationMap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
export default function LocationForm() {
    const fileRef = useRef<HTMLInputElement>(null)
    return (
        <Formik initialValues={{ name: "", type: "", region: "", description: "", image: null as File | null, location:"" }} onSubmit={(values) => console.log(values)}>
            {({ setFieldValue, values }) => (
                <Form className={styles.containerFormLocation}>
                    <label htmlFor="image" className={styles.labelLocation}>Обкладинка</label>
                    <input type="file" accept="image/*" ref={fileRef} onChange={(e) => {
                        const file = e.currentTarget.files?.[0] || null
                        setFieldValue("image", file)
                    }} style={{ display: "none" }} id="image" />
                    <label  className={styles.photoInput} >
                        {values.image && (
                            <img src={URL.createObjectURL(values.image)} className={styles.imageLocation}/>
                        )}
                    </label>
                    <button onClick={() => fileRef.current?.click()} className={styles.btnDownload} type="button">Завантажити фото</button>
                    <label htmlFor="name" className={styles.labelLocation}>Назва місця</label>
                    <Field name="name" placeholder="Введіть назву місця" className={styles.inputLocation}/>
                    <label htmlFor="type" className={styles.labelLocation}>Тип місця</label>
                    <Field name="type" placeholder="Оберіть тип місця" className={styles.inputLocation}/>
                    <label htmlFor="region" className={styles.labelLocation}>Регіон</label>
                    <Field name="region" placeholder="Оберіть регіон" className={styles.inputLocation}/>
                    <label htmlFor="description" className={styles.labelLocation}>Детальний опис</label>
                    <Field as="textarea" name="description" placeholder="Детальний опис локації"  className={styles.inputLocationArea}/>
                    <label htmlFor="location" className={styles.labelLocation}>Оберіть розташування</label>
                    <Field name="location" placeholder="Введіть назву місця" className={styles.inputLocation}/>
                    <button className={styles.btnSearch}>Пошук</button>
                <div className={styles.wraperButton}>
                <button className={styles.btnLocation}  type="button">Відмінити</button>
                <button className={`${styles.btnLocation} ${styles['btnLocation--post']}`} type="submit">Опублікувати</button>
                </div>
                </Form>
            )}
        </Formik>
    )
}