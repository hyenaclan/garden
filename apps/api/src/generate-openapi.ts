/* eslint-disable @typescript-eslint/no-explicit-any */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import Fastify from "fastify";
import { init } from "./server.js";
import { registerSwagger } from "./swagger.js";

// Load environment variables
config();

const currentDir = dirname(fileURLToPath(import.meta.url));

async function generateOpenApiSpec() {
  // Initialize app with Swagger enabled
  const app = Fastify({ logger: true });
  registerSwagger(app);
  init(app);

  // Ready the app to finalize all routes
  await app.ready();

  // Get the OpenAPI spec
  const spec = (app as any).swagger();

  // Write to file
  const outputPath = join(currentDir, "..", "openapi.json");
  writeFileSync(outputPath, JSON.stringify(spec, null, 2));

  console.log(`✅ OpenAPI spec generated at: ${outputPath}`);

  await app.close();
}

generateOpenApiSpec().catch((err) => {
  console.error("❌ Failed to generate OpenAPI spec:", err);
  process.exit(1);
});
