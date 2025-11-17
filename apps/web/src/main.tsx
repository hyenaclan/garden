import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { cognitoConfig } from "./auth/cognito";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...cognitoConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
