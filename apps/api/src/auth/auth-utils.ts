import { FastifyRequest, FastifyReply } from "fastify";
import { config } from "dotenv";

config();

// Middleware to verify Cognito JWT tokens
export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply
        .code(401)
        .send({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const JWKS_URI = process.env.AWS_COGNITO_JWKS_URI || "";

    if (!JWKS_URI) {
      request.log.error("AWS_COGNITO_JWKS_URI not configured");
      return reply.code(500).send({ error: "Server configuration error" });
    }

    // Lazy import jose
    const { createRemoteJWKSet, jwtVerify } = await import("jose");
    const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

    // Verify the JWT token using Cognito's public keys
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

// Extend Fastify request type to include user
declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}
