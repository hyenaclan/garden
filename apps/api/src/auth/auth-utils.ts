import { FastifyRequest, FastifyReply } from "fastify";
import { config } from "dotenv";

config();

// Middleware to verify auth - handles both local and deployed environments
export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
  // Local development: validate JWT manually
  if (process.env.IS_LOCAL === "true") {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        request.log.warn("Missing or invalid authorization header");
        return reply
          .code(401)
          .send({ error: "Missing or invalid authorization header" });
      }

      const token = authHeader.substring(7);
      const JWKS_URI = process.env.AWS_COGNITO_JWKS_URI;
      const ISSUER = process.env.AWS_COGNITO_USER_POOL_URL;

      if (!JWKS_URI || !ISSUER) {
        request.log.error("Cognito configuration missing for local auth");
        return reply.code(500).send({ error: "Server configuration error" });
      }

      // Lazy import jose for local dev
      const { createRemoteJWKSet, jwtVerify } = await import("jose");
      const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

      const { payload } = await jwtVerify(token, JWKS, {
        issuer: ISSUER,
      });

      request.log.info({ sub: payload.sub }, "Token verified locally");
      request.user = payload;
      return;
    } catch (error) {
      request.log.error(error, "Local JWT verification failed");
      return reply.code(401).send({ error: "Invalid or expired token" });
    }
  }

  // Production: trust API Gateway JWT authorizer
  const claims =
    (request.raw as any)?.requestContext?.authorizer?.jwt?.claims ||
    (request.raw as any)?.requestContext?.authorizer?.claims;

  if (!claims) {
    request.log.warn("No JWT claims from API Gateway authorizer");
    return reply.code(401).send({ error: "Unauthorized" });
  }

  request.log.info({ sub: claims.sub }, "User authenticated via API Gateway");
  request.user = claims;
}

// Extend Fastify request type to include user
declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}
