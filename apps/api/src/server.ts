import Fastify from 'fastify';
import cors from '@fastify/cors';

export function init() {
  const app = Fastify({ logger: true })

  // Register CORS plugin
  app.register(cors, {
    origin: true, // Allow all origins in development, or specify your frontend URL
    credentials: true
  })

  app.get('/temp-api/health', async () => ({
    message: 'Hello from the Garden API',
    timestamp: new Date().toISOString(),
    status: 'ok',
  }))

  app.get('/health', async () => ({ ok: true }))

  return app
}

// if run locally (e.g. npm run dev)
if (require.main === module) {
  const app = init()
  const port = 3001
  app.listen({ port }, (err, address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
    app.log.info(`[API] Server running at ${address}`)
  })
}