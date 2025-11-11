// Use environment variables or detect dev mode
const isDev = true; // import.meta.env.MODE === "development";
const baseUrl = isDev
  ? "http://localhost:5173"
  : "https://d2oi41qf2bcxlf.cloudfront.net";

export const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_tCspFEqcX",
  client_id: "6t618tua7043i194i71u8703oh",
  redirect_uri: `${baseUrl}/auth/callback`,
  response_type: "code",
  scope: "email openid",
};

export const signOutRedirect = () => {
  const clientId = "6t618tua7043i194i71u8703oh";
  const logoutUri = baseUrl;
  const cognitoDomain = "https://garden-dev.auth.us-east-1.amazoncognito.com";
  window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
};
