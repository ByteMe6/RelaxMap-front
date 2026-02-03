import styles from "./AddReviewForm.module.scss";
import { useState } from "react";

export default function AddReviewForm() {
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [rating, setRating] = useState<number>(0);

  return (
      <form>
        <p className={styles["add-review-modal__text"]}>Ваш відгук</p>
        <textarea placeholder="Напишіть ваш відгук" className={styles["add-review-modal__textarea"]}></textarea>

        <div className={ styles["add-review-modal__rating"] }>
          { Array.from({ length: 5 }).map((_, i) => {
            const starValue = i + 1;

            return (
                <svg
                    className={ styles["add-review-modal__rating__icon"] && (i <= rating - 1 ? styles["add-review-modal__rating__icon--filled"] : "") || (i <= hoverIndex ? styles["add-review-modal__rating__icon--filled"] : "") }
                    onMouseEnter={ () => {
                      setHoverIndex(i);
                    } }
                    onMouseLeave={ () => {
                      setHoverIndex(-1);
                    } }
                    onClick={ () => {
                      if (starValue !== rating) {
                        setRating(starValue);
                      } else {
                        setRating(0);
                        setHoverIndex(-1);
                      }
                    } }
                    width="32"
                    height="32"
                    viewBox="0 0 32 32"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    key={ i }>
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                </svg>
            );
          })
          }
        </div>

        <div className={styles["add-review-modal__btn-box"]}>
          <button className={styles["add-review-modal__cancel-btn"]}>Відмінити</button>
          <button className={styles["add-review-modal__send-btn"]}>Надіслати</button>
        </div>
      </form>
  );
}