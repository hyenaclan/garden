// Use environment variables or detect dev mode
const isDev = true; // import.meta.env.MODE === "development";
const baseUrl = isDev
  ? "http://localhost:5173"
  : "https://d2oi41qf2bcxlf.cloudfront.net";

export const cognitoAuthConfig = {
  authority: "https://garden-dev.auth.us-east-1.amazoncognito.com",
  client_id: "6t618tua7043i194i71u8703oh",
  redirect_uri: `${baseUrl}/auth/callback`,
  post_logout_redirect_uri: baseUrl,
  response_type: "code",
  scope: "email openid",
  metadataUrl:
    "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_tCspFEqcX/.well-known/openid-configuration",
};

export const signOutRedirect = () => {
  const clientId = "6t618tua7043i194i71u8703oh";
  const logoutUri = window.location.origin; //"https://d2oi41qf2bcxlf.cloudfront.net";
  const cognitoDomain = "https://garden-dev.auth.us-east-1.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}&redirect_uri=${encodeURIComponent(logoutUri)}&response_type=code&scope=email+openid`;
};
