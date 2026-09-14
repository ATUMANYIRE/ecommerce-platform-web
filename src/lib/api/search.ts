import { apiFetch } from "@/lib/api/client";
import type {
  AutocompleteResponse,
  SearchResponse,
} from "@/types/product";

export type SearchParams = {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: "ACTIVE" | "DRAFT" | "DISCONTINUED";
  page?: number;
  size?: number;
};

function toQuery(params: SearchParams): string {
  const search = new URLSearchParams();
  if (params.q) search.set("q", params.q);
  if (params.categoryId) search.set("categoryId", params.categoryId);
  if (params.brandId) search.set("brandId", params.brandId);
  if (params.minPrice !== undefined) search.set("minPrice", String(params.minPrice));
  if (params.maxPrice !== undefined) search.set("maxPrice", String(params.maxPrice));
  if (params.status) search.set("status", params.status);
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.size !== undefined) search.set("size", String(params.size));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export function search(params: SearchParams = {}): Promise<SearchResponse> {
  return apiFetch<SearchResponse>(`/search${toQuery(params)}`);
}

export function autocomplete(
  q: string,
  size = 5,
): Promise<AutocompleteResponse> {
  return apiFetch<AutocompleteResponse>(
    `/search/autocomplete?q=${encodeURIComponent(q)}&size=${size}`,
  );
}
