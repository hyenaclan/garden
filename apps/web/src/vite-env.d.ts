/// <reference types="vite/client" />

/**
 * Extends the ImportMetaEnv interface to include custom VITE environment variables.
 * This resolves the TypeScript error: "Property 'VITE_API_BASE_URL' does not exist..."
 */
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // Add other VITE_ variables here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}