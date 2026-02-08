import styles from "./ModalSuccessLocation.module.scss"
import iconLocation from "../../../../public/assets/iconLocation.png";
import iconCamera from "../../../../public/assets/iconCamera.png";
import iconSearch from "../../../../public/assets/iconSearch.png"
import iconCompass from "../../../../public/assets/iconCompass.png"
import iconClose from "../../../../public/assets/iconClose.svg"
type ModalProps = {
    onClose: () => void
}
function ModalSuccessLocation({onClose}: ModalProps) {
    return (
        <div className={styles.backdrop}>
            <div className={styles.modalSuccess}>
                <button className={styles.btnClose} onClick={onClose}>
                    <img src={iconClose} alt="icon-close" />
                </button>
                <div className={styles.wrapperInfoModal}>
                    <div className={styles.wrapperIcon}>
                        <img src={iconCamera} alt="icon-camera"  className={styles.imgModal}/>
                        <img src={iconLocation} alt="icon-location" className={styles.imgModal} style={{position:"relative", right:30, gap:30}}/>
                    </div>
                    <p className={styles.textLocationSuccess}>Локація успішно створена!</p>
                    <div className={styles.wrapperIcon}>
                        <img src={iconSearch} alt="icon-search" className={styles.imgModal} />
                        <img src={iconCompass} alt="icon-compass" className={styles.imgModal} style={{position:"relative", left:30, gap:30}}/>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ModalSuccessLocation;