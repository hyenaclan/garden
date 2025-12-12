import { useAuth } from "react-oidc-context";
import { GardenProvider } from "./store";
import { GardenCanvas } from "./GardenCanvas";
import { Button } from "@garden/ui/components/button";
import { Link } from "react-router-dom";
import { LandingPage } from "../home/LandingPage";

export function GardenCanvasPage() {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background mx-auto">
      <div className="shrink-0 flex items-center justify-center gap-3 px-4 py-3 relative">
        <Button variant="ghost" size="sm" asChild className="absolute left-0">
          <Link to="/" className="flex items-center gap-1">
            <span aria-hidden="true">←</span> Home
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-center">Garden Canvas</h1>
      </div>

      <GardenProvider gardenId="demo-garden">
        <div className="flex-1 min-h-0 overflow-hidden">
          <GardenCanvas />
        </div>
      </GardenProvider>
    </div>
  );
}
