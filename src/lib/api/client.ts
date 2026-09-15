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

const REQUEST_TIMEOUT_MS = 30_000;
/** Longest Retry-After worth waiting for inside a single call; longer waits are surfaced to the caller. */
const MAX_AUTOMATIC_RETRY_WAIT_MS = 5_000;

function correlationId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parseProblem(body: unknown, httpStatus: number): ApiError {
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
  // Not every error body carries `status`; the HTTP status is the source of truth.
  const status = Number(record.status) || httpStatus;
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

/** AbortSignal.timeout is missing in older browsers; fall back to a timer. */
function timeoutSignal(ms: number): AbortSignal {
  if (typeof AbortSignal !== "undefined" && typeof AbortSignal.timeout === "function") {
    return AbortSignal.timeout(ms);
  }
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

/** Retry-After is whole seconds (the gateway) or, per RFC 9110, an HTTP date. */
function retryAfterMs(res: Response): number {
  const header = res.headers.get("Retry-After");
  if (!header) return 1_000;
  const seconds = Number(header);
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1_000);
  const date = Date.parse(header);
  return Number.isNaN(date) ? 1_000 : Math.max(0, date - Date.now());
}

export function isApiError(value: unknown): value is ApiError {
  return (
    value !== null &&
    typeof value === "object" &&
    "status" in value &&
    typeof (value as { status: unknown }).status === "number"
  );
}

/**
 * Central API client.
 * - Base URL from Next public env (defaults to the gateway on localhost:8080).
 * - Attaches X-Correlation-Id on every request.
 * - Attaches Authorization: Bearer when `auth` is true (token via getAccessToken),
 *   re-reading the token for the retry after a refresh.
 * - Normalizes RFC 9457 application/problem+json bodies into ApiError; network
 *   failures and timeouts become an ApiError with status 0.
 * - On 429, retries a GET once when Retry-After is short. Writes are never
 *   retried automatically: checkout has no idempotency key.
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

  const buildHeaders = (): Record<string, string> => {
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
    return headers;
  };

  const doFetch = async (): Promise<Response> => {
    try {
      return await fetch(`${env.apiUrl}${path}`, {
        method,
        headers: buildHeaders(),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: timeoutSignal(REQUEST_TIMEOUT_MS),
        cache: "no-store",
      });
    } catch (cause) {
      const timedOut =
        cause instanceof DOMException &&
        (cause.name === "TimeoutError" || cause.name === "AbortError");
      const error: ApiError = {
        status: 0,
        title: timedOut ? "Request timed out" : "Network error",
        detail: "We couldn't reach the server. Please try again.",
        extensions: {},
      };
      throw error;
    }
  };

  let res = await doFetch();

  // Single 401 refresh-once retry.
  if (res.status === 401 && auth && onUnauthorized) {
    const refreshed = await onUnauthorized();
    if (refreshed) {
      res = await doFetch();
    }
  }

  if (res.status === 429 && method === "GET") {
    const wait = retryAfterMs(res);
    if (wait <= MAX_AUTOMATIC_RETRY_WAIT_MS) {
      await sleep(wait);
      res = await doFetch();
    }
  }

  if (!res.ok) {
    let error: ApiError;
    const contentType = res.headers.get("content-type") ?? "";
    try {
      if (contentType.includes("application/problem+json") || contentType.includes("application/json")) {
        error = parseProblem(await res.json(), res.status);
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
    if (res.status === 429) {
      error.extensions.retryAfterSeconds = Math.ceil(retryAfterMs(res) / 1_000);
    }
    throw error;
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") {
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
