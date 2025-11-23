import {
  FastifyInstance,
} from "fastify";

export function authHandler(instance: FastifyInstance): void {
  instance.addHook("preHandler", async (request, reply) => {
    if (request.url.startsWith("/public/")) {
      // Public route; no user info needed
      return
    }

    const is_local = process.env.IS_LOCAL
    if(is_local !== 'true') {
      // In non-local environments, we expect API Gateway to verify token and populate claims
      request.user = (request as any).awsLambda?.event?.requestContext?.authorizer?.jwt?.claims;
    }
    else {
      // In local environments, we need to decode the jwt to get the claims
        const authHeader = request.headers.authorization
        if (!authHeader?.startsWith("Bearer ")) {
          return reply.code(401).send({ error: "Missing or invalid Authorization header" });
        }
        const token = authHeader.slice("Bearer ".length);
        try {
          const { decodeJwt } = await import("jose");
          const decoded = decodeJwt(token);
          request.user = decoded as Record<string, any>;
        } catch (err) {
          request.log.error({ err }, "Failed to decode local JWT");
          return reply.code(401).send({ error: "Invalid local JWT" });
        }
    }

    request.log.error("JWT claims not found in request context");
    if (!request.user) {
      return reply
        .code(401)
        .send({ error: "JWT claims not found in request context" });
    }
  });
}
