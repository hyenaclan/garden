import { createContext, useContext, useState, type ReactNode } from "react";
import { createStore, type StoreApi, useStore } from "zustand";
import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthRequest, type AuthRequest } from "../../core/api/auth";
import { GardenState, GardenStore } from "./types";
import { v4 as uuidv4 } from "uuid";

import {
  GardenObject,
  AppendGardenEventsRequest,
  AppendGardenEventsSuccess,
  Garden,
  GardenEvent,
  API_ROUTES,
} from "@garden/api-contract";

const initialState = (gardenId: string): GardenState => ({
  gardenId,
  garden: null,
  nextEventVersion: 1,
  optimisticGardenObjects: [],
  pendingEventsByObjectId: {},
  status: "idle",
  errorMessage: undefined,
});

function renumberGardenEvents(
  events: GardenEvent[],
  version: number,
): GardenEvent[] {
  const sortedEvents = [...events].sort((a, b) => a.version - b.version);
  return sortedEvents.map((event, index) => ({
    ...event,
    version: version + 1 + index,
  }));
}

function applyGardenEvents(
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

export function createGardenStore(
  gardenId: string,
  options: { queryClient: QueryClient; authRequest: AuthRequest },
) {
  const { queryClient, authRequest } = options;

  const appendGardenEvents = async (
    body: AppendGardenEventsRequest,
  ): Promise<AppendGardenEventsSuccess> => {
    return authRequest<AppendGardenEventsSuccess>({
      path: API_ROUTES.gardenEvents(gardenId),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  };

  return createStore<GardenStore>((set, get) => ({
    ...initialState(gardenId),
    loadGarden: async () => {
      set({ status: "loading", errorMessage: undefined });

      try {
        const { garden } = await queryClient.fetchQuery({
          queryKey: ["garden", gardenId],
          queryFn: () =>
            authRequest<{ garden: Garden }>({
              path: API_ROUTES.garden(gardenId),
              method: "GET",
            }),
        });

        set({
          garden,
          nextEventVersion: garden.version + 1,
          optimisticGardenObjects: garden.gardenObjects,
          pendingEventsByObjectId: {},
          status: "idle",
          errorMessage: undefined,
        });
      } catch (error) {
        set({
          status: "error",
          errorMessage: error instanceof Error ? error.message : "Load failed",
        });
      }
    },
    upsertObject: (patch) => {
      set((state) => {
        const garden = state.garden;
        if (!garden) return state;

        const { id } = patch;
        if (!id) return state;

        const gardenObjects = [...state.optimisticGardenObjects];

        const existing = gardenObjects.find((obj) => obj.id === id) ?? {};

        const pendingEvent: GardenEvent = {
          id: uuidv4(),
          version: state.nextEventVersion,
          eventType: "upsert",
          payload: { ...existing, ...patch },
        };

        const updatedObjects = applyGardenEvents(gardenObjects, [pendingEvent]);

        return {
          ...state,
          pendingEventsByObjectId: {
            ...state.pendingEventsByObjectId,
            [id]: pendingEvent,
          },
          optimisticGardenObjects: updatedObjects,
          nextEventVersion: state.nextEventVersion + 1,
        };
      });
    },
    deleteObject: (id) => {
      set((state) => {
        const garden = state.garden;
        if (!garden) return state;

        const exists = state.optimisticGardenObjects.some(
          (obj) => obj.id === id,
        );
        if (!exists) return state;

        const existsOnServer = garden.gardenObjects.some(
          (obj) => obj.id === id,
        );
        const pendingEventsMap = { ...state.pendingEventsByObjectId };

        if (!existsOnServer) {
          delete pendingEventsMap[id];
        } else {
          const event: GardenEvent = {
            id: uuidv4(),
            version: state.nextEventVersion,
            eventType: "delete",
            payload: { id },
          };
          pendingEventsMap[id] = event;
        }

        return {
          ...state,
          pendingEventsByObjectId: pendingEventsMap,
          optimisticGardenObjects: state.optimisticGardenObjects.filter(
            (obj) => obj.id !== id,
          ),
          nextEventVersion: state.nextEventVersion + 1,
        };
      });
    },
    flushEvents: async () => {
      const { status } = get();
      if (status === "saving") return;

      const { garden, pendingEventsByObjectId } = get();
      const pendingEvents = Object.values(pendingEventsByObjectId);
      if (!garden || pendingEvents.length === 0) {
        return;
      }

      set({ status: "saving", errorMessage: undefined });

      const pendingSnapshot = { ...pendingEventsByObjectId };
      const gardenVersionAtFlushStart = garden.version;

      try {
        const eventsToFlush = renumberGardenEvents(
          pendingEvents,
          gardenVersionAtFlushStart,
        );
        const result = await appendGardenEvents({
          new_events: eventsToFlush,
        });

        set((state) => {
          const garden = state.garden;
          if (!garden) return state;

          const committedObjects = applyGardenEvents(
            garden.gardenObjects,
            eventsToFlush,
          );

          const remainingPendingEvents: Record<string, GardenEvent> = {};
          for (const [objectId, currentEvent] of Object.entries(
            state.pendingEventsByObjectId,
          )) {
            const flushedEvent = pendingSnapshot[objectId];
            if (!flushedEvent || flushedEvent.id !== currentEvent.id) {
              remainingPendingEvents[objectId] = currentEvent;
            }
          }

          const optimisticGardenObjectsNext = applyGardenEvents(
            committedObjects,
            Object.values(remainingPendingEvents),
          );

          return {
            garden: {
              ...garden,
              gardenObjects: committedObjects,
              version: result.next_version - 1,
            },
            nextEventVersion: Math.max(
              result.next_version,
              state.nextEventVersion,
            ),
            optimisticGardenObjects: optimisticGardenObjectsNext,
            pendingEventsByObjectId: remainingPendingEvents,
            status: "idle",
            errorMessage: undefined,
          };
        });
      } catch (error) {
        set((state) => ({
          ...state,
          status: "error",
          errorMessage: "Failed to save events",
        }));
      }
    },
  }));
}

const GardenStoreContext = createContext<StoreApi<GardenStore> | null>(null);

export function GardenProvider({
  gardenId,
  children,
}: {
  gardenId: string;
  children: ReactNode;
}) {
  const queryClient = useQueryClient();
  const authRequest = useAuthRequest();

  const [store] = useState<StoreApi<GardenStore>>(() =>
    createGardenStore(gardenId, { queryClient, authRequest }),
  );

  return (
    <GardenStoreContext.Provider value={store}>
      {children}
    </GardenStoreContext.Provider>
  );
}

export function useGardenStore<T>(selector: (state: GardenStore) => T) {
  const store = useContext(GardenStoreContext);
  if (!store) {
    throw new Error("useGardenStore must be used within a GardenProvider");
  }
  return useStore(store, selector);
}
