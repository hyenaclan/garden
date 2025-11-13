import Fastify from 'fastify';
import cors from '@fastify/cors';

export function init(options?: { enableSwagger?: boolean }) {
  const app = Fastify({ logger: true })

  // Register CORS plugin
  app.register(cors, {
    origin: true, // Allow all origins in development, or specify your frontend URL
    credentials: true
  })

  // Register Swagger if enabled (for OpenAPI generation)
  if (options?.enableSwagger) {
    const swagger = require('@fastify/swagger');
    app.register(swagger, {
      openapi: {
        info: {
          title: 'Garden API',
          description: 'API documentation for the Garden application',
          version: '1.0.0'
        },
        servers: [
          {
            url: 'http://localhost:3001',
            description: 'Development server'
          },
          {
            url: 'https://e75x4uq227.execute-api.us-east-1.amazonaws.com',
            description: 'Dev environment'
          }
        ],
        tags: [
          { name: 'health', description: 'Health check endpoints' }
        ]
      },
      transform: ({ schema, url }: { schema: any; url: string }) => {
        return { schema, url };
      }
    });
  }

  // Register routes
  app.register(async (instance) => {
    instance.get('/temp-api/health', {
      schema: {
        tags: ['health'],
        description: 'Health check endpoint with detailed information',
        response: {
          200: {
            type: 'object',
            properties: {
              message: { type: 'string' },
              timestamp: { type: 'string', format: 'date-time' },
              status: { type: 'string', enum: ['ok', 'error'] }
            }
          }
        }
      }
    }, async () => ({
      message: 'Hello from the Garden API',
      timestamp: new Date().toISOString(),
      status: 'ok',
    }))

    instance.get('/health', {
      schema: {
        tags: ['health'],
        description: 'Simple health check endpoint',
        response: {
          200: {
            type: 'object',
            properties: {
              ok: { type: 'boolean' }
            }
          }
        }
      }
    }, async () => ({ ok: true }))
  })

  return app
}

// if run locally (e.g. npm run dev)
if (require.main === module) {
  // Initialize with Swagger enabled for development
  const app = init({ enableSwagger: true })

  // Register Swagger UI only in development mode
  const swaggerUi = require('@fastify/swagger-ui')

  app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    },
    staticCSP: true
  })

  const port = 3001
  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`[API] Server running at ${address}`)
  })
}