import * as cdk from 'aws-cdk-lib/core';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'AppVpc', {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        { name: 'private', subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        { name: 'public',  subnetType: ec2.SubnetType.PUBLIC }, // helpful later for ALB/CFN validation
      ],
    });

    new cdk.CfnOutput(this, 'VpcId', { value: vpc.vpcId });
  }
}
