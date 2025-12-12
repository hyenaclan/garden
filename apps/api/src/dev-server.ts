import Fastify from "fastify";
import { init } from "./server.js";
import { registerSwagger } from "./swagger.js";

const app = Fastify({ logger: true });
registerSwagger(app);
init(app);

const port = Number(process.env.PORT || 3001);

app.listen({ port }, (err: Error | null, address: string) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  app.log.info(`[API] Server running at ${address}`);
});
