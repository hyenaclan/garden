import type { Garden, GardenEvent } from "@garden/api-contract";

type GardenStatus = "idle" | "loading" | "saving" | "saved" | "error";

export interface GardenState {
  gardenId: string;
  garden: Garden | null;
  currentVersion: number;
  pendingEvents: GardenEvent[];
  status: GardenStatus;
  errorMessage?: string;
}

interface GardenActions {
  loadGarden: () => Promise<void>;
  replaceGarden: (nextGarden: Garden) => void;
  flushEvents: () => Promise<void>;
}

export type GardenStore = GardenState & GardenActions;
