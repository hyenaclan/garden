import { FastifyInstance } from "fastify";
import { authHandler } from "./auth-handler.js";
import cors from "@fastify/cors";
import type {} from "./types/fastify.js";
import { registerGardenRoutes } from "./routes/garden-routes.js";

export function init(app: FastifyInstance) {
  app.register(cors, {
    origin: true, // Allow all origins (API Gateway already has CORS configured)
    credentials: true,
  });

  // Register routes
  app.register(async (instance) => {
    // Set user from JWT claims for protected routes
    authHandler(instance);

    await registerGardenRoutes(instance);

    instance.get(
      "/public/health",
      {
        schema: {
          tags: ["health"],
          description: "Simple health check endpoint",
          response: {
            200: {
              type: "object",
              properties: {
                ok: { type: "boolean" },
              },
            },
          },
        },
      },
      async () => ({ ok: true }),
    );
  });

  return app;
}
