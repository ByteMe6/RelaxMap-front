import styles from "./Loader.module.scss";

const Loader = () => {
    return (
        <div className={styles.loader} role="status" aria-live="polite" aria-busy="true">
            <div className={styles.pinScene}>
                <span className={styles.ripple}></span>
                <span className={styles.ripple}></span>
                <span className={styles.ripple}></span>

                <div className={styles.pinBob}>
                    <svg
                        className={styles.pin}
                        viewBox="0 0 24 24"
                        width="44"
                        height="44"
                        aria-hidden="true"
                    >
                        <path
                            fill="currentColor"
                            d="M12 2c-3.87 0-7 3.13-7 7 0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7Z"
                        />
                        <circle cx="12" cy="9" r="2.6" fill="#fff2ec" />
                    </svg>
                </div>

                <span className={styles.pinShadow}></span>
            </div>

            <p className={styles.brand}>Relax Map</p>
            <p className={styles.textLoader}>Завантаження…</p>
        </div>
    );
};

export default Loader;
