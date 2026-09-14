"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { LocalStorageStore, useStore } from "@/lib/utils/localStorageStore";

type WishlistContextValue = {
  skus: string[];
  count: number;
  has: (sku: string) => boolean;
  toggle: (sku: string) => void;
  remove: (sku: string) => void;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

const STORAGE_KEY = "atlas-wishlist";

const wishlistStore = new LocalStorageStore<string[]>(
  STORAGE_KEY,
  [],
  (value) =>
    Array.isArray(value)
      ? value.filter((sku): sku is string => typeof sku === "string")
      : [],
);

/**
 * Client-side wishlist store (localStorage-backed), mirroring the cart store.
 * Individual SKUs are saved; product copy is resolved from the catalog when
 * rendering so prices/names always reflect the catalog.
 */
export function WishlistProvider({ children }: { children: ReactNode }) {
  const skus = useStore(wishlistStore);

  const toggle = useCallback((sku: string) => {
    wishlistStore.set((prev) =>
      prev.includes(sku) ? prev.filter((id) => id !== sku) : [...prev, sku],
    );
  }, []);

  const remove = useCallback((sku: string) => {
    wishlistStore.set((prev) => prev.filter((id) => id !== sku));
  }, []);

  const value = useMemo<WishlistContextValue>(() => {
    const has = (sku: string) => skus.includes(sku);
    return { skus, count: skus.length, has, toggle, remove };
  }, [skus, toggle, remove]);

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  );
}

export function useWishlist(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return ctx;
}