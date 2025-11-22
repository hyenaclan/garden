import {
  FastifyInstance,
  RawServerDefault,
  FastifyBaseLogger,
  FastifyTypeProvider,
} from "fastify";
import { IncomingMessage, ServerResponse } from "http";

export function authHandler(
  instance: FastifyInstance<
    RawServerDefault,
    IncomingMessage,
    ServerResponse<IncomingMessage>,
    FastifyBaseLogger,
    FastifyTypeProvider
  >
) {
  instance.addHook("preHandler", async (request, reply) => {
    if (request.method === "OPTIONS") {
      // Let CORS plugin handle preflight; no auth
      return;
    }

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
            const { decodeJwt } = await import("jose");
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
}
