import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { ROUTES } from "../../core/config";

export function AuthCallbackPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    // If authentication is complete, redirect to home
    if (auth.isAuthenticated) {
      navigate(ROUTES.HOME);
    }
  }, [auth.isAuthenticated, navigate]);

  if (auth.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Error</h1>
          <p className="text-destructive mb-4">{auth.error.message}</p>
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="text-primary hover:underline"
          >
            Return to home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing sign in...</h1>
        <p className="text-muted-foreground">
          Please wait while we sign you in.
        </p>
      </div>
    </div>
  );
}
