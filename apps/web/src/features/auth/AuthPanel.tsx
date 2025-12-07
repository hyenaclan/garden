import { useAuth } from "react-oidc-context";
import { Button } from "@garden/ui/components/button";
import { useUserProfileQuery } from "./useUserProfileQuery";
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

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="flex gap-2 justify-center mb-4">
        <Button onClick={fetchUserData} disabled={isFetching}>
          Fetch User Profile (protected)
        </Button>
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

      {isError && (
        <p className="text-destructive mb-4">
          Error loading profile:{" "}
          {error instanceof Error ? error.message : "Unknown error"}
        </p>
      )}

      {auth.isLoading && (
        <p className="text-muted-foreground mb-4">Loading authentication...</p>
      )}
      {auth.error && (
        <p className="text-destructive mb-4">
          Authentication Error: {auth.error?.message}
        </p>
      )}
      {auth.isAuthenticated && (
        <div className="mb-4">
          <pre className="text-sm">Hello: {auth.user?.profile.email}</pre>
        </div>
      )}
      {userProfile && (
        <div className="mb-4">
          <p className="text-sm mb-2">User profile:</p>
          <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
            {JSON.stringify(userProfile, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
