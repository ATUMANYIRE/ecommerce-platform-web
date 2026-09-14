import { env } from "@/config/env";

export type ApiErrorExtensions = Record<string, unknown>;

export type ApiError = {
  status: number;
  title: string;
  detail?: string;
  errors?: string[];
  correlationId?: string;
  extensions: ApiErrorExtensions;
};

export type ApiRequestOptions = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  headers?: Record<string, string>;
  /**
   * Called once when a 401 is received so the caller can attempt a token
   * refresh. Return true to retry the request after re-authenticating.
   */
  onUnauthorized?: () => Promise<boolean>;
};

function correlationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseProblem(body: unknown): ApiError {
  const record =
    body !== null && typeof body === "object"
      ? (body as Record<string, unknown>)
      : {};
  const title =
    typeof record.title === "string" ? record.title : "Request failed";
  const detail =
    typeof record.detail === "string" ? record.detail : undefined;
  const errors = Array.isArray(record.errors)
    ? record.errors.map(String)
    : undefined;
  const correlationId =
    typeof record.correlationId === "string"
      ? record.correlationId
      : undefined;
  const status = Number(record.status ?? 0);
  const knownKeys = new Set([
    "type",
    "title",
    "status",
    "detail",
    "instance",
    "errors",
    "correlationId",
  ]);
  const extensions: ApiErrorExtensions = {};
  for (const [key, value] of Object.entries(record)) {
    if (!knownKeys.has(key)) {
      extensions[key] = value;
    }
  }
  return { status, title, detail, errors, correlationId, extensions };
}

/**
 * Central API client.
 * - Base URL from Next public env (defaults to the gateway on localhost:8080).
 * - Attaches X-Correlation-Id on every request.
 * - Attaches Authorization: Bearer when `auth` is true (token via getAccessToken).
 * - Normalizes RFC 9457 application/problem+json bodies into ApiError.
 * - Honors Retry-After on 429.
 */
export async function apiFetch<T>(
  path: string,
  options: ApiRequestOptions = {},
  getAccessToken?: () => string | null,
): Promise<T> {
  const {
    method = "GET",
    body,
    auth = false,
    headers: extraHeaders,
    onUnauthorized,
  } = options;

  const headers: Record<string, string> = {
    "X-Correlation-Id": correlationId(),
    Accept: "application/json",
    ...extraHeaders,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  if (auth) {
    const token = getAccessToken?.();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const controller = new AbortController();
  const timeoutSignal = AbortSignal.timeout?.(30_000);
  const signal = timeoutSignal
    ? AbortSignal.any([controller.signal, timeoutSignal])
    : controller.signal;

  const doFetch = async (): Promise<Response> => {
    return fetch(`${env.apiUrl}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
      cache: "no-store",
    });
  };

  let res = await doFetch();

  // Single 401 refresh-once retry.
  if (res.status === 401 && onUnauthorized) {
    const refreshed = await onUnauthorized();
    if (refreshed) {
      res = await doFetch();
    }
  }

  if (!res.ok) {
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("Retry-After") ?? 1) * 1000;
      await sleep(retryAfter);
      res = await doFetch();
      if (res.ok) {
        return (await res.json()) as T;
      }
    }

    let error: ApiError;
    const contentType = res.headers.get("content-type") ?? "";
    try {
      if (contentType.includes("application/problem+json") || contentType.includes("application/json")) {
        const json = await res.json();
        error = parseProblem(json);
      } else {
        error = {
          status: res.status,
          title: res.statusText || "Request failed",
          extensions: {},
        };
      }
    } catch {
      error = {
        status: res.status,
        title: res.statusText || "Request failed",
        extensions: {},
      };
    }
    throw error;
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}

export function getCorrelationHeader(): string {
  return correlationId();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
