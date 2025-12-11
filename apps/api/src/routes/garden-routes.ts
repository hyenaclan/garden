import { FastifyInstance } from "fastify";
import {
  gardenContract,
  GetGardenParams,
  GetGardenSuccess,
  PostGardenEventsBody,
  PostGardenEventsError,
  PostGardenEventsSuccess,
} from "@garden/api-contract";
import { appendGardenEvents } from "../services/append-garden-events.js";
import { getDb } from "../db.js";

export async function registerGardenRoutes(app: FastifyInstance) {
  const getGardenContract = gardenContract.getGarden;
  app.route<{
    Params: GetGardenParams;
    Reply: GetGardenSuccess;
  }>({
    schema: getGardenContract.schema,
    method: getGardenContract.method,
    url: getGardenContract.url,
    async handler(request, reply) {
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
  });

  const postGardenEventsContract = gardenContract.postGardenEvents;
  app.route<{
    Params: GetGardenParams;
    Body: PostGardenEventsBody;
    Reply: PostGardenEventsSuccess | PostGardenEventsError;
  }>({
    schema: postGardenEventsContract.schema,
    method: postGardenEventsContract.method,
    url: postGardenEventsContract.url,
    async handler(request, reply) {
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
  });
}
