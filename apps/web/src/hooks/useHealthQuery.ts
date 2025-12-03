import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "../core/api/client";
import { API_ROUTES } from "../core/api/routes";

export function useHealthQuery(enabled = false) {
  return useQuery({
    queryKey: ["healthStatus"],
    queryFn: () =>
      apiRequest<HealthResponse>({
        path: API_ROUTES.health,
        method: "GET",
      }),
    enabled,
  });
}

interface HealthResponse {
  message: string;
  timestamp: number;
  status: "ok" | "error";
  user_count: number;
}
