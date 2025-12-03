const baseUrl = window.location.origin;

const awsRegion = import.meta.env.VITE_AWS_REGION;
const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
const cognitoUserPoolId = import.meta.env.VITE_COGNITO_USER_POOL_ID;
const cognitoUserPoolClientId = import.meta.env
  .VITE_COGNITO_USER_POOL_CLIENT_ID;

export const cognitoConfig = {
  authority: `https://${cognitoDomain}.auth.${awsRegion}.amazoncognito.com`,
  client_id: cognitoUserPoolClientId,
  redirect_uri: `${baseUrl}/auth/callback`,
  post_logout_redirect_uri: baseUrl,
  response_type: "code",
  scope: "email openid",
  metadataUrl: `https://cognito-idp.${awsRegion}.amazonaws.com/${cognitoUserPoolId}/.well-known/openid-configuration`,
  automaticSilentRenew: true,
  accessTokenExpiringNotificationTimeInSeconds: 60,
};

export const signOutRedirect = () => {
  const clientId = cognitoConfig.client_id;
  const logoutUri = baseUrl;
  const cognitoDomain = cognitoConfig.authority;
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}&redirect_uri=${encodeURIComponent(logoutUri)}&response_type=code&scope=email+openid`;
};
