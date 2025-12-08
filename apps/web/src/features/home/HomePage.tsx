import { useAuth } from "react-oidc-context";
import reactLogo from "../../assets/react.svg";
import viteLogo from "/vite.svg";
import "../../App.css";
import { Button } from "@garden/ui/components/button";
import { AuthPanel } from "../auth/AuthPanel";
import { GardenProvider } from "../garden-canvas/store";
import { GardenCanvas } from "../garden-canvas/GardenCanvas";
import { useState } from "react";
import { LandingPage } from "./LandingPage";

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <AuthPanel />
      </div>

      <div className="flex justify-center">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>

      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div className="mt-6">
        <Button variant="secondary" onClick={() => setShowGarden(true)}>
          My Garden
        </Button>
        {showGarden && (
          <GardenProvider gardenId="demo-garden">
            <GardenCanvas />
          </GardenProvider>
        )}
      </div>

      <footer className="text-xs text-gray-500 mt-4">
        Build #{buildId} ({commitSha})
      </footer>
    </>
  );
}
