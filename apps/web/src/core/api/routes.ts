export const API_ROUTES = {
  garden: (gardenId: string) => `/gardens/${gardenId}`,
  gardenEvents: (gardenId: string) => `/gardens/${gardenId}/events`,
} as const;
