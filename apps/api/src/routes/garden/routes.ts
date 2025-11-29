import { FastifyInstance } from "fastify";
import { getDb } from "../../db";
import {
  PostGardenEventsParams,
  PostGardenEventsBody,
  PostGardenEventsSuccess,
  PostGardenEventsError,
  postGardenEventsSchema,
} from "./types";
import { appendGardenEvents } from "../../services/append-garden-events";

export async function registerGardenRoutes(app: FastifyInstance) {
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
