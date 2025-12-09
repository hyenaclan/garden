import { API_ROUTES } from "./routes";
import { getGardenSchema, postGardenEventsSchema } from "./garden";

export const gardenRoutes = {
  getGarden: {
    method: "GET",
    url: API_ROUTES.garden(":gardenId"),
    schema: getGardenSchema,
  },
  postGardenEvents: {
    method: "POST",
    url: API_ROUTES.gardenEvents(":gardenId"),
    schema: postGardenEventsSchema,
  },
} as const;
