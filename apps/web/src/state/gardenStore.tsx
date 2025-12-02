import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import { createStore, type StoreApi, useStore } from "zustand";
import type { QueryClient } from "@tanstack/react-query";
import {
  appendGardenEvents,
  fetchGardenSnapshot,
  type AppendGardenEventsError,
  type Garden,
  type GardenEvent,
  type GardenObject,
} from "../api/gardenApi";
import { queryClient as defaultQueryClient } from "../queryClient";

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

const initialState = (gardenId: string): GardenState => ({
  gardenId,
  garden: null,
  currentVersion: 0,
  pendingEvents: [],
  status: "idle",
  errorMessage: undefined,
});

const isAppendError = (error: unknown): error is AppendGardenEventsError =>
  Boolean(
    error &&
      typeof error === "object" &&
      "code" in error &&
      "retry_hint" in error,
  );

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
  options: { queryClient: QueryClient; fetcher: typeof fetch },
) {
  const client = options.queryClient;
  const fetcher = options.fetcher;

  return createStore<GardenStore>((set, get) => ({
    ...initialState(gardenId),
    loadGarden: async () => {
      set({ status: "loading", errorMessage: undefined });

      try {
        const { garden, version } = await client.fetchQuery({
          queryKey: ["garden", gardenId, "snapshot"],
          queryFn: () => fetchGardenSnapshot(gardenId, fetcher),
        });

        set({
          garden,
          currentVersion: version,
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
          return state;
        }

        const events: GardenEvent[] = [];

        // Detect new grow areas
        nextGarden.growAreas.forEach((obj) => {
          const prev = state.garden?.growAreas.find((o) => o.id === obj.id);
          if (!prev) {
            events.push({
              version: state.currentVersion,
              eventType: "create",
              objectId: obj.id,
              payload: obj,
            });
            return;
          }

          if (objectChanged(prev, obj)) {
            events.push({
              version: state.currentVersion,
              eventType: "update",
              objectId: obj.id,
              payload: {
                x: obj.x,
                y: obj.y,
                width: obj.width,
                height: obj.height,
                rotation: obj.rotation,
                name: obj.name,
              },
            });
          }
        });

        // Detect deletions
        state.garden.growAreas.forEach((prevObj) => {
          const exists = nextGarden.growAreas.find((o) => o.id === prevObj.id);
          if (!exists) {
            events.push({
              version: state.currentVersion,
              eventType: "delete",
              objectId: prevObj.id,
            });
          }
        });

        if (events.length === 0) {
          return { ...state, garden: nextGarden, status: "idle" };
        }

        return {
          ...state,
          garden: nextGarden,
          pendingEvents: [...state.pendingEvents, ...events],
          status: "idle",
          errorMessage: undefined,
        };
      });
    },
    flushEvents: async () => {
      const pending = get().pendingEvents;
      if (pending.length === 0) {
        return;
      }

      set({ status: "saving", errorMessage: undefined });

      try {
        const result = await appendGardenEvents(
          gardenId,
          {
            new_events: pending,
          },
          fetcher,
        );

        set({
          currentVersion: result.next_version,
          pendingEvents: [],
          status: "saved",
          errorMessage: undefined,
        });
      } catch (error) {
        if (isAppendError(error)) {
          set({ status: "error", errorMessage: error.retry_hint });
          return;
        }

        set({ status: "error", errorMessage: "Network error" });
      }
    },
  }));
}

const GardenStoreContext =
  createContext<StoreApi<GardenStore> | null>(null);

export function GardenProvider({
  gardenId,
  children,
  queryClient,
  fetcher,
}: {
  gardenId: string;
  children: ReactNode;
  queryClient: QueryClient;
  fetcher: typeof fetch;
}) {
  const [store] = useState<StoreApi<GardenStore>>(() =>
    createGardenStore(gardenId, { queryClient, fetcher }),
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
