import "fastify";
import type { APIGatewayProxyEvent, Context } from "aws-lambda";

declare module "fastify" {
  interface AuthenticatedUser {
    sub?: string;
    email?: string;
    [key: string]: unknown;
  }

  interface FastifyRequest {
    awsLambda?: {
      event: APIGatewayProxyEvent;
      context: Context;
    };
    user?: AuthenticatedUser;
  }
}

// to make it a module and avoid global scope pollution
export {};
