import { QueryClient } from "@tanstack/react-query";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createGardenStore } from "../src/features/garden-canvas/store";
import { GardenObject, Garden } from "@garden/api-contract";

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

const setupStore = (garden: Garden) => {
  const queryClient = new QueryClient();
  const authRequest = vi.fn();
  const store = createGardenStore(garden.id, { queryClient, authRequest });

  store.setState((state) => ({
    ...state,
    garden,
    nextEventVersion: garden.version + 1,
    optimisticGardenObjects: garden.gardenObjects,
    pendingEventsByObjectId: {},
    status: "idle",
    errorMessage: undefined,
  }));

  return { store, authRequest };
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe("garden canvas store", () => {
  it("merges multiple updates by object id and preserves latest version", () => {
    const garden = buildGarden([baseObject], 1);
    const { store } = setupStore(garden);

    store.getState().upsertObject({ id: baseObject.id, x: 10 });
    store.getState().upsertObject({ id: baseObject.id, y: 20 });

    const state = store.getState();
    const pendingEvent = state.pendingEventsByObjectId[baseObject.id];

    expect(pendingEvent).toBeDefined();
    expect(pendingEvent.eventType).toBe("upsert");
    expect(pendingEvent.version).toBe(3);
    expect(pendingEvent.payload).toMatchObject({
      id: baseObject.id,
      x: 10,
      y: 20,
    });

    const optimisticObject = state.optimisticGardenObjects.find(
      (obj) => obj.id === baseObject.id,
    );
    expect(optimisticObject?.x).toBe(10);
    expect(optimisticObject?.y).toBe(20);
  });

  it("merges subsequent patches into a pending create", () => {
    const garden = buildGarden([baseObject], 1);
    const { store } = setupStore(garden);

    const createdObject: GardenObject = {
      ...secondObject,
      id: "obj-3",
      name: "New Bed",
    };

    store.getState().upsertObject(createdObject);
    store.getState().upsertObject({ id: createdObject.id, x: 40 });

    const state = store.getState();
    const pendingEvent = state.pendingEventsByObjectId[createdObject.id];

    expect(pendingEvent).toBeDefined();
    expect(pendingEvent.eventType).toBe("upsert");
    expect(pendingEvent.version).toBe(3);
    expect(pendingEvent.payload).toMatchObject({
      id: createdObject.id,
      x: 40,
    });

    const optimisticObject = state.optimisticGardenObjects.find(
      (obj) => obj.id === createdObject.id,
    );
    expect(optimisticObject?.x).toBe(40);
  });

  it("sorts by version and renumbers contiguously on flush", async () => {
    const garden = buildGarden([baseObject, secondObject], 5);
    const { store, authRequest } = setupStore(garden);

    store.setState((state) => ({
      ...state,
      pendingEventsByObjectId: {
        [baseObject.id]: {
          id: "00000000-0000-4000-8000-000000000001",
          version: 10,
          eventType: "upsert",
          payload: { id: baseObject.id, x: 99 },
        },
        [secondObject.id]: {
          id: "00000000-0000-4000-8000-000000000002",
          version: 7,
          eventType: "delete",
          payload: { id: secondObject.id },
        },
      },
    }));

    authRequest.mockResolvedValueOnce({ next_version: 8 });

    await store.getState().flushEvents();

    const request = authRequest.mock.calls[0]?.[0] as { body: string };
    const body = JSON.parse(request.body) as {
      new_events: Array<{
        version: number;
        eventType: string;
        payload: Record<string, unknown>;
      }>;
    };

    expect(body.new_events).toHaveLength(2);
    expect(body.new_events[0]).toMatchObject({
      version: 6,
      eventType: "delete",
      payload: { id: secondObject.id },
    });
    expect(body.new_events[1]).toMatchObject({
      version: 7,
      eventType: "upsert",
      payload: { id: baseObject.id, x: 99 },
    });

    const state = store.getState();
    expect(state.status).toBe("idle");
    expect(state.garden?.version).toBe(7);
    expect(state.nextEventVersion).toBe(8);
    expect(Object.keys(state.pendingEventsByObjectId)).toHaveLength(0);

    expect(
      state.garden?.gardenObjects.some((obj) => obj.id === secondObject.id),
    ).toBe(false);
    expect(
      state.garden?.gardenObjects.find((obj) => obj.id === baseObject.id)?.x,
    ).toBe(99);
  });
});
