import awsLambdaFastify from "@fastify/aws-lambda";
import { init } from "./server";

const app = init();
const proxy = awsLambdaFastify(app);

export const handler = async (event: any, context: any) => {
  // 👇 This line tells Lambda NOT to wait for the Node.js event loop to empty
  // (so it won't hang while the pg pool is still keeping sockets open)
  context.callbackWaitsForEmptyEventLoop = false;

  return proxy(event, context);
};
