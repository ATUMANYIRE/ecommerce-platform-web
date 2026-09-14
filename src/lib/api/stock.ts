import { apiFetch } from "@/lib/api/client";
import type { StockResponse } from "@/types/product";

export function getStock(sku: string): Promise<StockResponse> {
  return apiFetch<StockResponse>(`/stock/${encodeURIComponent(sku)}`);
}
