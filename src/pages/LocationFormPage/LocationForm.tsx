import styles from "./LocationForm.module.scss"
import { Formik, Form, Field } from "formik"
import React, { useState, useRef } from "react"
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hook"
import { searchLocation } from "../../redux/thunk/thunkLocationMap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { postNewLocation } from "../../redux/thunk/thunkLocation";
import { searchCities, searchRegions } from "../../redux/thunk/thunkTypeLocation";
export default function LocationForm() {
    const dispatch = useAppDispatch()
    const fileRef = useRef<HTMLInputElement>(null)
    const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null)
    const [query, setQuery] = useState("")
    const [showCitySuggestions, setShowCitySuggestions] = useState(false)
    const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(null)
    const [showRegionSuggestions, setShowRegionSuggestions] = useState(false)
    const cities = useAppSelector((state) => state.location.listCity) || []
    const regions = useAppSelector((state) => state.location.listRegion) || []
    const optionsLocation: string[] = ["місто", "село", "смт"]
    const optionRegion:string[] = ["Lviv"]
    const info = useAppSelector(state => state.location.info)
    console.log(info)
    const handleCityInput = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
        const value = e.target.value
        setQuery(value)
        setFieldValue("location", value)
        if (value.length >= 1) {
            dispatch(searchCities(value))
            setShowCitySuggestions(true)
        }
    }
    const handleCitySelect = (city:any, setFieldValue:any) => {
        setFieldValue("name", city.name)
        setQuery(city.name)
        setShowCitySuggestions(false)
        setSelectedCountryCode(city.countryCode)
        setFieldValue("region", "")
        dispatch(searchRegions(city.countryCode))
    }

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
        <Formik initialValues={{ name: "", placeType: "", region: "", description: "", file: null as File | null, location: "" }} onSubmit={(values) => {
            dispatch(postNewLocation({ name: values.name, placeType: values.placeType, region: values.region, description: values.description, file: values.file }))
        }}>
            {({ setFieldValue, values }) => (
                <Form className={styles.containerFormLocation}>
                    <label htmlFor="file" className={styles.labelLocation}>Обкладинка</label>
                    <input type="file" accept="image/*" ref={fileRef} onChange={(e) => {
                        const file = e.currentTarget.files?.[0] || null
                        setFieldValue("file", file)
                    }} style={{ display: "none" }} id="file" />
                    <label className={`${styles.photoInput} ${styles.photoInputLarge}`} >
                        {values.file && (
                            <img src={URL.createObjectURL(values.file)} className={styles.imageLocation} />
                        )}
                    </label>
                    <button onClick={() => fileRef.current?.click()} className={styles.btnDownload} type="button">Завантажити фото</button>
                    <label htmlFor="name" className={styles.labelLocation} >Назва місця</label>
                    <Field name="name" value={values.name} placeholder="Введіть назву місця" className={styles.inputLocation} onChange={(e: any) => handleCityInput(e, setFieldValue)} />
                    {showCitySuggestions && cities.length > 0 && (
                        <ul>
                            {cities.map((city) => (
                                <li key={city.id} onClick={() => handleCitySelect(city, setFieldValue)}>
                                    {city.name}, {city.country}
                                </li>
                            ))}
                        </ul>
                    )}
                    <label htmlFor="placeType" className={styles.labelLocation}>Тип місця</label>
                    <Field as="select" name="placeType" className={styles.inputLocation} >
                        <option>Оберіть тип місця</option>
                        {optionsLocation.map((location, index) => (
                            <option key={index}>{location}</option>
                        ))}
                    </Field>
                    <label htmlFor="region" className={styles.labelLocation}>Регіон</label>
                    <Field as="select" name="region" className={styles.inputLocation} >
                        <option>Оберіть регіон</option>
                      {optionsLocation.map((location, index) => (
                            <option key={index}>{location}</option>
                        ))}
                    </Field>
                    <label htmlFor="description" className={styles.labelLocation}>Детальний опис</label>
                    <Field as="textarea" name="description" placeholder="Детальний опис локації" className={styles.inputLocationArea} />
                    <label htmlFor="location" className={styles.labelLocation}>Оберіть розташування</label>
                    <div className={styles.wrapperLocation}>
                        <Field name="location" placeholder="Введіть назву місця" className={`${styles.inputLocation} ${styles.search}`} />
                        <button type="button" className={styles.btnSearch} onClick={() => handleSearchLocation(values.location, setFieldValue)}>Пошук</button>
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