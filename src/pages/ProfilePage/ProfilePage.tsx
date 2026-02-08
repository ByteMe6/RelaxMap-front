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
  type UserInfo,
} from "../../api/userClient";
import { ProfileModal } from "./ProfileModal";
import "./ProfilePage.scss";
import { host } from "../../backendHost";
import axios from "axios";
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

  const isMyProfile = Boolean(
    currentUserEmail && mail && currentUserEmail === mail,
  );

  const handleDeleteAccount = async () => {
    if (!accessToken) return;
    try {
      await axios.delete(`${host}/users/delete-account`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(logoutUser());
      navigate("/");
    } catch (e) {
      console.error(e);
      setError("Не вдалося видалити акаунт");
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
    } catch (e: any) {
      setError(e.message || "Не вдалося завантажити профіль");
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
        alert("Ім'я змінено");
      } else if (modalConfig?.type === "pass" && oldValue && newValue) {
        await changePassword(oldValue, newValue);
        alert("Пароль успішно змінено");
      }
      await loadData();
      setModalConfig(null);
      setError(null);
    } catch (error: any) {
      setError(error?.response?.data?.message || "Не вдалося змінити дані");
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
          <div
            className="profile-error"
            style={{ color: "red", marginBottom: 20 }}
          >
            {error}
          </div>
        )}

        <div className="profile-header">
          <div className="user-info">
            <h1>{userInfo?.name || mail?.split("@")[0] || "Користувач"}</h1>
            <p className="email">Email: {mail || "не вказано"}</p>
            <p>Локацій: {places.length}</p>
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
                onClick={handleDeleteAccount}
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
          <p>Локацій поки немає</p>
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
                  />
                </div>

                <div className="info-box">
                  <span className="type">{place.placeType || "—"}</span>
                  <h3>{place.name}</h3>
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
    </div>
  );
};

export default ProfilePage;
