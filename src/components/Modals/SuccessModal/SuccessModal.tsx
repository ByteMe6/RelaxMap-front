import React from "react";
import styles from "./SuccessModal.module.scss";
import iconClose from "../../../../public/assets/iconClose.svg";

type SuccessModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message?: string;
  icon?: React.ReactNode;
};

const SuccessModal: React.FC<SuccessModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  icon,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modalSuccess} onClick={(e) => e.stopPropagation()}>
        <button className={styles.btnClose} onClick={onClose} aria-label="Закрити">
          <img src={iconClose} alt="icon-close" />
        </button>
        <div className={styles.wrapperInfoModal}>
          {icon && <div className={styles.wrapperIcon}>{icon}</div>}
          <p className={styles.textSuccess}>{title}</p>
          {message && <p className={styles.messageSuccess}>{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
