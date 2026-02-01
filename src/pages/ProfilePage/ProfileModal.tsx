// src/pages/ProfilePage/ProfileModal.tsx
import React, { useState } from "react";
import "./ProfilePage.scss";

interface ProfileModalProps {
  isOpen: boolean;
  title: string;
  type: "text" | "password";
  onClose: () => void;
  onSave: (value: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  title,
  type,
  onClose,
  onSave,
}) => {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!value.trim()) return;
    onSave(value.trim());
    setValue("");
  };

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <input
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={type === "password" ? "Введіть новий пароль" : "Введіть нове ім'я"}
        />
        <div className="modal-actions">
          <button type="button" onClick={onClose}>
            Скасувати
          </button>
          <button type="button" onClick={handleSubmit}>
            Зберегти
          </button>
        </div>
      </div>
    </div>
  );
};
