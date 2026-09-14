export type Money = {
  amount: string;
  currency: string;
};

export type ProductStatus = "DRAFT" | "ACTIVE" | "DISCONTINUED";

export type ProductImage = {
  url: string;
  altText?: string;
};

/**
 * GET /products/{sku} (catalog-service).
 * `images` is always [] (no API populates it). `listPrice` is a Money object.
 */
export type ProductResponse = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  brandId: string;
  listPrice: Money;
  status: ProductStatus;
  images: ProductImage[];
};

/**
 * GET /stock/{sku} (inventory-service).
 */
export type StockResponse = {
  sku: string;
  availableQuantity: number;
};

/**
 * Search item — listPrice is a raw number (not Money).
 * No images, no rating, no seller/brand names on the item.
 */
export type SearchItem = {
  productId: string;
  sku: string;
  name: string;
  description?: string;
  categoryId: string;
  brandId: string;
  listPrice: number;
  currency: string;
  status: ProductStatus;
  attributes: Record<string, unknown>;
  createdAt: string;
  score: number;
};

/**
 * GET /search. No totalPages field.
 */
export type SearchResponse = {
  items: SearchItem[];
  totalElements: number;
  page: number;
  size: number;
};

/**
 * GET /search/autocomplete. Only these 3 fields.
 */
export type Suggestion = {
  productId: string;
  sku: string;
  name: string;
};

export type AutocompleteResponse = {
  suggestions: Suggestion[];
};

export type CartLineItem = {
  sku: string;
  quantity: number;
  priceSnapshot: Money;
};

/**
 * GET /cart. No productId, no balance total.
 */
export type CartResponse = {
  id: string;
  lineItems: CartLineItem[];
};
