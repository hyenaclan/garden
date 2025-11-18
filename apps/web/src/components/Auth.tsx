import { useAuth } from "react-oidc-context";
import { useState } from "react";
import { signOutRedirect } from "../auth/cognito";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";

export default function Auth() {
  const auth = useAuth();
  const authenticatedFetch = useAuthenticatedFetch();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(false);

  const fetchUserData = async () => {
    if (!auth.user) return;
    try {
      setUserLoading(true);
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";
      // Use authenticatedFetch which handles token refresh automatically
      const response = await authenticatedFetch(
        `${API_BASE_URL}/api/user/profile`
      );
      const data = await response.json();
      setUserProfile(data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const logout = () => {
    auth.removeUser();
    signOutRedirect();
  };

  // Styles
  const authButtonRow = {
    maxWidth: "1000px",
    width: "100%",
    display: "flex",
    gap: "8px",
    justifyContent: "flex-end",
  };

  return (
    <>
      <div style={authButtonRow}>
        {!auth.isAuthenticated ? (
          <button
            disabled={auth.isLoading}
            onClick={() => auth.signinRedirect()}
          >
            Sign in
          </button>
        ) : (
          <>
            <button onClick={fetchUserData} disabled={userLoading}>
              Fetch User Profile
            </button>
            <button onClick={() => logout()}>Logout</button>
          </>
        )}
      </div>

      {auth.isLoading && <p>Loading authentication...</p>}
      {auth.error && <p>Authentication Error: {auth.error?.message}</p>}
      {auth.isAuthenticated && (
        <div>
          <pre> Hello: {auth.user?.profile.email} </pre>
        </div>
      )}
      {userProfile && (
        <p className="bg-white p-2 border border-gray-300 rounded text-sm break-all min-h-[2.5rem]">
          user profile: <pre>{JSON.stringify(userProfile, null, 2)}</pre>
        </p>
      )}
    </>
  );
}
