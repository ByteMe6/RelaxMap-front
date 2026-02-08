import React, { useState } from "react";
import "./ProfilePage.scss";

interface ProfileModalProps {
  isOpen: boolean;
  title: string;
  type: "text" | "password";
  onClose: () => void;
  onSave: (oldValue?: string, newValue?: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  title,
  type,
  onClose,
  onSave,
}) => {
  const [oldValue, setOldValue] = useState("");
  const [newValue, setNewValue] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (type === "password" && (!oldValue.trim() || !newValue.trim())) return;
    if (type === "text" && !newValue.trim()) return;
    
    onSave(type === "password" ? oldValue : undefined, newValue);
    setOldValue("");
    setNewValue("");
  };

  return (
    <div className="custom-modal-overlay" onClick={onClose}>
      <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        {type === "password" && (
          <>
            <input
              type="password"
              value={oldValue}
              onChange={(e) => setOldValue(e.target.value)}
              placeholder="Старий пароль"
            />
            <input
              type="password"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="Новий пароль"
              style={{ marginTop: '10px' }}
            />
          </>
        )}
        {type === "text" && (
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder="Введіть нове ім'я"
          />
        )}
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