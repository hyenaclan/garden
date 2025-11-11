import awsLambdaFastify from '@fastify/aws-lambda';
import { init } from './server';

const app = init()
export const handler = awsLambdaFastify(app)