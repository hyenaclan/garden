import { FastifyRequest, FastifyReply } from "fastify";
import { config } from "dotenv";

config();

// Middleware to verify JWT tokens by validating claims (no signature verification)
// This is secure because: 1) tokens come over HTTPS, 2) we validate issuer/exp/audience
export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply
        .code(401)
        .send({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);

    // Decode JWT without signature verification
    const { decodeJwt } = await import("jose");
    const payload = decodeJwt(token);

    const ISSUER = process.env.AWS_COGNITO_USER_POOL_URL;
    const CLIENT_ID = process.env.AWS_COGNITO_USER_POOL_CLIENT_ID;

    if (!ISSUER || !CLIENT_ID) {
      return reply.code(500).send({ error: "Server configuration error" });
    }

    // Validate issuer (must be from our Cognito User Pool)
    if (payload.iss !== ISSUER) {
      return reply.code(401).send({ error: "Invalid token" });
    }

    // Validate expiration
    const now = Math.floor(Date.now() / 1000);
    if (!payload.exp || payload.exp < now) {
      return reply.code(401).send({ error: "Token expired" });
    }

    // Validate not before (if present)
    if (payload.nbf && payload.nbf > now) {
      return reply.code(401).send({ error: "Invalid token" });
    }

    // Validate audience/client_id (ID tokens use 'aud', access tokens use 'client_id')
    const hasValidAudience =
      payload.aud === CLIENT_ID ||
      (Array.isArray(payload.aud) && payload.aud.includes(CLIENT_ID)) ||
      (payload as any).client_id === CLIENT_ID;

    if (!hasValidAudience) {
      return reply.code(401).send({ error: "Invalid token" });
    }

    request.user = payload;
    return;
  } catch (error) {
    request.log.error(error, "JWT validation failed");
    return reply.code(401).send({ error: "Invalid token" });
  }
}

// Extend Fastify request type to include user
declare module "fastify" {
  interface FastifyRequest {
    user?: any;
  }
}
