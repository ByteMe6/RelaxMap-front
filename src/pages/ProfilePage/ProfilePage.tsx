// src/pages/ProfilePage/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProfilePage.module.scss";
import { getUserPlaces, type UserPlace } from "../../api/profileClient";
import { useAppSelector } from "../../redux/hooks/hook";
import Container from "../../components/Container/Container";
import { changeUserName } from "../../api/userClient";

interface PasswordPopupProps {
  open: boolean;
  onClose: () => void;
}

function PasswordPopup({ open, onClose }: PasswordPopupProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: POST /auth/change-password
    console.log({ oldPassword, newPassword, repeatPassword });
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <h3 className={styles.popupTitle}>Змінити пароль</h3>
        <form onSubmit={handleSubmit} className={styles.popupForm}>
          <label className={styles.popupLabel}>
            Старий пароль
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className={styles.popupInput}
            />
          </label>
          <label className={styles.popupLabel}>
            Новий пароль
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={styles.popupInput}
            />
          </label>
          <label className={styles.popupLabel}>
            Повторіть новий пароль
            <input
              type="password"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className={styles.popupInput}
            />
          </label>
          <div className={styles.popupButtons}>
            <button
              type="button"
              className={styles.popupCancel}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button type="submit" className={styles.popupSubmit}>
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface EditPlacePopupProps {
  open: boolean;
  place: UserPlace | null;
  onClose: () => void;
}

function EditPlacePopup({ open, place, onClose }: EditPlacePopupProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (place) {
      setName(place.name);
      setDescription(place.description);
    }
  }, [place]);

  if (!open || !place) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: PUT /places/{id}
    console.log("update place", place.id, { name, description });
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <h3 className={styles.popupTitle}>Редагувати локацію</h3>
        <form onSubmit={handleSubmit} className={styles.popupForm}>
          <label className={styles.popupLabel}>
            Назва
            <input
              type="text"
              className={styles.popupInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className={styles.popupLabel}>
            Опис
            <textarea
              className={styles.popupInput}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </label>
          <div className={styles.popupButtons}>
            <button
              type="button"
              className={styles.popupCancel}
              onClick={onClose}
            >
              Скасувати
            </button>
            <button type="submit" className={styles.popupSubmit}>
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface NamePopupProps {
  open: boolean;
  currentName: string;
  onClose: () => void;
  onSaveLocal: (newName: string) => void;
}

function NamePopup({ open, currentName, onClose, onSaveLocal }: NamePopupProps) {
  const [value, setValue] = useState(currentName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setValue(currentName);
    setError("");
  }, [currentName]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await changeUserName(value); // PATCH /auth/change-name
      onSaveLocal(value);
    } catch (err) {
      console.error(err);
      setError("Не вдалося змінити ім’я");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popup}>
        <h3 className={styles.popupTitle}>Змінити ім’я</h3>
        <form onSubmit={handleSubmit} className={styles.popupForm}>
          <label className={styles.popupLabel}>
            Нове ім’я
            <input
              type="text"
              className={styles.popupInput}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </label>
          {error && <p className={styles.errorText}>{error}</p>}
          <div className={styles.popupButtons}>
            <button
              type="button"
              className={styles.popupCancel}
              onClick={onClose}
              disabled={loading}
            >
              Скасувати
            </button>
            <button
              type="submit"
              className={styles.popupSubmit}
              disabled={loading}
            >
              {loading ? "Збереження..." : "Зберегти"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { mail } = useParams();
  const { email } = useAppSelector((s) => s.auth);

  const routeMail = mail ? decodeURIComponent(mail) : undefined;
  const isOwner = Boolean(email && routeMail === email);

  const [userName, setUserName] = useState<string>(
    isOwner ? email || "Користувач" : routeMail || "Користувач",
  );

  const [places, setPlaces] = useState<UserPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isPasswordPopupOpen, setIsPasswordPopupOpen] = useState(false);
  const [editPlace, setEditPlace] = useState<UserPlace | null>(null);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isNamePopupOpen, setIsNamePopupOpen] = useState(false);

  useEffect(() => {
    if (!isOwner) return;

    const loadPlaces = async () => {
      try {
        setLoading(true);
        const res = await getUserPlaces(0, 10);
        setPlaces(res.content);
      } catch (e) {
        console.error(e);
        setError("Помилка завантаження локацій");
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, [isOwner]);

  const hasPlaces = places.length > 0;
  const isViewerEmpty = !isOwner && !hasPlaces;
  const isOwnerEmpty = isOwner && !hasPlaces;

  const handleOpenEdit = (place: UserPlace) => {
    setEditPlace(place);
    setIsEditPopupOpen(true);
  };

  const handleSaveNameLocal = (newName: string) => {
    setUserName(newName);
    setIsNamePopupOpen(false);
  };

  return (
    <section className={styles.profilePage}>
      <Container>
        <div className={styles.card}>
          <div className={styles.header}>
            <div className={styles.nameBlock}>
              <p className={styles.userName}>{userName}</p>
              <p className={styles.status}>Статус 0</p>
            </div>

            {isOwner && (
              <div className={styles.headerButtons}>
                <button
                  type="button"
                  className={styles.changeNameBtn}
                  onClick={() => setIsNamePopupOpen(true)}
                >
                  Змінити ім’я
                </button>
                <button
                  type="button"
                  className={styles.changePasswordBtn}
                  onClick={() => setIsPasswordPopupOpen(true)}
                >
                  Змінити пароль
                </button>
              </div>
            )}
          </div>

          <div className={styles.content}>
            {loading && <p className={styles.infoText}>Завантаження...</p>}
            {error && <p className={styles.errorText}>{error}</p>}

            {hasPlaces && (
              <>
                <h2 className={styles.sectionTitle}>Ваші локації</h2>
                <ul className={styles.placeList}>
                  {places.map((p) => (
                    <li key={p.id} className={styles.placeItem}>
                      <div className={styles.placeHeader}>
                        <div>
                          <h3 className={styles.placeName}>{p.name}</h3>
                          <p className={styles.placeRegion}>{p.region}</p>
                        </div>
                        <div className={styles.placeHeaderRight}>
                          {p.placeType && (
                            <span className={styles.placeType}>
                              {p.placeType}
                            </span>
                          )}
                          {isOwner && (
                            <button
                              type="button"
                              className={styles.editPlaceBtn}
                              onClick={() => handleOpenEdit(p)}
                            >
                              Редагувати
                            </button>
                          )}
                        </div>
                      </div>
                      <p className={styles.placeDescription}>
                        {p.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </>
            )}

            {isViewerEmpty && (
              <>
                <h2 className={styles.sectionTitle}>Локації</h2>
                <p className={styles.subMessage}>
                  Цей користувач ще не ділився локаціями
                </p>
              </>
            )}

            {isOwnerEmpty && (
              <>
                <p className={styles.mainMessage}>
                  Ви ще нічого не публікували, поділіться своєю першою
                  локацією!
                </p>
              </>
            )}
          </div>
        </div>
      </Container>

      <PasswordPopup
        open={isPasswordPopupOpen}
        onClose={() => setIsPasswordPopupOpen(false)}
      />

      <EditPlacePopup
        open={isEditPopupOpen}
        place={editPlace}
        onClose={() => setIsEditPopupOpen(false)}
      />

      <NamePopup
        open={isNamePopupOpen}
        currentName={userName}
        onClose={() => setIsNamePopupOpen(false)}
        onSaveLocal={handleSaveNameLocal}
      />
    </section>
  );
}

export default ProfilePage;