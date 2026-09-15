import { brands, categories } from "@/config/categories";
import { allDemoProducts } from "@/lib/demo-data";
import type { SearchResponse } from "@/types/product";

type DemoSearchParams = {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
};

/**
 * Searches the shipped demo catalogue. Used when the API gateway is not reachable
 * (for example the storefront deployed on its own as a portfolio demo), so Shop
 * and category links still list products instead of an error page.
 */
export function demoSearch(params: DemoSearchParams): SearchResponse {
  const needle = params.q && params.q !== "*" ? params.q.trim().toLowerCase() : "";
  const words = needle.split(/\s+/).filter(Boolean);
  const items = allDemoProducts()
    .filter((product) => {
      const text = `${product.name} ${product.sku} ${product.description.join(" ")}`.toLowerCase();
      if (words.some((word) => !text.includes(word))) return false;
      if (params.categoryId && product.categoryId !== params.categoryId) return false;
      if (params.minPrice !== undefined && product.price < params.minPrice) return false;
      if (params.maxPrice !== undefined && product.price > params.maxPrice) return false;
      // Demo products carry no brand, so a brand filter matches nothing.
      return !params.brandId;
    })
    .map((product, index) => ({
      productId: product.sku,
      sku: product.sku,
      name: product.name,
      description: product.description[0],
      categoryId: product.categoryId,
      brandId: "",
      listPrice: product.price,
      currency: product.currency,
      status: "ACTIVE" as const,
      attributes: {},
      createdAt: new Date(Date.UTC(2023, 9, 1) - index * 86_400_000).toISOString(),
      score: 1,
      image: product.image,
    }));
  return { items, totalElements: items.length, page: 0, size: items.length };
}

export const demoFilterCategories = categories.map((c) => ({ name: c.name, categoryId: c.categoryId }));
export const demoFilterBrands = brands.map((b) => ({ name: b.name, brandId: b.brandId }));
