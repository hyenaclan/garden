import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@garden/ui/styles/globals.css";
import "./index.css";
import App from "./App";
import { AuthProvider } from "react-oidc-context";
import { cognitoConfig } from "./core/auth/cognito";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "./core/api/queryClient";
import { ThemeProvider } from "./core/ui/ThemeProvider";

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

const queryClient = createQueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider {...oidcConfig}>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>,
);
