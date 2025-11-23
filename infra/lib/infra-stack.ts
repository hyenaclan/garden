import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as rds from "aws-cdk-lib/aws-rds";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integ from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as logs from "aws-cdk-lib/aws-logs";
import * as events from "aws-cdk-lib/aws-events";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as targets from "aws-cdk-lib/aws-events-targets";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as cognito from "aws-cdk-lib/aws-cognito";
import * as apigwv2_authorizers from "aws-cdk-lib/aws-apigatewayv2-authorizers";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as path from "path";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const stage = (this.node.tryGetContext("stage") ??
      process.env.STAGE ??
      "dev") as string;

    const vpc = new ec2.Vpc(this, "AppVpc", {
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        { name: "private", subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
        { name: "public", subnetType: ec2.SubnetType.PUBLIC }, // helpful later for ALB/CFN validation
      ],
    });

    const s3Gw = vpc.addGatewayEndpoint("S3Gw", {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    const dbSg = new ec2.SecurityGroup(this, "DbSg", {
      vpc,
      allowAllOutbound: true,
    });

    const dbUser = new cdk.CfnParameter(this, "DbUser", { type: "String" });
    const dbPassword = new cdk.CfnParameter(this, "DbPassword", {
      type: "String",
      noEcho: true,
    });

    const db = new rds.DatabaseInstance(this, "Postgres", {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [dbSg],
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_17_6,
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T4G,
        ec2.InstanceSize.MICRO
      ),
      credentials: rds.Credentials.fromPassword(
        dbUser.valueAsString,
        cdk.SecretValue.unsafePlainText(dbPassword.valueAsString)
      ),
      databaseName: "garden",
      allocatedStorage: 20,
      storageEncrypted: true,
      multiAz: false,
      publiclyAccessible: false,
      deletionProtection: stage === "prod",
      backupRetention: cdk.Duration.days(stage === "prod" ? 7 : 1),
      cloudwatchLogsExports: ["postgresql"],
      removalPolicy:
        stage === "prod" ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
    });

    const lambdaSg = new ec2.SecurityGroup(this, "LambdaSg", {
      vpc,
      allowAllOutbound: true,
    });

    const apiFn = new NodejsFunction(this, "GardenApiFn", {
      entry: path.join(
        __dirname,
        "..",
        "..",
        "apps",
        "api",
        "src",
        "lambda.ts"
      ),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_LATEST,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [lambdaSg],
      environment: {
        DB_HOST: db.instanceEndpoint.hostname,
        DB_USER: dbUser.valueAsString,
        DB_PASS: dbPassword.valueAsString,
        DB_NAME: "garden",
        DB_PORT: "5432",
      },
      logGroup: new logs.LogGroup(this, "GardenApiFnLogs", {
        retention: logs.RetentionDays.TWO_WEEKS,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
      }),
      bundling: {
        minify: true,
        externalModules: [],
      },
      timeout: cdk.Duration.seconds(10),
    });

    db.connections.allowDefaultPortFrom(apiFn);

    // --- Keep Lambda backend warm via EventBridge rule ---
    new events.Rule(this, "KeepWarmRule", {
      schedule: events.Schedule.rate(cdk.Duration.minutes(1)),
      targets: [
        new targets.LambdaFunction(apiFn, {
          event: events.RuleTargetInput.fromObject({
            rawPath: "/public/health",
          }),
        }),
      ],
    });

    const migrateFn = new NodejsFunction(this, "GardenDBMigrateFn", {
      entry: path.join(
        __dirname,
        "..",
        "..",
        "apps",
        "api",
        "src",
        "migrate.ts"
      ),
      handler: "handler",
      runtime: lambda.Runtime.NODEJS_LATEST,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_ISOLATED },
      securityGroups: [lambdaSg],
      environment: {
        DB_HOST: db.instanceEndpoint.hostname,
        DB_USER: dbUser.valueAsString,
        DB_PASS: dbPassword.valueAsString,
        DB_NAME: "garden",
        DB_PORT: "5432",
      },
      timeout: cdk.Duration.seconds(29),
      bundling: {
        minify: true,
        commandHooks: {
          afterBundling(inputDir: string, outputDir: string): string[] {
            console.log("Bundling migrateFn...");
            console.log("inputDir:", inputDir);
            console.log("outputDir:", outputDir);
            console.log("cwd:", process.cwd());

            const drizzleSrc = path.join(
              inputDir,
              "..",
              "apps",
              "api",
              "drizzle"
            );
            console.log("Resolved drizzleSrc:", drizzleSrc);

            return [
              `if [ ! -d "${drizzleSrc}" ]; then echo "❌ Missing ${drizzleSrc}"; exit 1; fi`,
              `cp -r ${drizzleSrc} ${outputDir}/drizzle`,
            ];
          },
          beforeBundling(): string[] {
            return [];
          },
          beforeInstall(): string[] {
            return [];
          },
        },
      },
    });
    db.connections.allowDefaultPortFrom(migrateFn);

    // --- Static React app hosting ---
    const siteBucket = new s3.Bucket(this, "SiteBucket", {
      websiteIndexDocument: "index.html",
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const originAccess = new cloudfront.OriginAccessIdentity(this, "OAI");
    siteBucket.grantRead(originAccess);

    const distribution = new cloudfront.Distribution(this, "SiteDistribution", {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessIdentity(siteBucket, {
          originAccessIdentity: originAccess,
        }),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      defaultRootObject: "index.html",
      // Handle SPA routing - return index.html for 403/404 errors
      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
          ttl: cdk.Duration.minutes(5),
        },
      ],
      comment: `React site (${stage})`,
    });

    const userPool = new cognito.UserPool(this, "UserPool", {
      userPoolName: `garden-users-${stage}`,
      selfSignUpEnabled: true,
      signInAliases: { email: true },
      autoVerify: { email: true },
      standardAttributes: { email: { required: true, mutable: true } },
      passwordPolicy: {
        minLength: 8,
        requireLowercase: true,
        requireUppercase: true,
        requireDigits: true,
        requireSymbols: false,
      },
      accountRecovery: cognito.AccountRecovery.EMAIL_ONLY,
    });

    const domain = userPool.addDomain("UserPoolDomain", {
      cognitoDomain: { domainPrefix: `garden-${stage}` },
    });
    const httpDomain = `https://${distribution.domainName}`;
    const userPoolClient = new cognito.UserPoolClient(this, "UserPoolClient", {
      userPool,
      userPoolClientName: "garden-web",
      generateSecret: false, // public client for PKCE
      oAuth: {
        flows: { authorizationCodeGrant: true },
        scopes: [cognito.OAuthScope.OPENID, cognito.OAuthScope.EMAIL],
        callbackUrls: [`${httpDomain}/auth/callback`],
        logoutUrls: [httpDomain],
      },
      preventUserExistenceErrors: true,
      accessTokenValidity: cdk.Duration.hours(1),
      idTokenValidity: cdk.Duration.hours(1),
    });

    const api = new apigwv2.HttpApi(this, "HttpApi", {
      corsPreflight: {
        allowOrigins: [
          "*",
          // `https://${distribution.distributionDomainName}`,
          // "http://localhost:5173",
          // "http://localhost:3000",
        ],
        allowMethods: [apigwv2.CorsHttpMethod.ANY],
        allowHeaders: ["*"],
        // allowCredentials: true,
        exposeHeaders: ["*"],
      },
    });

    const authorizer = new apigwv2_authorizers.HttpJwtAuthorizer(
      "CognitoAuthorizer",
      `https://cognito-idp.${cdk.Stack.of(this).region}.amazonaws.com/${userPool.userPoolId}`,
      {
        jwtAudience: [userPoolClient.userPoolClientId],
        identitySource: ["$request.header.Authorization"],
      }
    );

    api.addRoutes({
      path: "/public/{proxy+}",
      methods: [apigwv2.HttpMethod.ANY],
      integration: new integ.HttpLambdaIntegration("ApiIntegration", apiFn),
    });

    api.addRoutes({
      path: "/{proxy+}",
      methods: [apigwv2.HttpMethod.ANY],
      integration: new integ.HttpLambdaIntegration(
        "ApiIntegrationSecure",
        apiFn
      ),
      authorizer,
    });

    new cdk.CfnOutput(this, "GardenApiFnName", { value: apiFn.functionName });
    new cdk.CfnOutput(this, "MigrateFnName", { value: migrateFn.functionName });
    new cdk.CfnOutput(this, "SiteDistributionId", {
      value: distribution.distributionId,
    });
    new cdk.CfnOutput(this, "SiteBucketName", { value: siteBucket.bucketName });
    new cdk.CfnOutput(this, "CognitoDomain", { value: domain.domainName });
    new cdk.CfnOutput(this, "UserPoolId", { value: userPool.userPoolId });
    new cdk.CfnOutput(this, "UserPoolClientId", {
      value: userPoolClient.userPoolClientId,
    });
    new cdk.CfnOutput(this, "CloudFrontUrl", { value: httpDomain });
    new cdk.CfnOutput(this, "DbEndpoint", {
      value: db.instanceEndpoint.hostname,
    });
    new cdk.CfnOutput(this, "VpcId", { value: vpc.vpcId });
    new cdk.CfnOutput(this, "ApiUrl", { value: api.apiEndpoint });
  }
}
