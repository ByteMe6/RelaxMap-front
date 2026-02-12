import styles from "./LocationForm.module.scss";
import { Formik, Form, Field } from "formik";
import React, { useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hook";
import { searchLocation } from "../../redux/thunk/thunkLocationMap";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { postNewLocation } from "../../redux/thunk/thunkLocation";
import {
  searchCities,
  searchRegions,
} from "../../redux/thunk/thunkTypeLocation";
import { resetLocation } from "../../redux/slice/locationSlice";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../../components/Modals/SuccessModal/SuccessModal";
import iconLocation from "../../../public/assets/iconLocation.png";
import iconCamera from "../../../public/assets/iconCamera.png";
import iconSearch from "../../../public/assets/iconSearch.png";
import iconCompass from "../../../public/assets/iconCompass.png";
export default function LocationForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const fileRef = useRef<HTMLInputElement>(null);
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [query, setQuery] = useState("");
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [selectedCountryCode, setSelectedCountryCode] = useState<string | null>(
    null,
  );
  const [showModal, setShowModal] = useState(false)
  // const [showRegionSuggestions, setShowRegionSuggestions] = useState(false)
  const handleModalClose = () => {
    setShowModal(false)
    const mail = localStorage.getItem("email")
    navigate(`/profile/${mail}`);
  }
  function remove() {
    let remove = query + selectedCountryCode;
    remove = "";
    console.log(remove);
  }

  const onSumbit = () => {
    setShowModal(true)
  };

  remove();
  const cities = useAppSelector((state) => state.location.listCity) || [];
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
  const optionsLocation: string[] = ["місто", "село", "море", "гори", "затока"];
  const info = useAppSelector((state) => state.location.info);
  console.log(info);
  const locations = useAppSelector((state) => state.location.locations)
  console.log(locations)
  const handleCityInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any,
  ) => {
    const value = e.target.value;
    setQuery(value);
    setFieldValue("name", value);
    if (value.length >= 1) {
      dispatch(searchCities(value));
      setShowCitySuggestions(true);
    }
  };
  const handleCitySelect = (city: any, setFieldValue: any) => {
    setFieldValue("name", city.name);
    setQuery(city.name);
    setShowCitySuggestions(false);
    setSelectedCountryCode(city.countryCode);
    setFieldValue("region", "");
    dispatch(searchRegions(city.countryCode));
  };

  const handleSearchLocation = (
    locationName: string,
    setFieldValue: (field: string, value: any) => void,
  ) => {
    if (!locationName.trim()) return alert("Введіть назву локації");

    dispatch(searchLocation({ name: locationName.trim() })).then((res: any) => {
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
    <>
      {showModal && (
        <SuccessModal
          isOpen={showModal}
          onClose={handleModalClose}
          title="Локація успішно створена!"
          icon={
            <>
              <img src={iconCamera} alt="icon-camera" style={{ width: "100px" }} />
              <img
                src={iconLocation}
                alt="icon-location"
                style={{ width: "100px", position: "relative", right: "30px" }}
              />
              <img src={iconSearch} alt="icon-search" style={{ width: "100px" }} />
              <img
                src={iconCompass}
                alt="icon-compass"
                style={{ width: "100px", position: "relative", left: "30px" }}
              />
            </>
          }
        />
      )}
      <Formik
        initialValues={{
          name: "",
          placeType: "",
          region: "",
          description: "",
          file: null as File | null,
          location: "",
        }}
        onSubmit={(values) => {
          dispatch(
            postNewLocation({
              name: values.name,
              placeType: values.placeType,
              region: values.region,
              description: values.description,
              file: values.file,
            }),
          );
        }}
        validate={(values) => {
          const errors: any = {};
          if (!values.name) errors.name = "Обов'язкове поле";
          if (!values.placeType) errors.placeType = "Обов'язкове поле";
          if (!values.region) errors.region = "Обов'язкове поле";
          if (!values.description) errors.description = "Обов'язкове поле";
          if (!values.file) errors.file = "Додайте фото";
          return errors;
        }}
      >
        {({ setFieldValue, values, resetForm, isValid, dirty }) => (
          <Form className={styles.containerFormLocation}>
            <h1 className={styles.titleNewLocation}>Додавання нового місця</h1>
            <label htmlFor="file" className={styles.labelLocation}>
              Обкладинка
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
              {values.file && (
                <img
                  src={URL.createObjectURL(values.file)}
                  className={styles.imageLocation}
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
              onChange={(e: any) => handleCityInput(e, setFieldValue)}
            />
            {showCitySuggestions && cities.length > 0 && (
              <ul className={styles.suggestionsList}>
                {cities.map((city) => (
                  <li
                    key={city.id}
                    onClick={() => handleCitySelect(city, setFieldValue)}
                    className={styles.suggestionsItemList}
                  >
                    {city.name}, {city.country}
                  </li>
                ))}
              </ul>
            )}
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
            <label htmlFor="location" className={styles.labelLocation}>
              Оберіть розташування
            </label>
            <div className={styles.wrapperLocation}>
              <Field
                name="location"
                placeholder="Введіть назву місця"
                className={` ${styles.inputSearch}`}
              />
              <button
                type="button"
                className={styles.btnSearch}
                onClick={() =>
                  handleSearchLocation(values.location, setFieldValue)
                }
              >
                Пошук
              </button>
            </div>
            {coords && (
              <div className={styles.mapLocation}>
                <MapContainer
                  center={[coords.lat, coords.lng] as LatLngExpression}
                  zoom={13}
                  style={{ height: "100%" }}
                >
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
                style={{color:"white"}}
                onClick={onSumbit}
                disabled={!(isValid && dirty)}
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
