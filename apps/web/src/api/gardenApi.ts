export interface GardenObjectBase {
  id: string;
  type: "growArea";
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

export interface GrowArea extends GardenObjectBase {
  type: "growArea";
  growAreaKind: "raisedBed" | "inGround" | "growBag" | "pot";
  plantable: true;
}

export type GardenObject = GrowArea;

export interface Garden {
  id: string;
  name: string;
  unit: "ft" | "m";
  growAreas: GardenObject[];
}

export type GardenEvent = {
  version: number;
  eventType: "update" | "create" | "delete";
  objectId: string;
  payload?: Partial<GrowArea>;
};

export interface AppendGardenEventsRequest {
  new_events: GardenEvent[];
}

export interface AppendGardenEventsSuccess {
  next_version: number;
}

export interface AppendGardenEventsError {
  code: "invalidEvents" | "untrackedEvents" | "insertFailed";
  untracked_events: number[];
  retry_hint: string;
}

const apiBase = import.meta.env.VITE_API_BASE_URL as string;

const url = (path: string) =>
  `${apiBase}${path.startsWith("/") ? path : `/${path}`}`;

export async function fetchGardenSnapshot(
  gardenId: string,
  fetcher: typeof fetch = fetch,
): Promise<{ garden: Garden; version: number }> {
  const response = await fetcher(url(`/gardens/${gardenId}`));

  if (!response.ok) {
    throw new Error("Failed to load garden snapshot");
  }

  return response.json();
}

export async function appendGardenEvents(
  gardenId: string,
  body: AppendGardenEventsRequest,
  fetcher: typeof fetch = fetch,
): Promise<AppendGardenEventsSuccess> {
  const response = await fetcher(url(`/gardens/${gardenId}/events`), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (response.status === 201) {
    return response.json();
  }

  if (response.status === 400) {
    const errorBody = await response.json();
    const error: AppendGardenEventsError = {
      code: errorBody.code,
      untracked_events: errorBody.untracked_events ?? [],
      retry_hint: errorBody.retry_hint ?? "Unable to save events",
    };

    throw error;
  }

  throw new Error("Failed to append events");
}
