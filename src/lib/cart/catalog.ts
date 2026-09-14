import { mixedProducts, productDetails, trendingProducts } from "@/lib/demo-data";
import { categories } from "@/config/categories";

export type CatalogProduct = {
  sku: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category?: string;
};

const categoryNameById = new Map(
  categories.map((category) => [category.categoryId, category.name]),
);

const demoCategory: Record<string, string> = {
  "WH-300": "Electronics",
  "LT-180": "Fashion",
  "MK-140": "Electronics",
  "RS-045": "Beauty",
  "MW-085": "Fashion",
  "PR-120": "Sports",
  "CV-065": "Home",
  "SC-035": "Home",
};

const catalog = new Map<string, CatalogProduct>();

for (const product of [...trendingProducts, ...mixedProducts]) {
  catalog.set(product.sku, {
    sku: product.sku,
    name: product.name,
    price: product.price,
    currency: product.currency,
    image: product.image,
    category: demoCategory[product.sku],
  });
}

for (const detail of Object.values(productDetails)) {
  catalog.set(detail.sku, {
    sku: detail.sku,
    name: detail.name,
    price: detail.price,
    currency: detail.currency,
    image: detail.image,
    category: categoryNameById.get(detail.categoryId),
  });
}

export function findCatalogProduct(sku: string): CatalogProduct | null {
  return catalog.get(sku) ?? null;
}