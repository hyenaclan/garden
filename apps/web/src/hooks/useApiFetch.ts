import { useState, useCallback } from "react";
import { useAuth } from "react-oidc-context";

// Define the type locally to remove dependency on @garden/types
interface HelloApiResponse {
  message: string;
  timestamp: number;
  status: 'ok' | 'error';
  user_count: number;
}

// Define the shape of the data returned by the hook
interface ApiFetchResult {
  apiResponse: string;
  isLoading: boolean;
  error: string | null;
  fetchData: () => Promise<void>;
}

/**
 * Custom React hook for fetching data from the /api/hello endpoint.
 * This abstracts away the fetch logic, loading, and error states.
 * @returns {ApiFetchResult} An object containing the response, status, and fetch function.
 */
export const useApiFetch = (): ApiFetchResult => {
  const [apiResponse, setApiResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setApiResponse("Fetching data..."); // Temporary loading message

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
      const response = await fetch(`${API_BASE_URL}/temp-api/health`);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      
      const data: HelloApiResponse = await response.json(); 
      
      const message = `API Message: "${data.message}" | Status: ${data.status} | Timestamp: ${data.timestamp} | Gardeners #: ${data.user_count}`;
      setApiResponse(message);

      console.log("API Data:", data);
    } catch (err) {
      // Ensure error is treated as a string for display
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setError(errorMessage);
      setApiResponse(`Error fetching data: ${errorMessage}`);
      console.error("Fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  return { apiResponse, isLoading, error, fetchData };
};

interface UserProfileResult {
  userProfile: any;
  isUserLoading: boolean;
  userError: string | null;
  fetchUserData: () => Promise<void>;
}

export const useUserProfile = (): UserProfileResult => {
  const [userProfile, setUserProfile] = useState("");
  const [isUserLoading, setIsUserLoading] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);
  const auth = useAuth(); // Get auth context from react-oidc-context

  const fetchUserData = useCallback(async () => {
    setIsUserLoading(true);
    setUserError(null);
    setUserProfile("Fetching data..."); // Temporary loading message

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

      // Get access token from react-oidc-context
      const token = auth.user?.access_token;

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: any = await response.json();
      setUserProfile(data);

      console.log("API Data:", data);
    } catch (err) {
      // Ensure error is treated as a string for display
      const errorMessage =
        err instanceof Error ? err.message : "An unknown error occurred.";
      setUserError(errorMessage);
      setUserProfile(`Error fetching data: ${errorMessage}`);
      console.error("Fetch error:", err);
    } finally {
      setIsUserLoading(false);
    }
  }, [auth.user?.access_token]); // Add auth dependency

  return { userProfile, isUserLoading, userError, fetchUserData };
};
