import { RotatingLines } from "react-loader-spinner"
import styles from "./Loader.module.scss"
const Loader = () => {
    return (
        <div className={styles.loader}>
            <div className={styles.glow}></div>
            <RotatingLines
                strokeColor="#da2bb4"
                strokeWidth="4"
                animationDuration="0.75"
                width="80"
                visible={true}
            />
            <p className={styles.textLoader}>
                Завантаження...
            </p>
            <div className={styles.icons}>
                ✈️ 🌍 🏝️
            </div>
        </div>
    )
}
export default Loader