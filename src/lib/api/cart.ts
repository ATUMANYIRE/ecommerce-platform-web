import { apiFetch } from "@/lib/api/client";
import type { CartResponse } from "@/types/product";

export function addCartItem(
  sku: string,
  quantity: number,
  getAccessToken?: () => string | null,
): Promise<CartResponse> {
  return apiFetch<CartResponse>(
    "/cart/items",
    { method: "POST", body: { sku, quantity }, auth: true },
    getAccessToken,
  );
}

export function getCart(
  getAccessToken?: () => string | null,
): Promise<CartResponse> {
  return apiFetch<CartResponse>("/cart", { auth: true }, getAccessToken);
}
