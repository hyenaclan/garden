import { FastifyInstance } from "fastify";
import { getDb } from "../../db";
import {
  PostGardenEventsParams,
  PostGardenEventsBody,
  PostGardenEventsSuccess,
  PostGardenEventsError,
  postGardenEventsSchema,
  GetGardenParams,
  GetGardenSuccess,
  getGardenSchema,
} from "./types";
import { appendGardenEvents } from "../../services/append-garden-events";

export async function registerGardenRoutes(app: FastifyInstance) {
  app.get<{
    Params: GetGardenParams;
    Reply: GetGardenSuccess;
  }>(
    "/gardens/:gardenId",
    { schema: getGardenSchema },
    async (request, reply) => {
      const { gardenId } = request.params;

      // Placeholder implementation until real persistence exists.
      const garden = {
        id: gardenId,
        name: "Demo Garden",
        unit: "ft" as const,
        growAreas: [
          {
            id: "bed-1",
            type: "growArea" as const,
            name: "Bed 1",
            x: 0,
            y: 0,
            width: 48,
            height: 96,
            rotation: 0,
            growAreaKind: "raisedBed",
            plantable: true,
          },
        ],
      };

      return reply.send({ garden, version: 1 });
    },
  );

  app.post<{
    Params: PostGardenEventsParams;
    Body: PostGardenEventsBody;
    Reply: PostGardenEventsSuccess | PostGardenEventsError;
  }>(
    "/gardens/:gardenId/events",
    { schema: postGardenEventsSchema },
    async (request, reply) => {
      const { gardenId } = request.params;
      const { new_events: newEvents } = request.body;

      const db = getDb();
      const result = await appendGardenEvents(db, gardenId, newEvents);

      if (!result.success) {
        return reply.status(400).send({
          code: result.code,
          untracked_events: result.untrackedEvents,
          retry_hint: result.retry_hint,
        });
      }

      return { next_version: result.next_version };
    },
  );
}
