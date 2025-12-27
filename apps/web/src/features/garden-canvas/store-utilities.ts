import {
  AppendGardenEventsError,
  GardenEvent,
  GardenObject,
} from "@garden/api-contract";
import { GardenStatus } from "./types";

export function renumberGardenEvents(
  events: GardenEvent[],
  version: number,
): GardenEvent[] {
  const sortedEvents = [...events].sort((a, b) => a.version - b.version);
  return sortedEvents.map((event, index) => ({
    ...event,
    version: version + 1 + index,
  }));
}

export function applyGardenEvents(
  baseObjects: GardenObject[],
  events: GardenEvent[],
): GardenObject[] {
  const objectsById = new Map(baseObjects.map((obj) => [obj.id, obj]));
  const sortedEvents = [...events].sort((a, b) => a.version - b.version);

  for (const event of sortedEvents) {
    const payload = event.payload;
    const objectId = payload?.id;

    if (!objectId) continue;

    if (event.eventType === "delete") {
      objectsById.delete(objectId);
      continue;
    } else if (event.eventType === "upsert") {
      const existing = objectsById.get(objectId) ?? {};
      objectsById.set(objectId, { ...existing, ...payload } as GardenObject);
      continue;
    }

    throw new Error(`Unknown event type: ${event.eventType}`);
  }

  return Array.from(objectsById.values());
}

export function isInvalidState(
  error: unknown,
): error is AppendGardenEventsError {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string" &&
    error.code === "invalidState"
  );
}

export function getTransitionStatus(
  from: GardenStatus,
  to: GardenStatus,
  enable_no_op = true,
): GardenStatus {
  const NO_OP: Record<GardenStatus, ReadonlySet<GardenStatus>> = {
    idle: new Set([]),
    loading: new Set([]),
    flushable: new Set([]),
    saving: new Set(["flushable"]),
    flushableError: new Set(["flushable"]),
    error: new Set(["flushable"]),
  };

  if (enable_no_op) {
    if (NO_OP[from].has(to)) {
      return from;
    }
  }

  const ALLOWED: Record<GardenStatus, ReadonlySet<GardenStatus>> = {
    idle: new Set(["loading", "flushable"]),
    loading: new Set(["loading", "idle", "error"]),
    flushable: new Set(["saving", "flushable"]),
    saving: new Set(["flushable", "idle", "flushableError", "error"]),
    flushableError: new Set(["saving"]),
    error: new Set(),
  };

  if (!ALLOWED[from].has(to)) {
    throw new Error(`Illegal status transition: ${from} -> ${to}`);
  }

  return to;
}
