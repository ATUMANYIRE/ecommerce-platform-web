import { apiFetch } from "@/lib/api/client";
import type { ProductResponse } from "@/types/product";

export function getProductBySku(sku: string): Promise<ProductResponse> {
  return apiFetch<ProductResponse>(`/products/${encodeURIComponent(sku)}`);
}
