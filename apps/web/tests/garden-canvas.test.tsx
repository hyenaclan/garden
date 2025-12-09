import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createGardenStore } from "../src/features/garden-canvas/store";
import {
  type AppendGardenEventsError,
  type Garden,
  type GardenEvent,
  type GardenObject,
} from "../src/features/garden-canvas/types";

const baseObject: GardenObject = {
  id: "obj-1",
  name: "Planter A",
  x: 0,
  y: 0,
  width: 4,
  height: 2,
  rotation: 0,
  type: "planter",
  plantable: true,
};

const secondObject: GardenObject = {
  id: "obj-2",
  name: "Planter B",
  x: 6,
  y: 2,
  width: 3,
  height: 3,
  rotation: 0,
  type: "planter",
  plantable: true,
};

const buildGarden = (
  objects: GardenObject[],
  version = 1,
  id = "garden-1",
): Garden => ({
  id,
  name: "Demo Garden",
  unit: "ft",
  gardenObjects: objects,
  version,
});

const setupStore = (garden: Garden, pendingEvents: GardenEvent[]) => {
  const queryClient = new QueryClient();
  const authRequest = vi.fn();
  const store = createGardenStore(garden.id, { queryClient, authRequest });

  store.setState((state) => ({
    ...state,
    garden,
    currentVersion: garden.version,
    pendingEvents,
    status: "idle",
    errorMessage: undefined,
  }));

  return { store, authRequest };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("garden canvas store", () => {
  it("surfaces insertFailed and then succeeds on retry", async () => {
    const createdObject: GardenObject = {
      ...secondObject,
      id: "obj-3",
      name: "New Bed",
    };

    const pendingEvents: GardenEvent[] = [
      { version: 1, eventType: "create", payload: createdObject },
    ];

    // ReplaceGarden already merged the created object into state.
    const garden = buildGarden([baseObject, createdObject], 1);
    const { store, authRequest } = setupStore(garden, pendingEvents);

    const insertFailed: AppendGardenEventsError = {
      code: "insertFailed",
      untracked_events: [],
      retry_hint: "Retry save",
    };

    authRequest.mockRejectedValueOnce(insertFailed);
    authRequest.mockResolvedValueOnce({ next_version: 2 });

    await store.getState().flushEvents();

    let state = store.getState();
    expect(state.status).toBe("error");
    expect(state.errorMessage).toBe("Retry save");
    expect(state.pendingEvents).toHaveLength(1);

    await store.getState().flushEvents();
    state = store.getState();

    expect(state.status).toBe("saved");
    expect(state.currentVersion).toBe(2);
    expect(state.pendingEvents).toHaveLength(0);
    const createdCount =
      state.garden?.gardenObjects.filter((obj) => obj.id === createdObject.id)
        .length ?? 0;
    expect(createdCount).toBe(1);
  });

  it("handles untrackedEvents conflicts", async () => {
    const pendingEvents: GardenEvent[] = [
      {
        version: 3,
        eventType: "update",
        payload: { id: baseObject.id, x: 10 },
      },
      {
        version: 4,
        eventType: "delete",
        payload: { id: secondObject.id },
      },
    ];

    const garden = buildGarden([baseObject, secondObject], 3);
    const { store, authRequest } = setupStore(garden, pendingEvents);

    const untrackedError: AppendGardenEventsError = {
      code: "untrackedEvents",
      untracked_events: [0],
      retry_hint: "Please refresh before retrying",
    };

    authRequest.mockRejectedValue(untrackedError);

    await store.getState().flushEvents();
    const state = store.getState();

    expect(authRequest).toHaveBeenCalledTimes(1);
    expect(state.status).toBe("error");
    expect(state.errorMessage).toBe("Please refresh before retrying");
    expect(state.pendingEvents).toEqual([pendingEvents[1]]);
  });

  it("handles generic network errors", async () => {
    const pendingEvents: GardenEvent[] = [
      {
        version: 5,
        eventType: "update",
        payload: { id: baseObject.id, name: "Renamed Bed" },
      },
    ];

    const garden = buildGarden([baseObject], 5);
    const { store, authRequest } = setupStore(garden, pendingEvents);

    authRequest.mockRejectedValue(new Error("Network down"));

    await store.getState().flushEvents();
    const state = store.getState();

    expect(state.status).toBe("error");
    expect(state.errorMessage).toBe("Network down");
    expect(state.pendingEvents).toHaveLength(1);
  });
});
