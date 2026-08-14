const BASE_URL = "/api";
const TOKEN_KEY = "moderation_token";

function storage(): Storage | null {
  return typeof localStorage !== "undefined" ? localStorage : null;
}

export function getToken(): string | null {
  return storage()?.getItem(TOKEN_KEY) ?? null;
}

export function setToken(token: string | null): void {
  const s = storage();
  if (!s) return;
  if (token) s.setItem(TOKEN_KEY, token);
  else s.removeItem(TOKEN_KEY);
}

export async function request<T>(
  path: string,
  options: {
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: unknown;
    auth?: boolean;
  } = {},
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers["x-session-token"] = token;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const message =
      detail?.message ??
      detail?.error ??
      `Request failed with status ${response.status}`;
    throw new Error(Array.isArray(message) ? message.join(", ") : message);
  }

  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}
