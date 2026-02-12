import React, { useState } from "react";
import { api } from "../../../api/axiosInstance";
import { useAddReviewModal } from "./AddReviewModalContext";
import { useReviews } from "../../../pages/LocationDeteilsPage/ReviewsContext";
import SuccessModal from "../SuccessModal/SuccessModal";
import styles from "./AddReviewModal.module.scss";

interface AddReviewModalProps {
  placeId: number;
}

const AddReviewModal: React.FC<AddReviewModalProps> = ({ placeId }) => {
  const { isOpen, setIsOpen } = useAddReviewModal();
  const { setResponse } = useReviews();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Будь ласка, поставте оцінку.");
      return;
    }

    setLoading(true);
    setError(null);

    const data = {
      text: text,
      rating: rating,
      placeId: placeId
    };

    try {
      await api.post("/reviews", data);
      await updateUI();
      setShowSuccess(true);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Не вдалося залишити відгук. Спробуйте ще раз.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateUI = async () => {
    const res = await api.get(`/reviews/for-place/${placeId}`);
    setResponse(res.data);
    setIsOpen(false);
    setRating(0);
    setText("");
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
  };

  return (
    <>
      <div className={styles.overlay} onClick={() => setIsOpen(false)}>
        <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
          <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
          <h2 className={styles.title}>Ваш відгук</h2>
          {error && <p className={styles.error}>{error}</p>}
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

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title="Відгук успішно додано!"
        message="Дякуємо за ваш відгук!"
      />
    </>
  );
};

export default AddReviewModal;