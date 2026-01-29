import styles from "./LocationForm.module.scss"
import { Formik, Form, Field } from "formik"
import { useState, useRef } from "react"
import { useAppDispatch, } from "../../redux/hooks/hook"
import { searchLocation } from "../../redux/thunk/thunkLocationMap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { postNewLocation } from "../../redux/thunk/thunkLocation";
export default function LocationForm() {
    const dispatch = useAppDispatch()
    const fileRef = useRef<HTMLInputElement>(null)
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)
    const handleSearchLocation = (
         locationName: string,
         setFieldValue: (field: string, value: any) => void
    ) => {
        if (!locationName.trim()) return alert("Введіть назву локації");

        dispatch(searchLocation({ name: locationName.trim() }))
            .then((res: any) => {
                const payload = res.payload;
                if (payload && payload.lat && payload.lng) {
                    setCoords({ lat: payload.lat, lng: payload.lng });
                    setFieldValue("lat", payload.lat);
                    setFieldValue("lng", payload.lng);
                } else {
                    alert("Локацію не знайдено");
                }
            });
    };
    return (
        <Formik initialValues={{ name: "", placeType: "", region: "", description: "", imageName: null as File | null, location: "" }} onSubmit={(values) => {
            dispatch(postNewLocation({name:values.name, placeType:values.placeType, region:values.region ,description:values.description, imageName:values.imageName}))
        }}>
            {({ setFieldValue, values }) => (
                <Form className={styles.containerFormLocation}>
                    <label htmlFor="imageName" className={styles.labelLocation}>Обкладинка</label>
                    <input type="file" accept="image/*" ref={fileRef} onChange={(e) => {
                        const file = e.currentTarget.files?.[0] || null
                        setFieldValue("imageName", file)
                    }} style={{ display: "none" }} id="imageName" />
                    <label className={`${styles.photoInput} ${styles.photoInputLarge}`} >
                        {values.imageName && (
                            <img src={URL.createObjectURL(values.imageName)} className={styles.imageLocation} />
                        )}
                    </label>
                    <button onClick={() => fileRef.current?.click()} className={styles.btnDownload} type="button">Завантажити фото</button>
                    <label htmlFor="name" className={styles.labelLocation}>Назва місця</label>
                    <Field name="name" placeholder="Введіть назву місця" className={styles.inputLocation} />
                    <label htmlFor="placeType" className={styles.labelLocation}>Тип місця</label>
                    <Field name="placeType" placeholder="Оберіть тип місця" className={styles.inputLocation} />
                    <label htmlFor="region" className={styles.labelLocation}>Регіон</label>
                    <Field name="region" placeholder="Оберіть регіон" className={styles.inputLocation} />
                    <label htmlFor="description" className={styles.labelLocation}>Детальний опис</label>
                    <Field as="textarea" name="description" placeholder="Детальний опис локації" className={styles.inputLocationArea} />
                    <label htmlFor="location" className={styles.labelLocation}>Оберіть розташування</label>
                    <div className={styles.wrapperLocation}>
                    <Field name="location" placeholder="Введіть назву місця" className={`${styles.inputLocation} ${styles.search}`}  />
                    <button className={styles.btnSearch} onClick={() => handleSearchLocation(values.location, setFieldValue)}>Пошук</button>
                    </div>
                    {coords && (
                        <div className={styles.mapLocation}>
                            <MapContainer center={[coords.lat, coords.lng] as LatLngExpression} zoom={13} style={{ height: "100%" }}>
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution="&copy; OpenStreetMap contributors"
                                />
                                <Marker position={[coords.lat, coords.lng] as LatLngExpression}>
                                    <Popup>{values.location}</Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    )}
                    <div className={styles.wrapperButton}>
                        <button className={styles.btnLocation} type="button">Відмінити</button>
                        <button className={`${styles.btnLocation} ${styles['btnLocation--post']}`} type="submit">Опублікувати</button>
                    </div>
                </Form>
            )}
        </Formik>
    )
}