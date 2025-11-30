import { FastifyInstance } from "fastify";

export function authHandler(instance: FastifyInstance): void {
  instance.addHook("preHandler", async (request, reply) => {
    if (request.url.startsWith("/public/")) {
      // Public route; no user info needed
      return;
    }

    const lambdaEvent = request.awsLambda?.event;
    const isAwsInvocation = lambdaEvent !== undefined;

    if (isAwsInvocation) {
      // AWS invocation — use API Gateway-provided JWT claims
      request.user =
        lambdaEvent.requestContext?.authorizer?.jwt?.claims ?? undefined;
    } else {
      // Local invocation — decode JWT manually
      const authHeader = request.headers.authorization;
      if (!authHeader?.startsWith("Bearer ")) {
        return reply
          .code(401)
          .send({ error: "Missing or invalid Authorization header" });
      }
      const token = authHeader.slice("Bearer ".length);
      if (process.env.NODE_ENV === "test") {
        // Simple JWT decode for tests (no signature verification)
        const parts = token.split(".");
        const payload = JSON.parse(Buffer.from(parts[1], "base64").toString());
        request.user = payload as Record<string, unknown>;
      } else {
        try {
          const { decodeJwt } = await import("jose");
          const decoded = decodeJwt(token);
          request.user = decoded as Record<string, unknown>;
        } catch (err) {
          request.log.error({ err }, "Failed to decode local JWT");
          return reply.code(401).send({ error: "Invalid local JWT" });
        }
      }
    }

    if (!request.user) {
      request.log.error("JWT claims not found in request context");
      return reply
        .code(401)
        .send({ error: "JWT claims not found in request context" });
    }
  });
}
