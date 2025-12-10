import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@garden/ui": path.resolve(__dirname, "../../packages/ui/src"),
      "@garden/api-contract": path.resolve(
        __dirname,
        "../../packages/api-contract/src",
      ),
    },
  },
  server: {
    proxy: {
      "/temp-api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // @ts-expect-error - vitest config
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setupTests.ts",
  },
});
