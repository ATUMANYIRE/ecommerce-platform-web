import { useSyncExternalStore } from "react";

/**
 * SSR-safe external store backed by localStorage. During hydration
 * `getServerSnapshot` returns the fallback so the server-rendered HTML matches;
 * React then re-reads the real snapshot and re-renders client-side without a
 * hydration error. Writes go through `set`, which persists to localStorage.
 */
export class LocalStorageStore<T> {
  private value: T;
  private initialized = false;
  private readonly listeners = new Set<() => void>();

  constructor(
    private readonly key: string,
    private readonly fallback: T,
    private readonly parse?: (value: unknown) => T,
  ) {
    this.value = fallback;
  }

  /** Server-side snapshot: always the fallback so SSR and hydration agree. */
  getServerSnapshot = (): T => this.fallback;

  getSnapshot = (): T => {
    if (!this.initialized) {
      this.initialized = true;
      this.value = this.read();
    }
    return this.value;
  };

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.add(listener);
    const onChange = (event: StorageEvent) => {
      if (event.key !== this.key) return;
      this.value =
        event.newValue === null ? this.fallback : this.parseStored(event.newValue);
      this.emit();
    };
    window.addEventListener("storage", onChange);
    return () => {
      this.listeners.delete(listener);
      window.removeEventListener("storage", onChange);
    };
  };

  set = (value: T | ((previous: T) => T)): void => {
    this.value =
      typeof value === "function"
        ? (value as (previous: T) => T)(this.value)
        : value;
    this.initialized = true;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(this.value));
    } catch {
      // storage unavailable — store still works in-memory
    }
    this.emit();
  };

  private read(): T {
    if (typeof window === "undefined") return this.fallback;
    try {
      const raw = window.localStorage.getItem(this.key);
      return raw === null ? this.fallback : this.parseStored(raw);
    } catch {
      return this.fallback;
    }
  }

  private parseStored(raw: string): T {
    try {
      const parsed = JSON.parse(raw) as unknown;
      return this.parse ? this.parse(parsed) : (parsed as T);
    } catch {
      return this.fallback;
    }
  }

  private emit = (): void => {
    this.listeners.forEach((listener) => listener());
  };
}

/**
 * React binding for a LocalStorageStore: subscribe to changes and keep the
 * server snapshot in sync so hydration never mismatches.
 */
export function useStore<T>(store: LocalStorageStore<T>): T {
  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
}
const noopSubscribe = () => () => {};

/**
 * False during server rendering and hydration, true afterwards. Lets views that
 * read localStorage avoid flashing a "not found" or empty state before the
 * stored data is available.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}
