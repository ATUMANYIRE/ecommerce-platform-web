export type SearchUrlValues = {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: string;
  maxPrice?: string;
};

/**
 * Build a shareable `/search?...` URL from filter values. Filters are optional
 * and only included when present; `q` defaults to `*` (match_all).
 */
export function buildSearchUrl(values: SearchUrlValues): string {
  const params = new URLSearchParams();
  params.set("q", values.q || "*");
  if (values.categoryId) params.set("categoryId", values.categoryId);
  if (values.brandId) params.set("brandId", values.brandId);
  if (values.minPrice) params.set("minPrice", values.minPrice);
  if (values.maxPrice) params.set("maxPrice", values.maxPrice);
  return `/search?${params.toString()}`;
}
