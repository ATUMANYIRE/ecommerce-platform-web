/**
 * A same-site path for post-login redirects, or `fallback`. Rejects absolute URLs
 * and protocol-relative or backslash tricks ("//evil.example", "/\\evil.example")
 * that would turn `?next=` into an open redirect.
 */
export function safeRedirectPath(value: unknown, fallback: string): string {
  if (typeof value !== "string" || !value.startsWith("/")) return fallback;
  try {
    const url = new URL(value, "http://placeholder.invalid");
    if (url.origin !== "http://placeholder.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
