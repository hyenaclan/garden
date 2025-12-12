import { defineConfig } from "vitest/config";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(currentDir, "./src"),
      "@garden/api-contract": resolve(
        currentDir,
        "../../packages/api-contract/src",
      ),
    },
  },
  test: {
    globals: true,
    environment: "node",
    setupFiles: "./tests/setup.ts",
    include: ["tests/**/*.test.ts"],
    pool: "threads",
    poolOptions: {
      threads: {
        singleThread: true,
      },
    },
    testTimeout: 10000,
  },
});
