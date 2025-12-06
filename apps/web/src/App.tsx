import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "./components/layouts/MainLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { HomePage } from "./components/pages/home/HomePage";
import { LoginPage } from "./components/pages/login/LoginPage";
import { CultsPage } from "./components/pages/cults/CultsPage";
import { ProfilePage } from "./components/pages/profile/ProfilePage";

const pageTitles: Record<string, string> = {
  "/": "Home",
  "/cults": "Cults",
  "/profile": "Profile",
  "/login": "Login",
};

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = pageTitles[location.pathname];
    document.title = pageTitle ? `growcult - ${pageTitle}` : "growcult";
  }, [location.pathname]);

  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <TitleUpdater />
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
