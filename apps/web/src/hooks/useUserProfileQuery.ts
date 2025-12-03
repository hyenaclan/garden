import { useQuery } from "@tanstack/react-query";
import { useAuthRequest } from "../core/api/auth";
import { API_ROUTES } from "../core/api/routes";

export function useUserProfileQuery(enabled = false) {
  const authRequest = useAuthRequest();

  return useQuery({
    queryKey: ["userProfile"],
    queryFn: () =>
      authRequest<UserProfile>({
        path: API_ROUTES.userProfile,
        method: "GET",
      }),
    enabled,
  });
}

export interface UserProfile {
  id: string;
  email: string;
  createdAt: string;
  lastLogin: string;
  externalId: string;
  externalProvider: string;
}
