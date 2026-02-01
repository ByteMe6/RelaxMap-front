import styles from "./LocationGallery.module.scss"
type ImageProps = {
    image?:string
}
function LocationGallery({image}: ImageProps){
    return (
        <div>
            <img src={image} alt="detailImage" className={styles.detailImage}/>
        </div>
    )
}

export default LocationGallery;