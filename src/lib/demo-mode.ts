/**
 * `?state=` preview switches (error/loading/success screens) are design tools.
 * They are on in development and off in production builds, where they would let
 * anyone show a fake "Authentication successful" or order screen. Set
 * NEXT_PUBLIC_ENABLE_DEMO_STATES=true to keep them in a production preview build.
 */
export const demoStatesEnabled =
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PUBLIC_ENABLE_DEMO_STATES === "true";

/** The `?state=` value when previews are enabled and it is one of `allowed`. */
export function pickDemoState<T extends string>(
  value: string | string[] | undefined,
  allowed: readonly T[],
): T | undefined {
  if (!demoStatesEnabled || typeof value !== "string") return undefined;
  return (allowed as readonly string[]).includes(value) ? (value as T) : undefined;
}
