const isDevOrLocal = process.env.NODE_ENV !== "production";
const baseUrl = window.location.origin;

export const getAuthConfig = () => {
  return isDevOrLocal ? devAuthConfig : prodAuthConfig;
};

const devAuthConfig = {
  authority: "https://garden-dev.auth.us-east-1.amazoncognito.com",
  client_id: "6t618tua7043i194i71u8703oh",
  redirect_uri: `${baseUrl}/auth/callback`,
  post_logout_redirect_uri: baseUrl,
  response_type: "code",
  scope: "email openid",
  metadataUrl:
    "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_tCspFEqcX/.well-known/openid-configuration",
};

// TODO get these values from Rupert - I don't have full access
const prodAuthConfig = {
  authority: "https://garden-prod.auth.us-east-1.amazoncognito.com",
  client_id: "1akvj5b3dj5a209191e5707kb",
  redirect_uri: `${baseUrl}/auth/callback`,
  post_logout_redirect_uri: baseUrl,
  response_type: "code",
  scope: "email openid",
  metadataUrl:
    "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_rKarkUTU6/.well-known/openid-configuration",
};

export const signOutRedirect = () => {
  const config = getAuthConfig();
  const clientId = config.client_id;
  const logoutUri = baseUrl;
  const cognitoDomain = config.authority;
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}&redirect_uri=${encodeURIComponent(logoutUri)}&response_type=code&scope=email+openid`;
};
