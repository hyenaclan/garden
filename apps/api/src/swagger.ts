/* eslint-disable @typescript-eslint/no-explicit-any */
import { FastifyInstance } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export function registerSwagger(app: FastifyInstance) {
  app.register(swagger, {
    openapi: {
      info: {
        title: "Garden API",
        description: "API documentation for the Garden application",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3001",
          description: "Development server",
        },
        ...(process.env.DEV_API_URL
          ? [
              {
                url: process.env.DEV_API_URL,
                description: "Dev environment",
              },
            ]
          : []),
      ],
      tags: [{ name: "health", description: "Health check endpoints" }],
    },
    transform: ({ schema, url }: { schema: any; url: string }) => {
      return { schema, url };
    },
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
    staticCSP: true,
  });
}
