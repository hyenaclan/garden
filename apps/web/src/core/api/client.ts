export type ApiRequestOptions = RequestInit & {
  path: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export function resolveApiUrl(path: string) {
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

export async function apiRequest<T>(options: ApiRequestOptions): Promise<T> {
  const { path, ...init } = options;
  const response = await fetch(resolveApiUrl(path), {
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = `${response.status} ${response.statusText}`;
    throw new Error(`API request failed: ${message}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}
