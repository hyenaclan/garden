type GardenStatus = "idle" | "loading" | "saving" | "saved" | "error";
type GardenEventType = "update" | "create" | "delete";
type GardenUnit = "ft" | "m";

export interface GardenObject {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  type: string;
  plantable: boolean;
}

export type GardenEvent = {
  version: number;
  eventType: GardenEventType;
  payload?: Partial<GardenObject>;
};

export interface Garden {
  id: string;
  name: string;
  unit: GardenUnit;
  gardenObjects: GardenObject[];
  version: number;
}

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
  //   flushEvents: () => Promise<void>;
}

export type GardenStore = GardenState & GardenActions;
