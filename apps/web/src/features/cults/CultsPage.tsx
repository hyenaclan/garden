import { useAuth } from "react-oidc-context";
import { LandingPage } from "../home/LandingPage";

export function CultsPage() {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <LandingPage />;
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Cults</h1>
      <p className="text-muted-foreground">This page is coming soon...</p>
    </div>
  );
}
