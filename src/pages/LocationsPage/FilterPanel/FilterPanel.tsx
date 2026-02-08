import Container from "../../../components/Container/Container";
import { Formik, Form, Field } from "formik";
import styles from "./FilterPanel.module.scss"
import React from "react";
import type { FiltersState, FiltersAction } from "../LocationsPage";
const regions: string[] = [
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
]
const optionsLocation: string[] = ["місто", "село", "море", "гори", "затока"];
type FilterProps = {
    filters: FiltersState,
    dispatch: React.Dispatch<FiltersAction>
}
function FilterPanel({ filters, dispatch }: FilterProps) {
    return (
        <Container>
            <p className={styles.titleAllLocation}>Усі місця відпочинку</p>
            <Formik enableReinitialize initialValues={{ search: filters.search, region: filters.region, locationType: filters.locationType, sort: filters.sort }} onSubmit={() => { }}>
                {({ values, handleChange }) => (
                    <Form className={styles.formFilterLocation}>
                        <div className={styles.wrapperSearch}>
                            <Field name="search" className={styles.inputSearch} placeholder="Пошук" value={values.search} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                handleChange(e)
                                dispatch({ type: "search", payload: e.target.value })
                            }} />
                            <div className={styles.wrapperSelect}>
                                <div style={{ display: "flex", gap: 15 }} >
                                    <Field as="select" className={styles.inputTypeLocation} name="region" value={values.region} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChange(e)
                                        dispatch({ type: "setRegion", payload: e.target.value })
                                    }}>
                                        <option value="">Регіон</option>
                                        {regions.map((region) => (
                                            <option>{region}</option>
                                        ))}
                                    </Field>
                                    <Field as="select" className={styles.inputTypeLocation} name="locationType" value={values.locationType} onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                        handleChange(e)
                                        dispatch({ type: "setLocationType", payload: e.target.value })
                                    }}>
                                        <option value="">Тип локації</option>
                                        {optionsLocation.map((elem) => (
                                            <option>{elem}</option>
                                        ))}
                                    </Field>
                                </div>
                                <Field as="select" className={`${styles.inputTypeLocation} ${styles.inputSort}`} name="sort"
                                    value={values.sort}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                        handleChange(e);
                                        dispatch({ type: "setSort", payload: e.target.value });
                                    }}
                                >
                                    <option value="">Сортування</option>
                                    <option value="name-asc">Назва (A-Z)</option>
                                    <option value="name-desc">Назва (Z-A)</option>
                                    <option value="region-asc">Регіон (A-Z)</option>
                                    <option value="region-desc">Регіон (Z-A)</option>
                                </Field>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Container>
    )
}

export default FilterPanel;