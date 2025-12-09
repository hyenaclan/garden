import { useAuth } from "react-oidc-context";
import "../../App.css";
import { Button } from "@garden/ui/components/button";
import { GardenProvider } from "../garden-canvas/store";
import { GardenCanvas } from "../garden-canvas/GardenCanvas";
import { useState } from "react";
import { LandingPage } from "./LandingPage";
import { Sprout } from "lucide-react";

export function HomePage() {
  const auth = useAuth();
  const [showGarden, setShowGarden] = useState(false);
  const buildId = import.meta.env.VITE_BUILD_ID;
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7);

  if (!auth.isAuthenticated) {
    return <LandingPage />;
  }

  return (
    <>
      <section className="max-w-5xl mx-auto mt-12 rounded-2xl border border-border bg-gradient-to-b from-primary/5 via-background to-secondary/10 p-10 shadow-md text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
          <Sprout className="size-4" />
          Your garden hub
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-foreground">
          Step into your garden
        </h1>
        <p className="text-muted-foreground mt-2">
          Jump back into your space to see what is growing.
        </p>
        <div className="mt-6 flex justify-center">
          <Button
            variant="default"
            size="lg"
            className="shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-transform duration-200 px-6"
            onClick={() => setShowGarden(true)}
          >
            <Sprout className="size-4" />
            My Garden
          </Button>
        </div>
      </section>
      {showGarden && (
        <div className="max-w-5xl mx-auto">
          <GardenProvider gardenId="demo-garden">
            <GardenCanvas />
          </GardenProvider>
        </div>
      )}

      <footer className="text-xs text-gray-500 mt-4">
        Build #{buildId} ({commitSha})
      </footer>
    </>
  );
}
