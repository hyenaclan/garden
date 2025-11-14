import { FastifyRequest, FastifyReply } from "fastify";

// Cognito JWKS URL (used only for local verification)
const JWKS_URI = process.env.AWS_COGNITO_JWKS_URI || "";

// Middleware to verify Cognito JWT tokens (or trust API Gateway when not local)
export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
  // Local: verify using jose and Cognito JWKS

  if (process.env.IS_LOCAL) {
    try {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return reply
          .code(401)
          .send({ error: "Missing or invalid authorization header" });
      }

      const token = authHeader.substring(7); // Remove 'Bearer ' prefix

      // Lazy import jose so production bundles/environments that don't need it won't require it
      const { createRemoteJWKSet, jwtVerify } = await import("jose");
      const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

      // Verify the JWT token using Cognito's public keys
      // Note: Access tokens don't always have 'aud' claim, they may use 'client_id'
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: process.env.AWS_COGNITO_USER_POOL_URL,
      });

      // Attach user info to request
      request.user = payload;
      return;
    } catch (error) {
      request.log.error(error, "JWT verification failed");
      return reply.code(401).send({ error: "Invalid or expired token" });
    }
  }

  // Non-local: trust API Gateway / ALB authorizer to provide claims
  const claims =
    (request.raw as any)?.requestContext?.authorizer?.claims ||
    (request.raw as any)?.requestContext?.authorizer;

  if (!claims) {
    return reply.code(401).send({ error: "Unauthorized" });
  }

  // Attach claims to request for downstream handlers
  request.user = claims;
}

// Extend Fastify request type to include user
declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}
