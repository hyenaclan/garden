export const logout = async (authHeader: string) => {
  const accessToken = authHeader.substring(7);

  // Call Cognito's GlobalSignOut API
  const { CognitoIdentityProviderClient, GlobalSignOutCommand } = await import(
    "@aws-sdk/client-cognito-identity-provider"
  );

  const client = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION,
  });
  await client.send(new GlobalSignOutCommand({ AccessToken: accessToken }));
};
