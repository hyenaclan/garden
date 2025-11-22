import cors from "@fastify/cors";
import Fastify from "fastify";
import { decodeJwt } from "jose";
import { getDb } from "./db";
import { gardeners } from "./schema";

export function init() {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: true, // Allow all origins (API Gateway already has CORS configured)
    credentials: true,
  });

  app.register(async (instance) => {
    // Set user from JWT claims for protected routes
    instance.addHook("preHandler", async (request, reply) => {
      if (!request.url.startsWith("/public/")) {
        const isLocal = process.env.NODE_ENV !== "production";

        const claims = (request as any).requestContext?.authorizer?.jwt?.claims;
        if (claims) {
          request.user = claims;
        } else {
          const authHeader = request.headers.authorization;
          if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return reply
              .code(401)
              .send({ error: "Missing or invalid authorization header" });
          }

          const token = authHeader.substring("Bearer ".length);

          if (isLocal) {
            try {
              const decoded = decodeJwt(token);
              request.user = decoded as Record<string, any>;
            } catch (err) {
              request.log.error({ err }, "Failed to decode local JWT");
              return reply.code(401).send({ error: "Invalid local JWT" });
            }
          } else {
            // In non-local environments, we expect API Gateway to have
            // already validated the JWT and populated claims. If it's
            // missing here, treat it as unauthorized.
            return reply
              .code(401)
              .send({ error: "JWT claims not found in request context" });
          }
        }
      } else {
        // Public route; no user info needed
      }
    });

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
      console.log("REQUEST⚛️⚛️⚛️⚛️:", request);
      return {
        message: "This is a protected route",
        user: request.user, // User info from JWT
        timestamp: new Date().toISOString(),
      };
    });
  });

  return app;
}
