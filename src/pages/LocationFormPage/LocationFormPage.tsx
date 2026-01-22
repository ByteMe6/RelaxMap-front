import Container from "../../components/Container/Container";
import styles from "./LocationForm.module.scss"
import LocationForm from "./LocationForm";
function LocationFormPage() {
    return (
        <Container>
            <div className={styles.containerNewLocation}>
                <h1 className={styles.titleNewLocation}>Додавання нового місця</h1>
                <LocationForm />
            </div>
        </Container>
    )
}
export default LocationFormPage;