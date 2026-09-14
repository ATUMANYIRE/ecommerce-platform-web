import { findCatalogProduct } from "@/lib/cart/catalog";
import { getDemoProductDetail } from "@/lib/demo-data";

export type WishlistStockState = "in" | "low" | "out";

export type WishlistProduct = {
  sku: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  category?: string;
  stockLeft: number;
  stockState: WishlistStockState;
};

const LOW_STOCK_THRESHOLD = 10;

/**
 * Resolve a saved SKU into a display-ready wishlist entry, carrying the stock
 * level so the card can render In Stock / low stock / out of stock variants.
 * Unknown SKUs (or ones with no price info) resolve to null and are filtered
 * out of the page.
 */
export function resolveWishlistProduct(sku: string): WishlistProduct | null {
  const product = findCatalogProduct(sku);
  if (!product || !product.price) return null;

  const detail = getDemoProductDetail(sku);
  const stockLeft = detail?.stock ?? 1;
  const stockState: WishlistStockState =
    stockLeft <= 0 ? "out" : stockLeft <= LOW_STOCK_THRESHOLD ? "low" : "in";

  return {
    sku,
    name: product.name,
    price: product.price,
    currency: product.currency,
    image: product.image,
    category: product.category,
    stockLeft,
    stockState,
  };
}