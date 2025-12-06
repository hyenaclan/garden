import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "./components/layouts/MainLayout";
import { AuthLayout } from "./components/layouts/AuthLayout";
import { HomePage } from "./components/pages/home/HomePage";
import { LoginPage } from "./components/pages/login/LoginPage";
import { AuthCallbackPage } from "./components/pages/auth/AuthCallbackPage";
import { CultsPage } from "./components/pages/cults/CultsPage";
import { ProfilePage } from "./components/pages/profile/ProfilePage";
import { APP_NAME, ROUTES, PAGE_TITLES } from "./config";

function TitleUpdater() {
  const location = useLocation();

  useEffect(() => {
    const pageTitle = PAGE_TITLES[location.pathname];
    document.title = pageTitle ? `${APP_NAME} - ${pageTitle}` : APP_NAME;
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
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.CULTS} element={<CultsPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        {/* Routes without Header (Auth pages) */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
