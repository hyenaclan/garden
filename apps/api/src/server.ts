import { FastifyInstance } from "fastify";
import { authHandler } from "./auth-handler";
import cors from "@fastify/cors";
import type {} from "./types/fastify";
import { registerGardenRoutes } from "./routes/garden-routes";

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

// if run locally (e.g. npm run dev)
if (require.main === module) {
  (async () => {
    const { default: Fastify } = await import("fastify");
    const { registerSwagger } = await import("./swagger");

    const app = Fastify({ logger: true });
    registerSwagger(app);
    init(app);

    const port = 3001;
    app.listen({ port }, (err: Error | null, address: string) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }
      app.log.info(`[API] Server running at ${address}`);
    });
  })();
}
