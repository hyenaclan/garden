import { createContext, useContext, useState, type ReactNode } from "react";
import { createStore, type StoreApi, useStore } from "zustand";
import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthRequest, type AuthRequest } from "../../core/api/auth";
import { GardenState, GardenStore } from "./types";
import {
  applyGardenEvents,
  renumberGardenEvents,
  getTransitionStatus,
  isInvalidState,
} from "./store-utilities";
import { v4 as uuidv4 } from "uuid";

import {
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
});

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

  return createStore<GardenStore>((set) => ({
    ...initialState(gardenId),
    setStatusForDev: (status) =>
      set((state) => ({
        ...state,
        status,
      })),
    loadGarden: async () => {
      const loadingStatus = "loading";
      set((state) => ({
        ...state,
        status: getTransitionStatus(state.status, loadingStatus),
      }));
      const errorStatus = getTransitionStatus(loadingStatus, "error");
      const idleStatus = getTransitionStatus(loadingStatus, "idle");

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
          status: idleStatus,
          nextEventVersion: garden.version + 1,
          optimisticGardenObjects: garden.gardenObjects,
          pendingEventsByObjectId: {},
        });
      } catch (error) {
        set((state) => ({
          ...state,
          status: getTransitionStatus(state.status, errorStatus),
        }));
      }
    },
    upsertObject: (patch) => {
      set((state) => {
        if (state.status === "error") return state;
        const garden = state.garden;
        if (!garden) return state;

        const nextStatus = getTransitionStatus(state.status, "flushable");

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
          status: nextStatus,
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
        if (state.status === "error") return state;
        const garden = state.garden;
        if (!garden) return state;
        const nextStatus = getTransitionStatus(state.status, "flushable");

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
          status: nextStatus,
          pendingEventsByObjectId: pendingEventsMap,
          optimisticGardenObjects: state.optimisticGardenObjects.filter(
            (obj) => obj.id !== id,
          ),
          nextEventVersion: state.nextEventVersion + 1,
        };
      });
    },
    flushEvents: async () => {
      type FlushStart = {
        garden: Garden;
        pendingEvents: GardenEvent[];
        pendingSnapshot: Record<string, GardenEvent>;
        gardenVersionAtFlushStart: number;
      };

      const start: { value: FlushStart | null } = { value: null };

      set((state) => {
        if (state.status === "saving") return state;
        const nextStatus = getTransitionStatus(state.status, "saving");

        const garden = state.garden;
        const pendingEventsByObjectId = state.pendingEventsByObjectId;
        const pendingEvents = Object.values(pendingEventsByObjectId);
        if (!garden || pendingEvents.length === 0) return state;

        start.value = {
          garden,
          pendingEvents,
          pendingSnapshot: { ...pendingEventsByObjectId },
          gardenVersionAtFlushStart: garden.version,
        };

        return { ...state, status: nextStatus };
      });

      const snapshot = start.value;
      if (!snapshot) return;

      try {
        const eventsToFlush = renumberGardenEvents(
          snapshot.pendingEvents,
          snapshot.gardenVersionAtFlushStart,
        );
        const result = await appendGardenEvents({
          new_events: eventsToFlush,
        });

        set((state) => {
          const idleStatus = getTransitionStatus(state.status, "idle", false);
          const flushableStatus = getTransitionStatus(
            state.status,
            "flushable",
            false,
          );

          const garden = state.garden;
          if (!garden) return { ...state, status: idleStatus };

          const committedObjects = applyGardenEvents(
            garden.gardenObjects,
            eventsToFlush,
          );

          const unflushedEventsMap: Record<string, GardenEvent> = {};
          for (const [objectId, currentEvent] of Object.entries(
            state.pendingEventsByObjectId,
          )) {
            const flushedEvent = snapshot.pendingSnapshot[objectId];
            if (!flushedEvent || flushedEvent.id !== currentEvent.id) {
              unflushedEventsMap[objectId] = currentEvent;
            }
          }

          const unflushedEvents = Object.values(unflushedEventsMap);
          const optimisticGardenObjectsNext = applyGardenEvents(
            committedObjects,
            unflushedEvents,
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
            pendingEventsByObjectId: unflushedEventsMap,
            status: unflushedEvents.length > 0 ? flushableStatus : idleStatus,
            errorCode: undefined,
            errorMessage: undefined,
          };
        });
      } catch (error) {
        if (isInvalidState(error)) {
          set((state) => {
            return {
              ...state,
              status: getTransitionStatus(state.status, "flushableError"),
            };
          });
        } else {
          set((state) => {
            return {
              ...state,
              status: getTransitionStatus(state.status, "error"),
            };
          });
        }
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
