import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as api from "../api/gardenApi";
import { GardenDemoPage } from "./GardenDemoPage";
import { GardenProvider } from "../state/gardenStore";

vi.mock("../api/gardenApi");
vi.mock("./GardenCanvas", () => ({
  GardenCanvas: ({ garden }: { garden: { name: string } }) => (
    <div>Canvas for {garden.name}</div>
  ),
}));

const mockFetchSnapshot = api.fetchGardenSnapshot as unknown as vi.Mock;
const mockAppend = api.appendGardenEvents as unknown as vi.Mock;
let randomUUIDSpy: ReturnType<typeof vi.spyOn>;

const initialGarden: api.Garden = {
  id: "g-1",
  name: "My Garden",
  unit: "ft",
  growAreas: [
    {
      id: "bed-1",
      type: "growArea",
      name: "Bed 1",
      x: 0,
      y: 0,
      width: 4,
      height: 8,
      rotation: 0,
      growAreaKind: "raisedBed",
      plantable: true,
    },
  ],
};

const renderWithProviders = (ui: ReactElement, client: QueryClient) => {
  return render(
    <QueryClientProvider client={client}>
      <GardenProvider gardenId="g-1" queryClient={client} fetcher={fetch}>
        {ui}
      </GardenProvider>
    </QueryClientProvider>,
  );
};

beforeEach(() => {
  if (!("crypto" in globalThis)) {
    (globalThis as any).crypto = { randomUUID: vi.fn() };
  }
  randomUUIDSpy = vi
    .spyOn(globalThis.crypto, "randomUUID")
    .mockReturnValue("new-bed");
});

afterEach(() => {
  randomUUIDSpy?.mockRestore();
  cleanup();
  vi.resetAllMocks();
});

describe("GardenDemoPage", () => {
  it("saves events successfully", async () => {
    mockFetchSnapshot.mockResolvedValue({
      garden: initialGarden,
      version: 10,
    });
    mockAppend.mockResolvedValue({ next_version: 11 });

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    renderWithProviders(<GardenDemoPage />, client);

    await screen.findByText("Bed 1");

    const user = userEvent.setup();
    await user.click(screen.getByText("Add Raised Bed"));
    await user.click(screen.getByText("Save layout"));

    await waitFor(() => {
      expect(mockAppend).toHaveBeenCalledTimes(1);
      expect(mockAppend).toHaveBeenCalledWith(
        "g-1",
        {
          new_events: expect.arrayContaining([expect.any(Object)]),
        },
        expect.any(Function),
      );
      expect(
        screen.getByLabelText("sync-status"),
      ).toHaveTextContent("All changes saved");
    });
  });

  it("surfaces insertFailed and then succeeds on retry", async () => {
    mockFetchSnapshot.mockResolvedValue({
      garden: initialGarden,
      version: 1,
    });
    mockAppend
      .mockRejectedValueOnce({
        code: "insertFailed",
        untracked_events: [],
        retry_hint: "try again later",
      })
      .mockResolvedValueOnce({ next_version: 2 });

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    renderWithProviders(<GardenDemoPage />, client);

    await screen.findByText("Bed 1");

    const user = userEvent.setup();
    await user.click(screen.getByText("Add Raised Bed"));
    await user.click(screen.getByText("Save layout"));

    await waitFor(() => {
      expect(screen.getByLabelText("sync-status")).toHaveTextContent(
        "Error: try again later",
      );
      expect(mockAppend).toHaveBeenCalledTimes(1);
    });

    await user.click(screen.getByText("Save layout"));

    await waitFor(() => {
      expect(mockAppend).toHaveBeenCalledTimes(2);
      expect(screen.getByLabelText("sync-status")).toHaveTextContent(
        "All changes saved",
      );
    });
  });

  it("handles untrackedEvents conflicts", async () => {
    mockFetchSnapshot.mockResolvedValue({
      garden: initialGarden,
      version: 3,
    });
    mockAppend.mockRejectedValue({
      code: "untrackedEvents",
      untracked_events: [0],
      retry_hint: "refetch snapshot",
    });

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    renderWithProviders(<GardenDemoPage />, client);

    await screen.findByText("Bed 1");

    const user = userEvent.setup();
    await user.click(screen.getByText("Add Raised Bed"));
    await user.click(screen.getByText("Save layout"));

    await waitFor(() => {
      expect(mockAppend).toHaveBeenCalledTimes(1);
      expect(screen.getByLabelText("sync-status")).toHaveTextContent(
        "Error: refetch snapshot",
      );
    });
  });

  it("handles generic network errors", async () => {
    mockFetchSnapshot.mockResolvedValue({
      garden: initialGarden,
      version: 5,
    });
    mockAppend.mockRejectedValue(new Error("boom"));

    const client = new QueryClient({
      defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    renderWithProviders(<GardenDemoPage />, client);

    await screen.findByText("Bed 1");

    const user = userEvent.setup();
    await user.click(screen.getByText("Add Raised Bed"));
    await user.click(screen.getByText("Save layout"));

    await waitFor(() => {
      expect(screen.getByLabelText("sync-status")).toHaveTextContent(
        "Error: Network error",
      );
    });
  });
});
