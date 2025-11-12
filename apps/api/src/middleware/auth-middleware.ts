import { FastifyRequest, FastifyReply } from "fastify";
import { createRemoteJWKSet, jwtVerify } from "jose";

// Cognito JWKS URL
const JWKS_URI =
  "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_tCspFEqcX/.well-known/jwks.json";
const JWKS = createRemoteJWKSet(new URL(JWKS_URI));

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

    // Verify the JWT token using Cognito's public keys
    // Note: Access tokens don't have 'aud' claim, only 'client_id'
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_tCspFEqcX",
      // Don't validate audience for access tokens - they use 'client_id' instead
    });

    // Optionally verify client_id matches (access tokens use this instead of aud)
    if (payload.client_id !== "6t618tua7043i194i71u8703oh") {
      return reply.code(401).send({ error: "Invalid client_id in token" });
    }

    // Attach user info to request
    request.user = payload;
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
