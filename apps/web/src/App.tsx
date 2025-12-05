import { BrowserRouter, Routes, Route } from "react-router-dom";
import { MainLayout } from "./components/layouts/MainLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { HomePage } from "./components/pages/home/HomePage";
import { LoginPage } from "./components/pages/login/LoginPage";
import { CultsPage } from "./components/pages/cults/CultsPage";
import { ProfilePage } from "./components/pages/profile/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with Header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/cults" element={<CultsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Routes without Header (Auth pages) */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
