import { apiFetch } from "@/lib/api/client";

/** GET /categories (catalog-service), sorted by name. */
export type CategoryResponse = {
  id: string;
  name: string;
  slug: string;
  parentCategoryId?: string | null;
};

/** GET /brands (catalog-service), sorted by name. */
export type BrandResponse = {
  id: string;
  name: string;
  slug: string;
};

export function getCategories(): Promise<CategoryResponse[]> {
  return apiFetch<CategoryResponse[]>("/categories");
}

export function getBrands(): Promise<BrandResponse[]> {
  return apiFetch<BrandResponse[]>("/brands");
}

const ID_PATTERN = /^[0-9a-fA-F-]{1,36}$/;

/**
 * Search filters take catalog ids (UUIDs); search-service answers 400 for
 * anything else. Links built from the static config use readable slugs such as
 * "electronics", so map a slug or name to its id.
 *
 * @returns the id, `undefined` when no filter was given, or `null` when the
 *          value matches no known category/brand (so no product can match).
 */
export function resolveTaxonomyId(
  value: string | undefined,
  known: readonly { id: string; name: string; slug: string }[],
): string | undefined | null {
  if (!value) return undefined;
  if (ID_PATTERN.test(value)) return value;
  const needle = value.trim().toLowerCase();
  const match = known.find(
    (entry) => entry.slug.toLowerCase() === needle || entry.name.toLowerCase() === needle,
  );
  return match ? match.id : null;
}
