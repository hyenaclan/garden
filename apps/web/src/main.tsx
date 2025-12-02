import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import "./index.scss";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { cognitoConfig } from "./auth/cognito";
import { queryClient } from "./queryClient";

// Optional: Add event handlers for token refresh events
const onSigninCallback = () => {
  window.history.replaceState({}, document.title, window.location.pathname);
};

const oidcConfig = {
  ...cognitoConfig,
  onSigninCallback,
  // Events for monitoring token refresh (optional, for debugging)
  onSigninSilentCallback: () => {
    console.debug("Token refreshed silently");
  },
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider {...oidcConfig}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>,
);
