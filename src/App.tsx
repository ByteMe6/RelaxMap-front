import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import LocationsPage from "./pages/LocationsPage/LocationsPage";
import LocationDeteilsPage from "./pages/LocationDeteilsPage/LocationsDeteilsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LocationFormPage from "./pages/LocationFormPage/LocationFormPage";
import EditLocation from "./pages/EditLocation/EditLocation";
import RegisterPage from "./pages/Auth/RegisterPage/RegisterPage";
import LoginPage from "./pages/Auth/Login/LoginPage";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import "./index.css"
import { host } from "./backendHost";
import "./Scss/Modal.scss";

function App() {
  const [isAlive, setIsAlive] = useState<boolean | null>(null);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(true);

  const handleCheckIsAlive = async (): Promise<boolean> => {
    try {
      const response = await axios.get(`${host}/places/all`, { timeout: 500 });
      return response.status === 200;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    void (async () => {
      const alive = await handleCheckIsAlive();
      setIsAlive(alive);
      setIsBackendModalOpen(!alive);
    })();
  }, []);

  const closeBackendModal = () => {
    setIsBackendModalOpen(false);
  };

  return (
    <>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route path="/locations/add" element={<LocationFormPage />} />
        <Route path="/locations/:id" element={<LocationDeteilsPage />} />
        <Route path="/locations/:id/edit" element={<EditLocation />} />
        <Route path="/profile/:mail" element={<ProfilePage />} />
        <Route path="/auth/register" element={<RegisterPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
      </Route>
      <Route path="*" element={<ErrorPage />} />
    </Routes>


      {isAlive === false && isBackendModalOpen && (
        <div className="customModalOverlay">
          <div className="customModal">
            <h3 className="customModal__title">Сервер впав</h3>
            <p className="customModal__text">
              Бекенд зараз недоступний. Спробуй перезавантажити сторінку трохи
              пізніше.
            </p>
            <div className="modalActions">
              <button
                type="button"
                className="modalActions__button"
                onClick={closeBackendModal}
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}
      </>
  );
}

export default App;
