import "server-only";

type Primitive = string | number | boolean;

export type QueryValue =
  | Primitive
  | null
  | undefined
  | Array<Primitive | null | undefined>;

export type BackendFetchOptions = Omit<RequestInit, "body"> & {
  accessToken?: string;
  body?: BodyInit | Record<string, unknown> | null;
  query?: Record<string, QueryValue>;
};

export class BackendRequestError extends Error {
  statusCode: number;
  error: string;

  constructor(input: { statusCode: number; error: string; message: string }) {
    super(input.message);
    this.name = "BackendRequestError";
    this.statusCode = input.statusCode;
    this.error = input.error;
  }
}

export function getBackendUrl() {
  const url = process.env.BACKEND_URL;
  if (!url) {
    throw new Error("BACKEND_URL is not configured");
  }

  return url.replace(/\/$/, "");
}

function buildQueryString(query?: Record<string, QueryValue>) {
  const searchParams = new URLSearchParams();

  if (!query) {
    return "";
  }

  for (const [key, rawValue] of Object.entries(query)) {
    if (Array.isArray(rawValue)) {
      for (const value of rawValue) {
        if (value !== null && value !== undefined && value !== "") {
          searchParams.append(key, String(value));
        }
      }
      continue;
    }

    if (rawValue !== null && rawValue !== undefined && rawValue !== "") {
      searchParams.set(key, String(rawValue));
    }
  }

  const serialized = searchParams.toString();
  return serialized ? `?${serialized}` : "";
}

function normalizeBody(
  body: BackendFetchOptions["body"],
  headers: Headers,
): BodyInit | undefined {
  if (body === null || body === undefined) {
    return undefined;
  }

  if (
    body instanceof FormData ||
    body instanceof URLSearchParams ||
    body instanceof Blob ||
    typeof body === "string" ||
    body instanceof ArrayBuffer ||
    ArrayBuffer.isView(body)
  ) {
    return body;
  }

  headers.set("Content-Type", "application/json");
  return JSON.stringify(body);
}

export async function backendFetch<T>(
  path: string,
  options: BackendFetchOptions = {},
): Promise<T> {
  const { accessToken, headers: rawHeaders, query, body, ...init } = options;
  const headers = new Headers(rawHeaders);

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }

  const response = await fetch(
    `${getBackendUrl()}${path}${buildQueryString(query)}`,
    {
      ...init,
      headers,
      body: normalizeBody(body, headers),
    },
  );

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new BackendRequestError({
      statusCode: response.status,
      error: payload?.error ?? "Error",
      message: payload?.message ?? "Request failed",
    });
  }

  return payload as T;
}
