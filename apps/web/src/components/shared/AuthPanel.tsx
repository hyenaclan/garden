import { useAuth } from "react-oidc-context";
import { Button } from "@garden/ui/components/button";
import { useUserProfileQuery } from "../../hooks/useUserProfileQuery";
import { signOutRedirect } from "../../core/auth/cognito";

export function AuthPanel() {
  const auth = useAuth();
  const {
    data: userProfile,
    isFetching,
    isError,
    error,
    refetch,
  } = useUserProfileQuery(false);

  const fetchUserData = async () => {
    await refetch();
  };

  const logout = () => {
    auth.removeUser();
    signOutRedirect();
  };

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
        <Button onClick={fetchUserData} disabled={isFetching}>
          Fetch User Profile (protected)
        </Button>
        {isError && (
          <p>
            Error loading profile:{" "}
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        )}
        {!auth.isAuthenticated ? (
          <Button
            disabled={auth.isLoading}
            onClick={() => auth.signinRedirect()}
          >
            Sign in
          </Button>
        ) : (
          <Button onClick={() => logout()}>Logout</Button>
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
        <p>
          user profile: <pre>{JSON.stringify(userProfile, null, 2)}</pre>
        </p>
      )}
    </>
  );
}
