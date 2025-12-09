import { FastifyInstance } from "fastify";
import { getDb } from "../../db";
import {
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

      // TODO: Placeholder implementation until real persistence exists.
      const garden = {
        id: gardenId,
        name: "My Garden",
        unit: "ft" as const,
        gardenObjects: [
          {
            id: "bed-1",
            type: "growArea",
            name: "Bed 1",
            x: 0,
            y: 0,
            width: 48,
            height: 96,
            rotation: 0,
            plantable: true,
          },
        ],
        version: 1,
      };

      return reply.send({ garden });
    },
  );

  app.post<{
    Params: GetGardenParams;
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
