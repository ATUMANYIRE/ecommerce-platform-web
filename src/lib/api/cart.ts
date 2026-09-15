import { authFetch } from "@/lib/auth/session";
import type { CartResponse } from "@/types/product";

/** cart-service limits (CartLimits): at most 999 units per line and 50 lines. */
export const MAX_QUANTITY_PER_LINE = 999;
export const MAX_CART_LINES = 50;

export function addCartItem(sku: string, quantity: number): Promise<CartResponse> {
  return authFetch<CartResponse>("/cart/items", {
    method: "POST",
    body: { sku, quantity },
  });
}

export function updateCartItem(sku: string, quantity: number): Promise<CartResponse> {
  return authFetch<CartResponse>(`/cart/items/${encodeURIComponent(sku)}`, {
    method: "PUT",
    body: { quantity },
  });
}

export function removeCartItem(sku: string): Promise<CartResponse> {
  return authFetch<CartResponse>(`/cart/items/${encodeURIComponent(sku)}`, {
    method: "DELETE",
  });
}

export function getCart(): Promise<CartResponse> {
  return authFetch<CartResponse>("/cart");
}
