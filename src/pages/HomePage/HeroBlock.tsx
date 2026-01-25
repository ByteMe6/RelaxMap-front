import Container from "../../components/Container/Container";
import styles from "./HeroBlock.module.scss";

function HeroBlock() {
  return (
    <section className={styles.hero}>
      <Container>
        <div className={styles.hero__content}>
          <h1 className={styles.hero__title}>
            Відкрий для себе Україну. Знайди <br />
            ідеальне місце для відпочинку
          </h1>
          <p className={styles.hero__text}>
            Тисячі перевірених локацій з реальними фото та відгуками від мандрівників.
          </p>

          <form className={styles['hero__search-box']} onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              placeholder="Введіть назву, тип або регіон..."
              className={styles['hero__search-input']}
            />
            <button type="submit" className={styles['hero__search-btn']}>Знайти місце</button>
          </form>
        </div>
      </Container>
    </section>
  );
}

export default HeroBlock;