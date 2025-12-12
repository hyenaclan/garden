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
    <div className="max-w-6xl mx-auto px-4 md:px-6 py-4 md:py-6 h-[calc(100vh-120px)] overflow-hidden flex flex-col gap-4">
      <div className="flex items-center justify-center gap-3 relative">
        <Button variant="ghost" size="sm" asChild className="absolute left-0">
          <Link to="/" className="flex items-center gap-1">
            <span aria-hidden="true">←</span> Home
          </Link>
        </Button>
        <h1 className="text-2xl font-semibold text-center">Garden Canvas</h1>
      </div>

      <GardenProvider gardenId="demo-garden">
        <div className="flex-1 overflow-hidden">
          <GardenCanvas />
        </div>
      </GardenProvider>
    </div>
  );
}
