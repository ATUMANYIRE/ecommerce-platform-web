"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import type { ReactNode } from "react";
import { addCartItem as apiAddCartItem } from "@/lib/api/cart";
import { findCatalogProduct } from "@/lib/cart/catalog";
import { LocalStorageStore, useStore } from "@/lib/utils/localStorageStore";

export type CartItem = {
  sku: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  quantity: number;
  category?: string;
};

type CartProduct = {
  name: string;
  price: number;
  currency: string;
  image?: string;
  category?: string;
};

type CartContextValue = {
  items: CartItem[];
  totalCount: number;
  subtotal: number;
  addItem: (sku: string, quantity?: number, product?: CartProduct) => void;
  removeItem: (sku: string) => void;
  setQuantity: (sku: string, quantity: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "atlas-cart";
const PLACEHOLDER_IMAGE = "/images/product-placeholder.svg";

const cartStore = new LocalStorageStore<CartItem[]>(
  STORAGE_KEY,
  [],
  (value) =>
    Array.isArray(value)
      ? value.filter(
          (item): item is CartItem =>
            item !== null &&
            typeof item === "object" &&
            typeof item.sku === "string" &&
            typeof item.quantity === "number",
        )
      : [],
);

/**
 * Client-side cart store (localStorage-backed). The gateway is optional in
 * local dev, so the store is the source of truth for the UI; the real cart API
 * is still fired so the backend stays in sync when it exists.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const items = useStore(cartStore);

  const addItem: CartContextValue["addItem"] = useCallback((sku, quantity = 1, product) => {
    const known = product
      ? {
          name: product.name,
          price: product.price,
          currency: product.currency,
          image: product.image ?? PLACEHOLDER_IMAGE,
          category: product.category,
        }
      : findCatalogProduct(sku);

    cartStore.set((prev) => {
      const existing = prev.find((item) => item.sku === sku);
      if (existing) {
        return prev.map((item) =>
          item.sku === sku
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      if (!known) return prev;
      return [
        ...prev,
        {
          sku,
          name: known.name,
          price: known.price,
          currency: known.currency,
          image: known.image,
          quantity,
          category: known.category,
        },
      ];
    });

    apiAddCartItem(sku, quantity).catch(() => {
      // gateway offline — local store is the fallback source of truth
    });
  }, []);

  const removeItem = useCallback((sku: string) => {
    cartStore.set((prev) => prev.filter((item) => item.sku !== sku));
  }, []);

  const setQuantity = useCallback((sku: string, quantity: number) => {
    cartStore.set((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.sku !== sku)
        : prev.map((item) =>
            item.sku === sku ? { ...item, quantity } : item,
          ),
    );
  }, []);

  const clearCart = useCallback(() => cartStore.set([]), []);

  const value = useMemo<CartContextValue>(() => {
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return {
      items,
      totalCount,
      subtotal,
      addItem,
      removeItem,
      setQuantity,
      clearCart,
    };
  }, [items, addItem, removeItem, setQuantity, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}