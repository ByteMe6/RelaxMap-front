import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "../../components/Container/Container";
import styles from "./HeroBlock.module.scss";

function HeroBlock() {
  const [search, setSearch] = useState("");
  const [searchError, setSearchError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) {
      setSearchError("Введіть пошуковий запит");
      return;
    }
    setSearchError("");
    const params = new URLSearchParams();
    params.set("search", trimmed);
    navigate(`/locations?${params.toString()}`);
  };

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

          <form className={styles['hero__search-box']} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Введіть назву, тип або регіон..."
              className={styles['hero__search-input']}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                if (searchError) setSearchError("");
              }}
              aria-invalid={!!searchError}
              aria-describedby={searchError ? "hero-search-error" : undefined}
            />
            <button type="submit" className={styles['hero__search-btn']}>Знайти місце</button>
          </form>
          {searchError && (
            <p id="hero-search-error" className={styles['hero__search-error']} role="alert">
              {searchError}
            </p>
          )}
        </div>
      </Container>
    </section>
  );
}

export default HeroBlock;