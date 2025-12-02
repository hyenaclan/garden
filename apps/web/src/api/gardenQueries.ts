import {
  appendGardenEvents,
  fetchGardenSnapshot,
  type AppendGardenEventsRequest,
} from "./gardenApi";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGardenSnapshotQuery(gardenId: string) {
  return useQuery({
    queryKey: ["garden", gardenId, "snapshot"],
    queryFn: () => fetchGardenSnapshot(gardenId),
  });
}

export function useAppendEventsMutation(gardenId: string) {
  return useMutation({
    mutationKey: ["garden", gardenId, "appendEvents"],
    mutationFn: (body: AppendGardenEventsRequest) =>
      appendGardenEvents(gardenId, body),
  });
}
