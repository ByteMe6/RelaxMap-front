// src/pages/ProfilePage/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hook";
import Container from "../../components/Container/Container";
import {
  getUserPlaces,
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

const ProfilePage: React.FC = () => {
  const { mail } = useParams<{ mail: string }>();
  const navigate = useNavigate();
  const currentUserEmail = useAppSelector((state) => state.auth.email);
  const accessToken = useAppSelector((state) => state.auth.accessToken); // Додано для deps

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [places, setPlaces] = useState<UserPlace[]>([]);
  const [modalConfig, setModalConfig] = useState<{
    open: boolean;
    type: "name" | "pass";
    title: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null); // Додано для помилок

  const isMyProfile = currentUserEmail === mail;

  const loadData = async () => {
    if (!mail) return navigate("/"); // Якщо немає mail — редірект

    try {
      const info = await getUserInfo(mail);
      setUserInfo(info);

      if (isMyProfile) {
        const p = await getUserPlaces(0, 10);
        setPlaces(p.content);
      } else {
        setPlaces([]); // Для чужих — поки порожньо
      }
      setError(null);
    } catch (e: any) {
      setError(e.message || "Не вдалося завантажити профіль");
      if (e.message.includes("No access token")) {
        navigate("/auth/login"); // Якщо не авторизовано — редірект
      }
    }
  };

  useEffect(() => {
    if (!accessToken) {
      navigate("/auth/login"); // Редірект якщо не авторизовано
      return;
    }
    loadData();
  }, [mail, isMyProfile, accessToken]); // Додано accessToken до deps

  const handleSave = async (oldValue?: string, newValue?: string) => {
    try {
      if (modalConfig?.type === "name" && newValue) {
        await changeUserName(newValue);
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
            style={{ color: "red", marginBottom: "20px" }}
          >
            {error}
          </div>
        )}

        {/* Блок з інформацією про користувача */}
        <div className="profile-header">
          <div className="user-info">
            <h1>{userInfo?.name || mail?.split("@")[0] || "Користувач"}</h1>
            <p className="email">Email: {mail || "не вказано"}</p>
            <p>Локацій: {places.length}</p>
          </div>

          {isMyProfile && (
            <div className="profile-actions">
              <button
                className="btn-edit"
                onClick={() =>
                  setModalConfig({
                    open: true,
                    type: "name",
                    title: "Змінити ім'я",
                  })
                }
              >
                Змінити ім'я
              </button>
              <button
                className="btn-edit"
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
              {/* Якщо хочеш кнопку видалення акаунту */}
              {/* <button className="btn-danger" onClick={handleDeleteAccount}>Видалити акаунт</button> */}
            </div>
          )}
        </div>

        {/* Список локацій */}
        <h2 className="section-title">Мої локації</h2>

        {places.length === 0 ? (
          <p>У вас поки немає доданих локацій</p>
        ) : (
          <div className="locations-grid">
            {places.map((place) => (
              <div key={place.id} className="location-card">
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

                  {isMyProfile ? (
                    <div className="card-btns">
                      <button
                        className="edit"
                        onClick={() =>
                          navigate(`/locations/location/edit`, {
                            state: { place },
                          })
                        }
                      >
                        Редагувати
                      </button>
                      <button
                        className="del"
                        onClick={() => handleDeletePlace(place.id)}
                      >
                        Видалити
                      </button>
                    </div>
                  ) : (
                    <button
                      className="standart-btn"
                      onClick={() => navigate(`/locations/${place.id}`)}
                    >
                      Переглянути
                    </button>
                  )}
                </div>
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
