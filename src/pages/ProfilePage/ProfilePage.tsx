import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hooks/hook";
import Container from "../../components/Container/Container";
import { updateUserName } from "../../redux/slice/authSlice";
import {
  getUserPlaces,
  getPlacesForUser,
  deletePlace,
  type UserPlace,
} from "../../api/profileClient";
import {
  getUserInfo,
  changeUserName,
  changePassword,
  deleteAccount,
  type UserInfo,
} from "../../api/userClient";
import { ProfileModal } from "./ProfileModal";
import SuccessModal from "../../components/Modals/SuccessModal/SuccessModal";
import "./ProfilePage.scss";
import { host } from "../../backendHost";
import { logoutUser } from "../../redux/thunk/authThunk";

const ProfilePage: React.FC = () => {
  const { mail } = useParams<{ mail: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUserEmail = useAppSelector((state) => state.auth.email);
  const accessToken = useAppSelector((state) => state.auth.accessToken);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [places, setPlaces] = useState<UserPlace[]>([]);
  const [modalConfig, setModalConfig] = useState<{
    open: boolean;
    type: "name" | "pass";
    title: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [deleteInProgress, setDeleteInProgress] = useState(false);

  const isMyProfile = Boolean(
    currentUserEmail && mail && currentUserEmail === mail,
  );

  const handleDeleteAccount = async () => {
    if (!accessToken) return;
    setDeleteInProgress(true);
    setError(null);
    try {
      await deleteAccount();
      dispatch(logoutUser());
      setShowDeleteConfirmModal(false);
      navigate("/");
    } catch (e: unknown) {
      console.error(e);
      const message =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Не вдалося видалити акаунт";
      setError(message);
    } finally {
      setDeleteInProgress(false);
    }
  };

  const navigateToAddLocation = () => {
    navigate("/locations/add");
  };

  const loadData = async () => {
    if (!mail) {
      navigate("/");
      return;
    }

    try {
      const info = await getUserInfo(mail);
      setUserInfo(info);
      setError(null);
      setShowSuccessModal(false);
    } catch (e: any) {
      setError(e.message || "Не вдалося завантажити профіль");
      setShowSuccessModal(false);
      return;
    }

    try {
      const placesResponse = isMyProfile
        ? await getUserPlaces(0, 50)
        : await getPlacesForUser(mail, 0, 50);

      setPlaces(placesResponse.content);
    } catch (e) {
      console.error("Failed to load places", e);
    }
  };

  useEffect(() => {
    void loadData();
  }, [mail, isMyProfile, accessToken]);

  const handleSave = async (oldValue?: string, newValue?: string) => {
    try {
      if (modalConfig?.type === "name" && newValue) {
        await changeUserName(newValue);
        // Оновлюємо ім'я в Redux, щоб воно синхронізувалося всюди
        dispatch(updateUserName(newValue));
        setSuccessMessage("Ім'я успішно змінено");
        setShowSuccessModal(true);
      } else if (modalConfig?.type === "pass" && oldValue && newValue) {
        await changePassword(oldValue, newValue);
        setSuccessMessage("Пароль успішно змінено");
        setShowSuccessModal(true);
      }
      await loadData();
      setModalConfig(null);
      setError(null);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Не вдалося змінити дані");
      setShowSuccessModal(false);
    }
  };

  const handleDeletePlace = async (placeId: number) => {
    if (!confirm("Видалити локацію?")) return;
    try {
      await deletePlace(placeId);
      await loadData();
    } catch (error: any) {
      setError(error.message || "Помилка видалення");
    }
  };

  return (
    <div className="profile-page">
      <Container>
        {error && (
          <div className="profile-error">
            {error}
          </div>
        )}

        <div className="profile-header">
          <div className="user-info">
            <h1 className="profile-name">{userInfo?.name || mail?.split("@")[0] || "Користувач"}</h1>
            <p className="profile-stats">Локацій: {places.length}</p>
          </div>

          {isMyProfile && (
            <div className="profile-actions">
              <button
                className="btn-edit pBtn"
                type="button"
                onClick={() =>
                  setModalConfig({
                    open: true,
                    type: "name",
                    title: "Змінити ім'я",
                  })
                }
              >
                Змінити ім&apos;я
              </button>

              <button
                className="btn-edit pBtn"
                type="button"
                onClick={() =>
                  setModalConfig({
                    open: true,
                    type: "pass",
                    title: "Змінити пароль",
                  })
                }
              >
                Змінити пароль
              </button>

              <button
                className="btn-danger pBtn"
                type="button"
                onClick={() => setShowDeleteConfirmModal(true)}
              >
                Видалити акаунт
              </button>
            </div>
          )}
        </div>

        <h2 className="section-title">Локації</h2>

        {isMyProfile && (
          <button
            className="btn pBtn"
            type="button"
            onClick={navigateToAddLocation}
          >
            Створити нову локацію
          </button>
        )}

        {places.length === 0 ? (
          <div className="profile-empty-locations">
            <p className="profile-empty-text">Цей користувач ще не ділився локаціями</p>
            <button
              type="button"
              className="profile-back-btn"
              onClick={() => navigate("/locations")}
            >
              Назад до локацій
            </button>
          </div>
        ) : (
          <div className="locations-grid">
            {places.map((place) => (
              <div
                key={place.id}
                className="location-card"
                onClick={() => navigate(`/locations/${place.id}`)}
                style={{ cursor: "pointer" }}
              >
                <div className="img-box">
                  <img
                    src={
                      place.imageName
                        ? `${host}/images/${place.imageName}`
                        : "/assets/placeholder.jpg"
                    }
                    alt={place.name}
                    loading="lazy"
                    decoding="async"
                  />
                </div>

                <div className="info-box">
                  <span className="type">{place.placeType || "—"}</span>
                  <h3>{place.name}</h3>
                  <button
                    type="button"
                    className="location-view-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/locations/${place.id}`);
                    }}
                  >
                    Переглянути локацію
                  </button>
                </div>

                {isMyProfile && (
                  <div className="card-btns">
                    <button
                      className="edit"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/locations/${place.id}/edit`, {
                          state: { place },
                        });
                      }}
                    >
                      Редагувати
                    </button>

                    <button
                      className="del"
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDeletePlace(place.id);
                      }}
                    >
                      Видалити
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Container>

      <ProfileModal
        isOpen={!!modalConfig?.open}
        title={modalConfig?.title || ""}
        type={modalConfig?.type === "pass" ? "password" : "text"}
        onClose={() => setModalConfig(null)}
        onSave={handleSave}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title={successMessage}
      />

      {showDeleteConfirmModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => !deleteInProgress && setShowDeleteConfirmModal(false)}
        >
          <div className="custom-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Видалити акаунт?</h3>
            <p className="profile-delete-confirm-text">
              Цю дію не можна скасувати. Усі ваші дані будуть видалені назавжди.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                onClick={() => !deleteInProgress && setShowDeleteConfirmModal(false)}
                disabled={deleteInProgress}
              >
                Скасувати
              </button>
              <button
                type="button"
                className="confirm-delete-btn"
                onClick={() => void handleDeleteAccount()}
                disabled={deleteInProgress}
              >
                {deleteInProgress ? "Видалення…" : "Видалити акаунт"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
