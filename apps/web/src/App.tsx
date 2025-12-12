import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { MainLayout } from "./core/ui/MainLayout";
import { AuthLayout } from "./features/auth/AuthLayout";
import { HomePage } from "./features/home/HomePage";
import { AuthCallbackPage } from "./features/auth/AuthCallbackPage";
import { CultsPage } from "./features/cults/CultsPage";
import { ProfilePage } from "./features/profile/ProfilePage";
import { GardenCanvasPage } from "./features/garden-canvas/GardenCanvasPage";
import { APP_NAME, ROUTES, PAGE_TITLES } from "./core/config";

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
          <Route path={ROUTES.GARDEN_CANVAS} element={<GardenCanvasPage />} />
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
        </Route>

        {/* Auth callback route */}
        <Route element={<AuthLayout />}>
          <Route path={ROUTES.AUTH_CALLBACK} element={<AuthCallbackPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
