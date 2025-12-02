import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { GardenEvent } from "../routes/garden/types";

export type AppendGardenEventsResult =
  | { success: true; next_version: number }
  | {
      success: false;
      code: "untrackedEvents" | "insertFailed";
      untrackedEvents: number[];
      retry_hint: string;
    };

export async function appendGardenEvents(
  db: NodePgDatabase<Record<string, unknown>>,
  gardenId: string,
  newEvents: GardenEvent[],
): Promise<AppendGardenEventsResult> {
  return {
    success: false,
    code: "insertFailed",
    untrackedEvents: [],
    retry_hint: "Not implemented",
  };
}
