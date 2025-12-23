import { GardenEvent } from "@garden/api-contract";
import { NodePgDatabase } from "drizzle-orm/node-postgres";

export type AppendGardenEventsResult =
  | { success: true; next_version: number }
  | {
      success: false;
      code: "invalidRequest" | "invalidState" | "unknownError";
    };

export async function appendGardenEvents(
  db: NodePgDatabase<Record<string, unknown>>,
  gardenId: string,
  newEvents: GardenEvent[],
): Promise<AppendGardenEventsResult> {
  if (newEvents.length === 0) {
    return { success: false, code: "invalidRequest" };
  }
  const sorted = newEvents.sort((a, b) => a.version - b.version);
  return {
    success: true,
    next_version: sorted[sorted.length - 1].version + 1,
  };
}
