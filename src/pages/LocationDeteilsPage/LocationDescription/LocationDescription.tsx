import styles from "./LocationDescription.module.scss"
type Description = {
    description: string
}
function LocationDescription({ description }: Description) {
    return (
        <div>
            <p className={styles.textDescription}>{description}</p>
        </div>
    )
}

export default LocationDescription;