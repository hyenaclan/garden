import { useState } from "react";
import reactLogo from "../../../assets/react.svg";
import viteLogo from "/vite.svg";
import "../../../App.css";
import { Button } from "@garden/ui/components/button";
import { AuthPanel } from "../../shared/AuthPanel";
import { HealthStatus } from "../../shared/HealthStatus";

export function HomePage() {
  const [count, setCount] = useState(0);
  const buildId = import.meta.env.VITE_BUILD_ID;
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7);

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
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <HealthStatus />
      </div>

      <footer className="text-xs text-gray-500 mt-4">
        Build #{buildId} ({commitSha})
      </footer>
    </>
  );
}
