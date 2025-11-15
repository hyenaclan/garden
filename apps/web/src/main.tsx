import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";
import { getAuthConfig } from "./auth/cognito";
import { AuthProvider } from "react-oidc-context";

const authConfig = getAuthConfig();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...authConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
