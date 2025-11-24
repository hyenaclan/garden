import { useAuth } from "react-oidc-context";
import { useCallback } from "react";

/**
 * Custom hook for making authenticated API requests with automatic token refresh
 * @returns A fetch function that automatically includes the access token and handles refresh
 */
export const useAuthenticatedFetch = () => {
  const auth = useAuth();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      // Check if token is expired or about to expire
      if (auth.user && auth.user.expired) {
        try {
          // Attempt to refresh the token
          await auth.signinSilent();
        } catch (error) {
          console.error("Token refresh failed:", error);
          // If refresh fails, redirect to login
          await auth.signinRedirect();
          throw new Error("Session expired. Please log in again.");
        }
      }

      // Get the ID token (has proper aud claim for API Gateway)
      const token = auth.user?.id_token;

      // Merge headers with authorization
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...((options.headers as Record<string, string>) || {}),
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // Make the fetch request
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - token might be invalid
      if (response.status === 401) {
        try {
          // Try to refresh the token
          await auth.signinSilent();
          // Retry the request with the new token
          const newToken = auth.user?.id_token;
          if (newToken) {
            headers["Authorization"] = `Bearer ${newToken}`;
          }
          return await fetch(url, { ...options, headers });
        } catch (error) {
          console.error("Token refresh failed on 401:", error);
          await auth.signinRedirect();
          throw new Error("Session expired. Please log in again.");
        }
      }

      return response;
    },
    [auth],
  );

  return authenticatedFetch;
};
