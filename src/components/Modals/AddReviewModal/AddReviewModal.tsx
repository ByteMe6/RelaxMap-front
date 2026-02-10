import React, { useState } from "react";
import axios from "axios";
import { host } from "../../../backendHost";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks/hook";
import { setCredentials } from "../../../redux/slice/authSlice"; 
import { useAddReviewModal } from "./AddReviewModalContext";
import { useReviews } from "../../../pages/LocationDeteilsPage/ReviewsContext";
import styles from "./AddReviewModal.module.scss";

interface AddReviewModalProps {
  placeId: number;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ placeId }) => {
  const dispatch = useAppDispatch();
  const { isOpen, setIsOpen } = useAddReviewModal();
  const { setResponse } = useReviews();
  
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const refreshToken = useAppSelector((state) => state.auth.refreshToken);

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return alert("Поставте оцінку");

    setLoading(true);

    const data = {
      text: text,
      rating: rating,
      placeId: placeId
    };

    try {
      await axios.post(
        `${host}/reviews`,
        data,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      
      await updateUI();
    } catch (error: any) {
      if (error.response?.status === 401 && refreshToken) {
        try {
          const refreshRes = await axios.post(`${host}/auth/refresh`, { refreshToken });
          
          const newTokens = {
            accessToken: refreshRes.data.access,
            refreshToken: refreshRes.data.refresh
          };

          dispatch(setCredentials(newTokens));

          await axios.post(
            `${host}/reviews`,
            data,
            { headers: { Authorization: `Bearer ${newTokens.accessToken}` } }
          );

          await updateUI();
        } catch (refreshErr) {
          console.error("Refresh failed", refreshErr);
          alert("Сесія вичерпана, увійдіть знову");
        }
      } else {
        alert("Помилка: " + (error.response?.data?.message || "Unauthorized"));
      }
    } finally {
      setLoading(false);
    }
  };

  const updateUI = async () => {
    const res = await axios.get(`${host}/reviews/for-place/${placeId}`);
    setResponse(res.data);
    setIsOpen(false);
    setRating(0);
    setText("");
  };

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
        <h2 className={styles.title}>Ваш відгук</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.starsContainer}>
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={(hover || rating) >= i + 1 ? styles.starFilled : styles.starEmpty}
                onClick={() => setRating(i + 1)}
                onMouseEnter={() => setHover(i + 1)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            className={styles.textarea}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Напишіть щось..."
            required
          />
          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? "Завантаження..." : "Опублікувати"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReviewModal;