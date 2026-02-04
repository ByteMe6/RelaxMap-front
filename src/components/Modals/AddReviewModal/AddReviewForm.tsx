import styles from "./AddReviewForm.module.scss";
import { useState, useRef } from "react";
import { useAddReviewModal } from "./AddReviewModalContext.tsx";
import { useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { host } from "../../../backendHost.ts";
import { useReviews } from "../../../pages/LocationDeteilsPage/ReviewsContext.tsx";

export default function AddReviewForm() {
  const { id } = useParams();
  const [hoverIndex, setHoverIndex] = useState<number>(-1);
  const [rating, setRating] = useState<number>(0);
  const formRef = useRef(null);
  const { setIsOpen } = useAddReviewModal();
  const [error, setError] = useState<string[]>([]);
  const { setResponse } = useReviews();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const text = formData.get("text") as string;
    const access = localStorage.getItem("accessToken");

    if (!text || !rating) {
      setError(["Missing fields"]);
      return;
    }

    try {
      const res = await axios.post(`${ host }/reviews`, {
        text,
        rating: Number(rating),
        placeId: id
      }, {
        headers: {
          Authorization: `Bearer ${ access }`
        }
      });

      setResponse((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          content: [...prev.content, res.data],
        };
      });

      setIsOpen(false);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        if (error.response) {
          setError(Object.values(error.response.data));
        }
      }

    }
  };

  return (
      <form ref={ formRef } onSubmit={ handleSubmit }>
        <p className={ styles["add-review-modal__text"] }>Ваш відгук</p>
        <textarea name="text" placeholder="Напишіть ваш відгук"
                  className={ styles["add-review-modal__textarea"] }></textarea>

        {
            error &&
            error.map((e: string, i) => (
                <p key={ i } className={ i === error.length - 1 ? styles["add-review-modal__error"] : "" }>{ e }</p>
            ))
        }

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

        <div className={ styles["add-review-modal__btn-box"] }>
          <button onClick={ () => {
            setIsOpen(false);
            setRating(0);
          } } className={ styles["add-review-modal__cancel-btn"] } type="reset">Відмінити
          </button>
          <button className={ styles["add-review-modal__send-btn"] } type="submit">Надіслати</button>
        </div>
      </form>
  );
}