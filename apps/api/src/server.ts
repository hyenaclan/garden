import Fastify from "fastify";
import cors from "@fastify/cors";
import { getDb } from "./db";
import { sql } from "drizzle-orm";
import { gardeners } from "./schema";
import { authHandler } from "./auth-handler";

declare module "fastify" {
  interface FastifyRequest {
    user?: Record<string, any>;
  }
}

export function init() {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: true, // Allow all origins (API Gateway already has CORS configured)
    credentials: true,
  });

  // Register routes
  app.register(async (instance) => {
    // Set user from JWT claims for protected routes
    authHandler(instance);

    instance.get(
      "/public/temp-api/health",
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
      }
    );

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
      async () => ({ ok: true })
    );

    instance.get("/api/user/profile", async (request) => {
      return {
        message: "This is a protected route",
        user: request.user, // User info from JWT
        timestamp: new Date().toISOString(),
      };
    });
  });

  return app;
}

// if run locally (e.g. npm run dev)
if (require.main === module) {
  const app = init();

  // Register Swagger for OpenAPI generation
  const swagger = require("@fastify/swagger");
  const swaggerUi = require("@fastify/swagger-ui");

  app.register(swagger, {
    openapi: {
      info: {
        title: "Garden API",
        description: "API documentation for the Garden application",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3001",
          description: "Development server",
        },
        ...(process.env.DEV_API_URL
          ? [
              {
                url: process.env.DEV_API_URL,
                description: "Dev environment",
              },
            ]
          : []),
      ],
      tags: [{ name: "health", description: "Health check endpoints" }],
    },
    transform: ({ schema, url }: { schema: any; url: string }) => {
      return { schema, url };
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: true,
  });

  const port = 3001;
  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
    app.log.info(`[API] Server running at ${address}`);
  });
}
