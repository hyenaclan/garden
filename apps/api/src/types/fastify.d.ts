import "fastify";
import type { APIGatewayProxyEvent, Context } from "aws-lambda";

declare module "fastify" {
  interface FastifyRequest {
    awsLambda?: {
      event: APIGatewayProxyEvent;
      context: Context;
    };
    user?: Record<string, unknown>;
  }
}

// to make it a module and avoid global scope pollution
export {};
