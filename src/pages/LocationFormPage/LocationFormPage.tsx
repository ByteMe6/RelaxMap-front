import Container from "../../components/Container/Container";
import styles from "./LocationForm.module.scss"
import LocationForm from "./LocationForm";
function LocationFormPage() {
    return (
        <Container>
            <div className={styles.containerNewLocation}>
                <LocationForm />
            </div>
        </Container>
    )
}
export default LocationFormPage;