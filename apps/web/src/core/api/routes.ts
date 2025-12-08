export const API_ROUTES = {
  userProfile: "/api/user/profile",
  garden: (gardenId: string) => `/gardens/${gardenId}`,
  gardenEvents: (gardenId: string) => `/gardens/${gardenId}/events`,
} as const;
