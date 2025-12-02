import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { authHandler } from "./auth-handler";
import cors from "@fastify/cors";
import { getDb } from "./db";
import { sql } from "drizzle-orm";
import { gardeners } from "./schema";
import { registerGardenRoutes } from "./routes/garden/routes";
import type {} from "./types/fastify";
import { ExternalProvider, IUserParams } from "./services/gardener-service";

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
      },
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
      async () => ({ ok: true }),
    );

    instance.get(
      "/api/user/profile",
      async (request: FastifyRequest, reply: FastifyReply) => {
        const { upsertAndGetGardener } = await import(
          "./services/gardener-service"
        );

        const user = request.user;

        if (!user?.sub || !user?.email) {
          request.log.error({ user }, "Missing required user information");
          return reply.code(401).send({ error: "Unauthorized" });
        }

        const userParams: IUserParams = {
          email: user.email,
          externalId: user.sub,
          externalProvider: ExternalProvider.COGNITO, // Hardcoded for now
        };

        const userProfile = await upsertAndGetGardener(userParams);
        return userProfile;
      },
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
