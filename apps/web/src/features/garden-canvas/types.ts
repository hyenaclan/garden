import type { Garden, GardenEvent } from "@garden/api-contract";

type GardenStatus = "idle" | "loading" | "saving" | "saved" | "error";

export interface GardenState {
  gardenId: string;
  garden: Garden | null;
  /**
   * Monotonic counter for stamping new local events.
   * Typically starts at `garden.version + 1` and advances as events are queued.
   */
  nextEventVersion: number;
  /**
   * Optimistic view of the garden objects (server snapshot + pending events).
   * This is what the UI should render.
   */
  optimisticGardenObjects: Garden["gardenObjects"];
  pendingEventsByObjectId: Record<string, GardenEvent>;
  status: GardenStatus;
  errorMessage?: string;
}

interface GardenActions {
  loadGarden: () => Promise<void>;
  upsertObject: (
    patch: { id: string } & Partial<
      Omit<Garden["gardenObjects"][number], "id">
    >,
  ) => void;
  deleteObject: (id: string) => void;
  flushEvents: () => Promise<void>;
}

export type GardenStore = GardenState & GardenActions;
