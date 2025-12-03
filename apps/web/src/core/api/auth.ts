import { useAuth } from "react-oidc-context";
import { ApiRequestOptions, resolveApiUrl } from "./client";

export type AuthRequest = <T>(options: ApiRequestOptions) => Promise<T>;

type AuthHeaders = Record<string, string>;

async function ensureFreshSession(auth: ReturnType<typeof useAuth>) {
  if (auth.user && auth.user.expired) {
    try {
      await auth.signinSilent();
    } catch (error) {
      console.error("Token refresh failed:", error);
      await auth.signinRedirect();
      throw new Error("Session expired. Please log in again.");
    }
  }
}

function withAuthHeaders(token: string | undefined, headers?: HeadersInit) {
  const existing =
    headers instanceof Headers
      ? Object.fromEntries(headers)
      : { ...(headers as Record<string, string>) };
  const authHeaders: AuthHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};
  return { ...existing, ...authHeaders };
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;
    throw new Error(`API request failed: ${message}`);
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return (await response.json()) as T;
}

export function useAuthRequest(): AuthRequest {
  const auth = useAuth();

  return async function authRequest<T>(options: ApiRequestOptions): Promise<T> {
    await ensureFreshSession(auth);

    const token = auth.user?.id_token;
    const headers = withAuthHeaders(token, options.headers);
    const url = resolveApiUrl(options.path);
    const { path: _ignored, ...init } = options;

    let response = await fetch(url, {
      ...init,
      headers,
    });

    if (response.status === 401) {
      try {
        await auth.signinSilent();
        const refreshedToken = auth.user?.id_token;
        const retryHeaders = withAuthHeaders(refreshedToken, options.headers);
        response = await fetch(url, { ...init, headers: retryHeaders });
      } catch (error) {
        console.error("Token refresh failed on 401:", error);
        await auth.signinRedirect();
        throw new Error("Session expired. Please log in again.");
      }
    }

    return parseResponse<T>(response);
  };
}
