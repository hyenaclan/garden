export const APP_NAME = "growcult";

export const ROUTES = {
  HOME: "/",
  CULTS: "/cults",
  PROFILE: "/profile",
  AUTH_CALLBACK: "/auth/callback",
  GARDEN_CANVAS: "/garden",
} as const;

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: "Home",
  [ROUTES.CULTS]: "Cults",
  [ROUTES.PROFILE]: "Profile",
  [ROUTES.AUTH_CALLBACK]: "Signing in",
  [ROUTES.GARDEN_CANVAS]: "Garden Canvas",
};
