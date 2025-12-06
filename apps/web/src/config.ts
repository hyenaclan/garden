export const APP_NAME = "growcult";

export const ROUTES = {
  HOME: "/",
  CULTS: "/cults",
  PROFILE: "/profile",
  LOGIN: "/login",
} as const;

export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: "Home",
  [ROUTES.CULTS]: "Cults",
  [ROUTES.PROFILE]: "Profile",
  [ROUTES.LOGIN]: "Login",
};
