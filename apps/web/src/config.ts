export const APP_NAME = "growcult";

export const ROUTES = {
  HOME: "/",
  CULTS: "/cults",
  PROFILE: "/profile",
  LOGIN: "/login",
  AUTH_CALLBACK: "/auth/callback",
} as const;

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: "Home",
  [ROUTES.CULTS]: "Cults",
  [ROUTES.PROFILE]: "Profile",
  [ROUTES.LOGIN]: "Login",
  [ROUTES.AUTH_CALLBACK]: "Signing in",
};
