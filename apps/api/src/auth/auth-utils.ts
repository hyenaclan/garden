import { FastifyRequest, FastifyReply } from "fastify";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { config } from "dotenv";

config();

const ISSUER = process.env.AWS_COGNITO_USER_POOL_URL;
const CLIENT_ID = process.env.AWS_COGNITO_USER_POOL_CLIENT_ID;

// Cache the JWKS for the Cognito User Pool
let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJWKS() {
  if (!jwks) {
    if (!ISSUER) {
      throw new Error("AWS_COGNITO_USER_POOL_URL not configured");
    }
    // Cognito JWKS endpoint is at /.well-known/jwks.json
    const jwksUrl = `${ISSUER}/.well-known/jwks.json`;
    jwks = createRemoteJWKSet(new URL(jwksUrl));
  }
  return jwks;
}

// Middleware to verify JWT tokens with cryptographic signature verification
export async function verifyAuth(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return reply
        .code(401)
        .send({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);

    if (!ISSUER || !CLIENT_ID) {
      return reply.code(500).send({ error: "Server configuration error" });
    }

    // Verify JWT signature using Cognito's JWKS and validate claims
    const { payload } = await jwtVerify(token, getJWKS(), {
      issuer: ISSUER,
      audience: CLIENT_ID,
    });

    // Additional validation for access tokens which use 'client_id' instead of 'aud'
    if (!payload.aud && (payload as any).client_id !== CLIENT_ID) {
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
