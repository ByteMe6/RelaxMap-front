import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage/HomePage";
import LocationsPage from "./pages/LocationsPage/LocationsPage";
import LocationDeteilsPage from "./pages/LocationDeteilsPage/LocationsDeteilsPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import LocationFormPage from "./pages/LocationFormPage/LocationFormPage";
import EditLocation from "./pages/EditLocation/EditLocation";
import RegisterPage from "./pages/Auth/RegisterPage/RegisterPage";
import LoginPage from "./pages/Auth/Login/LoginPage";
import "./index.css";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/locations" element={<LocationsPage />} />
        <Route
          path="/locations/location"
          element={<LocationDeteilsPage />}
        />{" "}
        {/* add id route*/}
  <Route path="/profile/:mail" element={<ProfilePage />} />
        <Route path="/locations/add" element={<LocationFormPage />} />
        <Route
          path="/locations/location/edit"
          element={<EditLocation />}
        />{" "}
        {/* add id route*/}
      </Route>

      <Route path="/auth/register" element={<RegisterPage />} />
      <Route path="/auth/login" element={<LoginPage />} />
    </Routes>
  );
}

export default App;
