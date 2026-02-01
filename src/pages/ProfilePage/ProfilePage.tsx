// src/pages/ProfilePage/ProfilePage.tsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks/hook";
import Container from "../../components/Container/Container";
import { getUserPlaces, deletePlace, type UserPlace } from "../../api/profileClient";
import { getUserInfo, changeUserName, changePassword, type UserInfo } from "../../api/userClient";
import { ProfileModal } from "./ProfileModal";
import "./ProfilePage.scss";
import { host } from "../../backendHost";

const ProfilePage: React.FC = () => {
  const { mail } = useParams<{ mail: string }>();
  const navigate = useNavigate();
  const currentUserEmail = useAppSelector((state) => state.auth.email);

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [places, setPlaces] = useState<UserPlace[]>([]);
  const [modalConfig, setModalConfig] = useState<{ open: boolean; type: "name" | "pass"; title: string } | null>(null);

  const isMyProfile = currentUserEmail === mail;

  const loadData = async () => {
    if (!mail) return;

    try {
      const info = await getUserInfo(mail);
      setUserInfo(info);

      if (isMyProfile) {
        const p = await getUserPlaces(0, 10);
        setPlaces(p.content);
      } else {
        setPlaces([]); // пока нет эндпоинта для чужих
      }
    } catch (e) {
      console.error("User not found", e);
    }
  };

  useEffect(() => {
    loadData();
  }, [mail, isMyProfile]);

  const handleSave = async (value: string) => {
    try {
      if (modalConfig?.type === "name") {
        await changeUserName(value);
        alert("Ім'я змінено");
      } else if (modalConfig?.type === "pass") {
        await changePassword(value);
        alert("Пароль успішно змінено");
      }
      await loadData();
      setModalConfig(null);
    } catch (error) {
      console.error("Помилка при оновленні:", error);
      alert("Не вдалося змінити дані. Перевірте консоль.");
    }
  };

  return (
    <div className="profile-page">
      <Container>
        <div className="profile-header">
          <div className="user-text">
            <h1>{userInfo?.name || "Користувач"}</h1>
            <p>Публікацій: {places.length}</p>
          </div>

          {isMyProfile && (
            <div className="header-btns">
              <button
                className="edit-name"
                onClick={() =>
                  setModalConfig({ open: true, type: "name", title: "Змінити ім'я" })
                }
              >
                Змінити ім&apos;я
              </button>
              <button
                className="change-pass"
                onClick={() =>
                  setModalConfig({ open: true, type: "pass", title: "Новий пароль" })
                }
              >
                Змінити пароль
              </button>
            </div>
          )}
        </div>

        {isMyProfile && (
          <div className="add-location-wrapper">
            <button className="standart-btn" onClick={() => navigate("/locations/add")}>
              Додати нову локацію
            </button>
          </div>
        )}

        <h2 className="section-title">Локації користувача</h2>

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
                <span className="type">{place.placeType}</span>
                <h3>{place.name}</h3>

                {isMyProfile ? (
                  <div className="card-btns">
                    <button
                      className="edit"
                      onClick={() =>
                        navigate(`/locations/location/edit`, { state: { place } })
                      }
                    >
                      Редагувати
                    </button>
                    <button
                      className="del"
                      onClick={() => deletePlace(place.id).then(loadData)}
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
