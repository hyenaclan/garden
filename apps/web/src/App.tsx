import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.scss";
import { useApiFetch } from "./hooks/useApiFetch";
import { AuthProvider, useAuth } from "react-oidc-context";
import { cognitoAuthConfig } from "./auth/cognito-config";

function App() {
  const [count, setCount] = useState(0);
  // Use state to hold the API response message
  const { apiResponse, isLoading, fetchData } = useApiFetch();

  const buildId = import.meta.env.VITE_BUILD_ID;
  const commitSha = import.meta.env.VITE_COMMIT_SHA?.slice(0, 7);

  const auth = useAuth();

  return (
    <>
      {/* Auth poc */}
      {auth.isLoading && <p>Loading authentication...</p>}
      {auth.error && <p>Authentication Error: {auth.error?.message}</p>}
      {auth.isAuthenticated && (
        <div>
          <pre> Hello: {auth.user?.profile.email} </pre>
          <pre> ID Token: {auth.user?.id_token} </pre>
          <pre> Access Token: {auth.user?.access_token} </pre>
          <pre> Refresh Token: {auth.user?.refresh_token} </pre>

          <button onClick={() => auth.removeUser()}>Sign out</button>
        </div>
      )}
      {!auth.isAuthenticated && (
        <button disabled={auth.isLoading} onClick={() => auth.signinRedirect()}>
          Sign in
        </button>
      )}

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
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p>
        <button onClick={fetchData} disabled={isLoading}>
          Fetch from API
        </button>
        <h3 className="mt-4 font-bold">API Output:</h3>
        <p className="bg-white p-2 border border-gray-300 rounded text-sm break-all min-h-[2.5rem]">
          {apiResponse || "Click button to fetch data"}
        </p>
      </p>
      <footer className="text-xs text-gray-500 mt-4">
        Build #{buildId} ({commitSha})
      </footer>
    </>
  );
}

export default App;
