import { createContext, useContext, useState, type ReactNode } from "react";
import { createStore, type StoreApi, useStore } from "zustand";
import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthRequest, type AuthRequest } from "../../core/api/auth";
import { API_ROUTES } from "../../core/api/routes";
import {
  AppendGardenEventsRequest,
  AppendGardenEventsSuccess,
  GardenEvent,
  GardenObject,
  GardenState,
  GardenStore,
  type Garden,
} from "./types";

const initialState = (gardenId: string): GardenState => ({
  gardenId,
  garden: null,
  currentVersion: 0,
  pendingEvents: [],
  status: "idle",
  errorMessage: undefined,
});

const objectChanged = (prev: GardenObject, next: GardenObject) => {
  return (
    prev.x !== next.x ||
    prev.y !== next.y ||
    prev.width !== next.width ||
    prev.height !== next.height ||
    prev.rotation !== next.rotation ||
    prev.name !== next.name
  );
};

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
          currentVersion: garden.version,
          pendingEvents: [],
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
    replaceGarden: (nextGarden) => {
      set((state) => {
        if (!state.garden) {
          return {
            ...state,
            garden: nextGarden,
            currentVersion: nextGarden.version,
            status: "idle",
            errorMessage: undefined,
          };
        }

        const events: GardenEvent[] = [];
        const previousObjects = new Map(
          state.garden.gardenObjects.map((obj) => [obj.id, obj]),
        );

        nextGarden.gardenObjects.forEach((obj) => {
          const prev = previousObjects.get(obj.id);
          if (!prev) {
            events.push({
              version: state.currentVersion,
              eventType: "create",
              payload: obj,
            });
            return;
          }

          if (objectChanged(prev, obj)) {
            events.push({
              version: state.currentVersion,
              eventType: "update",
              payload: {
                id: obj.id,
                x: obj.x,
                y: obj.y,
                width: obj.width,
                height: obj.height,
                rotation: obj.rotation,
                name: obj.name,
              },
            });
          }

          previousObjects.delete(obj.id);
        });

        previousObjects.forEach((prevObj) => {
          events.push({
            version: state.currentVersion,
            eventType: "delete",
            payload: { id: prevObj.id },
          });
        });

        if (events.length === 0) {
          return {
            ...state,
            garden: nextGarden,
            currentVersion: nextGarden.version,
            status: "idle",
            errorMessage: undefined,
          };
        }

        return {
          ...state,
          garden: nextGarden,
          currentVersion: nextGarden.version,
          pendingEvents: [...state.pendingEvents, ...events],
          status: "idle",
          errorMessage: undefined,
        };
      });
    },
    flushEvents: async () => {
      const { pendingEvents, garden } = get();
      if (!garden || pendingEvents.length === 0) {
        return;
      }

      set({ status: "saving", errorMessage: undefined });

      try {
        const result = await appendGardenEvents({
          new_events: pendingEvents,
        });
        set((state) => ({
          ...state,
          garden: state.garden
            ? { ...state.garden, version: result.next_version }
            : state.garden,
          currentVersion: result.next_version,
          pendingEvents: [],
          status: "saved",
          errorMessage: undefined,
        }));
      } catch (error) {
        set({
          status: "error",
          errorMessage:
            error instanceof Error ? error.message : "Failed to save events",
        });
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
