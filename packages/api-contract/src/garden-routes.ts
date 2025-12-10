import { API_ROUTES } from "./routes";
import {
  GetGardenParams,
  GetGardenSuccess,
  PostGardenEventsBody,
  PostGardenEventsError,
  PostGardenEventsSuccess,
  getGardenSchema,
  postGardenEventsSchema,
} from "./garden";

type RouteContract<Params, Body, Reply> = {
  method: "GET" | "POST";
  url: string;
  schema: unknown;
  types: {
    params: Params;
    body: Body;
    reply: Reply;
  };
};

export const gardenContract = {
  getGarden: {
    method: "GET",
    url: API_ROUTES.garden(":gardenId"),
    schema: getGardenSchema,
    types: {
      params: {} as GetGardenParams,
      body: undefined as unknown as void,
      reply: {} as GetGardenSuccess,
    },
  } satisfies RouteContract<GetGardenParams, void, GetGardenSuccess>,
  postGardenEvents: {
    method: "POST",
    url: API_ROUTES.gardenEvents(":gardenId"),
    schema: postGardenEventsSchema,
    types: {
      params: {} as GetGardenParams,
      body: {} as PostGardenEventsBody,
      reply: {} as PostGardenEventsSuccess | PostGardenEventsError,
    },
  } satisfies RouteContract<
    GetGardenParams,
    PostGardenEventsBody,
    PostGardenEventsSuccess | PostGardenEventsError
  >,
} as const;