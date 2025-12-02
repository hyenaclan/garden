import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { useApiFetch } from "./hooks/useApiFetch";
import Auth from "./components/Auth";
import { GardenDemoPage } from "./garden/GardenDemoPage";
import { GardenProvider } from "./state/gardenStore";
import { useAuthenticatedFetch } from "./hooks/useAuthenticatedFetch";
import { queryClient } from "./queryClient";

type View = "home" | "garden";

function App() {
  const [count, setCount] = useState(0);
  const { apiResponse, isLoading, fetchData } = useApiFetch();
  const [view, setView] = useState<View>("home");
  const authenticatedFetch = useAuthenticatedFetch();

  const buildId = import.meta.env.VITE_BUILD_ID;
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7);

  if (view === "garden") {
    return (
      <GardenProvider
        gardenId="1f0b4950-f6ea-4c98-8811-50b3469e063a"
        fetcher={authenticatedFetch}
        queryClient={queryClient}
      >
        <GardenDemoPage onBack={() => setView("home")} />
      </GardenProvider>
    );
  }

  return (
    <div className="home-page">
      <Auth />

      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((current) => current + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        <button onClick={fetchData} disabled={isLoading}>
          Fetch from API
        </button>
        <div className="mt-4 font-bold">API Output:</div>
        <p className="bg-white p-2 border border-gray-300 rounded text-sm break-all min-h-[2.5rem]">
          {apiResponse || "Click button to fetch data"}
        </p>
      </div>

      <div style={{ marginTop: "1.5rem" }}>
        <button
          onClick={() => setView("garden")}
          className="home-button"
        >
          Open Garden Canvas
        </button>
      </div>

      <footer className="text-xs text-gray-500 mt-4">
        Build #{buildId} ({commitSha})
      </footer>
    </div>
  );
}

export default App;
