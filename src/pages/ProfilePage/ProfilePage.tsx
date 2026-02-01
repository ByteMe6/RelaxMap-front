import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../redux/hooks/hook";
import { getUserInfo, deleteAccount } from "../../api/userClient";
import { getUserPlaces, getPlacesByEmail, deletePlace } from "../../api/profileClient";
import { logout, updateUserName } from "../../redux/slice/authSlice";
import { changeUserName } from "../../api/userClient";
import type { UserInfo } from "../../api/userClient";
import type { UserPlace } from "../../api/profileClient";
import "./ProfilePage.scss";
import { host } from "../../backendHost";
import Container from "../../components/Container/Container";

interface DeletePlaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  placeName: string;
}

function DeletePlaceModal({ isOpen, onClose, onConfirm, placeName }: DeletePlaceModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Видалити локацію?</h3>
        <p>Ви впевнені, що хочете видалити "{placeName}"?</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="standart-btn standart-btn--submit">
            Видалити
          </button>
          <button onClick={onClose} className="standart-btn standart-btn--cancel">
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

function DeleteAccountModal({ isOpen, onClose, onConfirm }: DeleteAccountModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h3>Видалити акаунт?</h3>
        <p>Ця дія незворотна. Всі ваші дані будуть видалені назавжди.</p>
        <div className="modal-buttons">
          <button onClick={onConfirm} className="standart-btn standart-btn--submit">
            Так, видалити
          </button>
          <button onClick={onClose} className="standart-btn standart-btn--cancel">
            Скасувати
          </button>
        </div>
      </div>
    </div>
  );
}

// Компонент рейтингу (зірки)
function Rating({ value = 4.5 }: { value?: number }) {
  const fullStars = Math.floor(value);
  const hasHalfStar = value % 1 !== 0;

  return (
    <div className="place-rating">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="star">
          ★
        </span>
      ))}
      {hasHalfStar && <span className="star star-half">★</span>}
    </div>
  );
}

function ProfilePage() {
  const { mail } = useParams<{ mail: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { email: currentUserEmail, accessToken } = useAppSelector((state) => state.auth);
  const isOwnProfile = currentUserEmail === mail;

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [places, setPlaces] = useState<UserPlace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deletingPlace, setDeletingPlace] = useState<UserPlace | null>(null);

  useEffect(() => {
    loadProfileData();
  }, [mail]);

  const loadProfileData = async () => {
    if (!mail) {
      setError("Email не вказано");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const info = await getUserInfo(mail);
      setUserInfo(info);

      let placesData;
      if (isOwnProfile && accessToken) {
        placesData = await getUserPlaces(0, 100);
      } else {
        placesData = await getPlacesByEmail(mail, 0, 100);
      }
      setPlaces(placesData.content);
    } catch (err: any) {
      console.error("Error loading profile:", err);
      if (err.response?.status === 404) {
        setError("Користувача не знайдено");
      } else {
        setError("Помилка завантаження профілю");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
      dispatch(logout());
      navigate("/");
    } catch (err: any) {
      alert(err.response?.data?.message || "Помилка видалення акаунту");
    }
  };

  const handleDeletePlace = async () => {
    if (!deletingPlace) return;

    try {
      await deletePlace(deletingPlace.id);
      setPlaces((prev) => prev.filter((p) => p.id !== deletingPlace.id));
      setDeletingPlace(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Помилка видалення локації");
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <Container>
          <div className="profile-loading">Завантаження...</div>
        </Container>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <Container>
          <div className="profile-error">
            <h2>{error}</h2>
            <button onClick={() => navigate("/locations")} className="standart-btn standart-btn--submit">
              Повернутися до локацій
            </button>
          </div>
        </Container>
      </div>
    );
  }

  if (!userInfo) {
    return null;
  }

  return (
    <div className="profile-page">
      <Container>
        <div className="profile-header">
          <div className="profile-user">
            <div className="profile-avatar">{userInfo.name.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <h1>{userInfo.name}</h1>
              <p className="profile-email">Статей: {places.length}</p>
            </div>
          </div>

          {isOwnProfile && (
            <div className="profile-actions">
              <button onClick={() => navigate("/locations/add")} className="standart-btn standart-btn--submit">
                Додати локацію
              </button>
              <button onClick={() => setShowDeleteAccountModal(true)} className="profile-delete-btn">
                Видалити акаунт
              </button>
            </div>
          )}
        </div>

        <div className="profile-places">
          <h2>Локації</h2>

          {places.length === 0 ? (
            <div className="profile-empty">
              <p>{isOwnProfile ? "У вас ще немає локацій" : "Користувач ще не додав локації"}</p>
              {isOwnProfile && (
                <button onClick={() => navigate("/locations/add")} className="standart-btn standart-btn--submit">
                  Додати першу локацію
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="places-grid">
                {places.map((place) => (
                  <div key={place.id} className="place-card">
                    {place.imageName && (
                      <div className="place-img">
                        <img
                          src={`${host}/images/${place.imageName}`}
                          alt={place.name}
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            img.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                    <div className="place-content">
                      <div className="place-category">{place.placeType}</div>
                      <Rating />
                      <h3 className="place-name">{place.name}</h3>
                      
                      {!isOwnProfile ? (
                        <button
                          onClick={() => navigate(`/locations/location?id=${place.id}`)}
                          className="place-view-btn"
                        >
                          Переглянути локацію
                        </button>
                      ) : null}
                    </div>

                    {isOwnProfile && (
                      <div className="place-actions">
                        <button
                          onClick={() => navigate(`/locations/location?id=${place.id}`)}
                          className="edit-btn"
                        >
                          Переглянути
                        </button>
                        <button onClick={() => setDeletingPlace(place)} className="delete-btn">
                          Видалити
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Кнопка "Показати ще" - поки що просто для красоти */}
              {places.length > 6 && (
                <button className="show-more-btn">Показати ще</button>
              )}
            </>
          )}
        </div>
      </Container>

      <DeleteAccountModal
        isOpen={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
        onConfirm={handleDeleteAccount}
      />

      <DeletePlaceModal
        isOpen={!!deletingPlace}
        onClose={() => setDeletingPlace(null)}
        onConfirm={handleDeletePlace}
        placeName={deletingPlace?.name || ""}
      />
    </div>
  );
}

export default ProfilePage;