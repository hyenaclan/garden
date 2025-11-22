import { writeFileSync } from "fs";
import { join } from "path";
import { config } from "dotenv";
import { init } from "./init";

// Load environment variables
config();

async function generateOpenApiSpec() {
  // Initialize app with Swagger enabled
  const app = init({ enableSwagger: true });

  // Ready the app to finalize all routes
  await app.ready();

  // Get the OpenAPI spec
  const spec = (app as any).swagger();

  // Write to file
  const outputPath = join(__dirname, "..", "openapi.json");
  writeFileSync(outputPath, JSON.stringify(spec, null, 2));

  console.log(`✅ OpenAPI spec generated at: ${outputPath}`);

  await app.close();
}

generateOpenApiSpec().catch((err) => {
  console.error("❌ Failed to generate OpenAPI spec:", err);
  process.exit(1);
});
