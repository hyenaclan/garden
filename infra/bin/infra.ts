#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib/core';
import { InfraStack } from '../lib/infra-stack';

const app = new cdk.App();

const stage = (app.node.tryGetContext('stage') ?? process.env.STAGE ?? 'dev') as string;

new InfraStack(app, `infra-${stage}`, {
  tags: { Stage: stage, App: 'my-app' },
});