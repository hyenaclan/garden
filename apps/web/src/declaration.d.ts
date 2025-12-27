// src/declaration.d.ts

declare module "*.svg" {
  const content: string;
  export default content;
}

// You can add other assets here too:
declare module "*.png" {
  const content: string;
  export default content;
}

declare module "*.jpg" {
  const content: string;
  export default content;
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BUILD_ID: string;
  readonly VITE_COMMIT_SHA: string;
  readonly VITE_API_BASE_URL: string;

  readonly VITE_AWS_REGION: string;

  // Cognito
  readonly VITE_COGNITO_DOMAIN: string;
  readonly VITE_COGNITO_USER_POOL_ID: string;
  readonly VITE_COGNITO_USER_POOL_CLIENT_ID: string;

  readonly VITE_DEV_TOOLS_ENABLED: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
