import { apiFetch, isApiError } from "@/lib/api/client";
import type { ApiRequestOptions } from "@/lib/api/client";
import { LocalStorageStore, useStore } from "@/lib/utils/localStorageStore";

/**
 * Signed-in session backed by auth-service (POST /auth/login, /auth/register,
 * /auth/refresh, /auth/logout). Tokens are kept in localStorage like the rest
 * of the client state; see the report for the recommended HttpOnly-cookie
 * backend-for-frontend before a public launch.
 */
export type Session = {
  accessToken: string;
  refreshToken: string;
  /** Epoch milliseconds when the access token expires. */
  expiresAt: number;
  userId: string;
  email: string;
  roles: string[];
};

type TokenPairResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
};

/** auth-service limits (RegisterRequest / LoginRequest). */
export const PASSWORD_MIN_LENGTH = 12;
export const PASSWORD_MAX_LENGTH = 128;
export const EMAIL_MAX_LENGTH = 254;

const sessionStore = new LocalStorageStore<Session | null>(
  "atlas-session",
  null,
  (value) => {
    if (value === null || typeof value !== "object") return null;
    const record = value as Partial<Session>;
    return typeof record.accessToken === "string" &&
      typeof record.refreshToken === "string"
      ? (record as Session)
      : null;
  },
);

function decodeClaims(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1] ?? "";
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    return JSON.parse(atob(padded)) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function toSession(pair: TokenPairResponse): Session {
  const claims = decodeClaims(pair.accessToken);
  return {
    accessToken: pair.accessToken,
    refreshToken: pair.refreshToken,
    expiresAt: Date.now() + pair.expiresIn * 1_000,
    userId: typeof claims.sub === "string" ? claims.sub : "",
    email: typeof claims.email === "string" ? claims.email : "",
    roles: Array.isArray(claims.roles) ? claims.roles.map(String) : [],
  };
}

export function getSession(): Session | null {
  return typeof window === "undefined" ? null : sessionStore.getSnapshot();
}

export function useSession(): Session | null {
  return useStore(sessionStore);
}

export async function login(email: string, password: string): Promise<Session> {
  const pair = await apiFetch<TokenPairResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
  });
  const session = toSession(pair);
  sessionStore.set(session);
  return session;
}

export async function register(email: string, password: string): Promise<Session> {
  const pair = await apiFetch<TokenPairResponse>("/auth/register", {
    method: "POST",
    body: { email, password },
  });
  const session = toSession(pair);
  sessionStore.set(session);
  return session;
}

/** Revokes the refresh token server-side (best effort) and forgets the session locally. */
export async function logout(): Promise<void> {
  const current = getSession();
  sessionStore.set(null);
  if (!current) return;
  try {
    await apiFetch<void>("/auth/logout", {
      method: "POST",
      body: { refreshToken: current.refreshToken },
    });
  } catch {
    // The local session is already gone; the refresh token expires on its own.
  }
}

let refreshing: Promise<boolean> | null = null;

/**
 * Rotates the token pair once, shared by concurrent callers: refresh tokens are
 * single-use, and reusing one makes auth-service revoke every session of the user.
 */
export function refreshSession(): Promise<boolean> {
  const current = getSession();
  if (!current) return Promise.resolve(false);
  if (!refreshing) {
    refreshing = apiFetch<TokenPairResponse>("/auth/refresh", {
      method: "POST",
      body: { refreshToken: current.refreshToken },
    })
      .then((pair) => {
        sessionStore.set(toSession(pair));
        return true;
      })
      .catch((error: unknown) => {
        // Keep the session through network blips; drop it when the server rejects the token.
        if (isApiError(error) && error.status !== 0 && error.status < 500) {
          sessionStore.set(null);
        }
        return false;
      })
      .finally(() => {
        refreshing = null;
      });
  }
  return refreshing;
}

/** apiFetch with the signed-in user's token and one refresh-and-retry on 401. */
export function authFetch<T>(
  path: string,
  options: Omit<ApiRequestOptions, "auth" | "onUnauthorized"> = {},
): Promise<T> {
  return apiFetch<T>(
    path,
    { ...options, auth: true, onUnauthorized: refreshSession },
    () => getSession()?.accessToken ?? null,
  );
}

/** A user-facing sentence for an auth-service error. */
export function authErrorMessage(error: unknown, fallback: string): string {
  if (!isApiError(error)) return fallback;
  if (error.status === 0) return "We couldn't reach the server. Please try again.";
  if (error.status === 429) {
    const seconds = Number(error.extensions.retryAfterSeconds);
    const minutes = Number.isFinite(seconds) ? Math.max(1, Math.ceil(seconds / 60)) : null;
    return minutes
      ? `Too many attempts. Please try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`
      : "Too many attempts. Please try again shortly.";
  }
  if (error.status >= 500) return "The service is temporarily unavailable. Please try again shortly.";
  return fallback;
}
