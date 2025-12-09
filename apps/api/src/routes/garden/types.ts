import { Type, Static } from "@sinclair/typebox";
import type { FastifySchema } from "fastify";

export const GardenObjectSchema = Type.Strict(
  Type.Object({
    id: Type.String(),
    name: Type.String(),
    x: Type.Number(),
    y: Type.Number(),
    width: Type.Number(),
    height: Type.Number(),
    rotation: Type.Number(),
    type: Type.String(),
    plantable: Type.Boolean(),
  }),
);
export type GardenObject = Static<typeof GardenObjectSchema>;

export const GardenEventSchema = Type.Strict(
  Type.Object({
    version: Type.Integer(),
    eventType: Type.Union([
      Type.Literal("create"),
      Type.Literal("update"),
      Type.Literal("delete"),
    ]),
    payload: Type.Optional(Type.Partial(GardenObjectSchema)),
  }),
);
export type GardenEvent = Static<typeof GardenEventSchema>;

export const PostGardenEventsBodySchema = Type.Strict(
  Type.Object({
    new_events: Type.Array(GardenEventSchema),
  }),
);
export type PostGardenEventsBody = Static<typeof PostGardenEventsBodySchema>;

export const PostGardenEventsSuccessSchema = Type.Strict(
  Type.Object({
    next_version: Type.Integer(),
  }),
);
export type PostGardenEventsSuccess = Static<
  typeof PostGardenEventsSuccessSchema
>;

export const PostGardenEventsErrorSchema = Type.Strict(
  Type.Object({
    code: Type.Union([
      Type.Literal("invalidEvents"),
      Type.Literal("untrackedEvents"),
      Type.Literal("insertFailed"),
    ]),
    untracked_events: Type.Array(Type.Integer()),
    retry_hint: Type.String(),
  }),
);
export type PostGardenEventsError = Static<typeof PostGardenEventsErrorSchema>;

export const GetGardenParamsSchema = Type.Strict(
  Type.Object({
    gardenId: Type.String(),
  }),
);
export type GetGardenParams = Static<typeof GetGardenParamsSchema>;

const GardenSchema = Type.Strict(
  Type.Object({
    id: Type.String(),
    name: Type.String(),
    unit: Type.Union([Type.Literal("ft"), Type.Literal("m")]),
    gardenObjects: Type.Array(GardenObjectSchema),
    version: Type.Integer(),
  }),
);

export const GetGardenSuccessSchema = Type.Strict(
  Type.Object({
    garden: GardenSchema,
  }),
);
export type GetGardenSuccess = Static<typeof GetGardenSuccessSchema>;

export const getGardenSchema: FastifySchema = {
  tags: ["gardens"],
  summary: "Fetch garden snapshot",
  params: GetGardenParamsSchema,
  response: {
    200: GetGardenSuccessSchema,
  },
};

export const postGardenEventsSchema: FastifySchema = {
  tags: ["gardens"],
  summary: "Append garden events and update snapshot",
  params: GetGardenParamsSchema,
  body: PostGardenEventsBodySchema,
  response: {
    201: PostGardenEventsSuccessSchema,
    400: PostGardenEventsErrorSchema,
  },
};
