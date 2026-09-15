/** Hosts listed under images.remotePatterns in next.config.ts; keep the two in sync. */
const OPTIMIZED_REMOTE_HOSTS = new Set(["lh3.googleusercontent.com"]);

/**
 * next/image throws "hostname is not configured" for any other remote host, which
 * would crash a page as soon as the catalog returns an image URL from its own
 * storage. Such images are passed through unoptimized instead.
 */
export function isUnoptimizedImage(src: string): boolean {
  if (src.startsWith("/") && !src.startsWith("//")) return false;
  try {
    return !OPTIMIZED_REMOTE_HOSTS.has(new URL(src).hostname);
  } catch {
    return true;
  }
}
