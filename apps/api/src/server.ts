import Fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { getDb } from "./db";
import { sql } from "drizzle-orm";
import { gardeners } from "./schema";

export function init(app: FastifyInstance) {
  app.register(cors, {
    origin: true,
    credentials: true,
  });

  // Register routes
  app.register(async (instance) => {
    instance.get(
      "/temp-api/health",
      {
        schema: {
          tags: ["health"],
          description: "Health check endpoint with detailed information",
          response: {
            200: {
              type: "object",
              properties: {
                message: { type: "string" },
                timestamp: { type: "string", format: "date-time" },
                status: { type: "string", enum: ["ok", "error"] },
                user_count: { type: "number" },
              },
            },
          },
        },
      },
      async () => {
        const db = getDb();
        const [{ count }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(gardeners);

        return {
          message: "Hello from the Garden API",
          timestamp: new Date().toISOString(),
          status: "ok",
          user_count: Number(count),
        };
      },
    );

    instance.get(
      "/health",
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
  const { registerSwagger } = require("./swagger");
  const app = Fastify({ logger: true });

  registerSwagger(app);
  init(app);

  const port = 3001;
  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`[API] Server running at ${address}`);
  });
}
