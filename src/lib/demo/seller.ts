import { LocalStorageStore, useStore } from "@/lib/utils/localStorageStore";

/**
 * Demo data for the Seller Hub. Products, orders, stock and reviews are sample
 * records kept in this browser; nothing is sent to a backend.
 */
export type SellerProductStatus = "Active" | "Draft" | "Discontinued";

export type SellerProduct = {
  sku: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  stock: number;
  status: SellerProductStatus;
  image: string;
  description: string;
  sold: number;
  updated: string;
};

const initialProducts: SellerProduct[] = [
  { sku: "WH-300", name: "Momentum Wireless Headphones", category: "Electronics", price: 399, currency: "USD", stock: 4, status: "Active", image: "/images/headphones.png", description: "Adaptive noise cancelling over-ear headphones with 60-hour battery life.", sold: 42, updated: "Oct 26, 2023" },
  { sku: "TB-425", name: "The Heritage Tote", category: "Fashion", price: 425, currency: "USD", stock: 5, status: "Active", image: "/images/tote.png", description: "Full-grain leather tote with a suede-lined interior.", sold: 28, updated: "Oct 24, 2023" },
  { sku: "KP-185", name: "Tactile Pro Keyboard", category: "Electronics", price: 185, currency: "USD", stock: 12, status: "Active", image: "/images/keyboard.png", description: "Hot-swappable mechanical keyboard with an aluminium case.", sold: 19, updated: "Oct 20, 2023" },
  { sku: "RS-045", name: "Rejuvenating Serum", category: "Beauty", price: 45, currency: "USD", stock: 0, status: "Active", image: "/images/serum.png", description: "Lightweight hyaluronic serum for daily hydration.", sold: 64, updated: "Oct 18, 2023" },
  { sku: "WU-240", name: "Chronograph No. 2", category: "Fashion", price: 240, currency: "USD", stock: 7, status: "Active", image: "/images/watch.png", description: "Swiss-movement chronograph with a sapphire crystal.", sold: 11, updated: "Oct 12, 2023" },
  { sku: "SR-160", name: "AeroRunner Elite", category: "Sports", price: 160, currency: "USD", stock: 18, status: "Draft", image: "/images/runner.png", description: "Carbon-plated road running shoe.", sold: 0, updated: "Oct 10, 2023" },
  { sku: "LS-090", name: "Lifestyle Display Stand", category: "Home", price: 90, currency: "USD", stock: 2, status: "Discontinued", image: "/images/lifestyle-screen.png", description: "Walnut stand for tablets and e-readers.", sold: 7, updated: "Sep 30, 2023" },
];

const productsStore = new LocalStorageStore<SellerProduct[]>("atlas-seller-products", initialProducts, (value) =>
  Array.isArray(value) && value.every((p) => p && typeof p === "object" && typeof (p as SellerProduct).sku === "string")
    ? (value as SellerProduct[])
    : initialProducts,
);

export function useSellerProducts(): SellerProduct[] {
  return useStore(productsStore);
}

export function saveSellerProduct(product: SellerProduct, originalSku?: string): void {
  productsStore.set((previous) => {
    const key = originalSku ?? product.sku;
    const exists = previous.some((p) => p.sku === key);
    return exists
      ? previous.map((p) => (p.sku === key ? product : p))
      : [product, ...previous];
  });
}

export function setSellerStock(sku: string, stock: number): void {
  productsStore.set((previous) =>
    previous.map((p) => (p.sku === sku ? { ...p, stock: Math.max(0, Math.min(99_999, Math.floor(stock))) } : p)),
  );
}

export function setSellerProductStatus(sku: string, status: SellerProductStatus): void {
  productsStore.set((previous) => previous.map((p) => (p.sku === sku ? { ...p, status } : p)));
}

export const sellerCategories = ["Electronics", "Fashion", "Home", "Beauty", "Sports"];

export type SellerOrderStatus = "New" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type SellerOrder = {
  id: string;
  date: string;
  customer: string;
  city: string;
  items: { sku: string; name: string; quantity: number; price: number; image: string }[];
  status: SellerOrderStatus;
  carrier?: string;
  tracking?: string;
};

export const initialSellerOrders: SellerOrder[] = [
  { id: "ORD-9024", date: "Nov 2, 2023", customer: "Marcus Lee", city: "Chicago, IL", status: "New", items: [{ sku: "WH-300", name: "Momentum Wireless Headphones", quantity: 1, price: 399, image: "/images/headphones.png" }] },
  { id: "ORD-9023", date: "Nov 1, 2023", customer: "Priya Nair", city: "Austin, TX", status: "New", items: [{ sku: "RS-045", name: "Rejuvenating Serum", quantity: 3, price: 45, image: "/images/serum.png" }] },
  { id: "ORD-9021", date: "Oct 30, 2023", customer: "Eleanor Vance", city: "Los Angeles, CA", status: "Processing", items: [{ sku: "TB-425", name: "The Heritage Tote", quantity: 1, price: 425, image: "/images/tote.png" }, { sku: "WU-240", name: "Chronograph No. 2", quantity: 1, price: 240, image: "/images/watch.png" }] },
  { id: "ORD-9020", date: "Oct 28, 2023", customer: "Tom Becker", city: "Denver, CO", status: "Shipped", carrier: "UPS", tracking: "1Z999AA10123456784", items: [{ sku: "KP-185", name: "Tactile Pro Keyboard", quantity: 2, price: 185, image: "/images/keyboard.png" }] },
  { id: "ORD-9017", date: "Oct 22, 2023", customer: "Ana Souza", city: "Miami, FL", status: "Delivered", carrier: "FedEx", tracking: "7734109284", items: [{ sku: "WH-300", name: "Momentum Wireless Headphones", quantity: 1, price: 399, image: "/images/headphones.png" }] },
  { id: "ORD-9012", date: "Oct 15, 2023", customer: "Kenji Mori", city: "Seattle, WA", status: "Cancelled", items: [{ sku: "SR-160", name: "AeroRunner Elite", quantity: 1, price: 160, image: "/images/runner.png" }] },
];

const ordersStore = new LocalStorageStore<SellerOrder[]>("atlas-seller-orders", initialSellerOrders, (value) =>
  Array.isArray(value) && value.every((o) => o && typeof o === "object" && typeof (o as SellerOrder).id === "string")
    ? (value as SellerOrder[])
    : initialSellerOrders,
);

export function useSellerOrders(): SellerOrder[] {
  return useStore(ordersStore);
}

export function updateSellerOrder(id: string, patch: Partial<SellerOrder>): void {
  ordersStore.set((previous) => previous.map((o) => (o.id === id ? { ...o, ...patch } : o)));
}

export function sellerOrderTotal(order: SellerOrder): number {
  return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export type SellerReview = {
  id: string;
  sku: string;
  product: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  date: string;
  verified: boolean;
  reply?: string;
};

export const initialSellerReviews: SellerReview[] = [
  { id: "rv-31", sku: "WH-300", product: "Momentum Wireless Headphones", author: "Elias J.", rating: 5, title: "Exquisite sound and build.", body: "The clarity is unmatched and the leather earcups stay comfortable for hours.", date: "Oct 29, 2023", verified: true },
  { id: "rv-30", sku: "TB-425", product: "The Heritage Tote", author: "Maya R.", rating: 4, title: "Beautiful leather", body: "Gorgeous bag. I wish the strap drop were a little longer.", date: "Oct 27, 2023", verified: true },
  { id: "rv-28", sku: "RS-045", product: "Rejuvenating Serum", author: "Chris P.", rating: 2, title: "Not for sensitive skin", body: "Caused some redness after a week of use. Packaging is lovely though.", date: "Oct 21, 2023", verified: false },
  { id: "rv-25", sku: "KP-185", product: "Tactile Pro Keyboard", author: "Dana K.", rating: 5, title: "Best keyboard I've owned", body: "Solid, quiet and the switches feel fantastic.", date: "Oct 15, 2023", verified: true, reply: "Thank you, Dana — enjoy the typing!" },
];

const reviewsStore = new LocalStorageStore<SellerReview[]>("atlas-seller-reviews", initialSellerReviews, (value) =>
  Array.isArray(value) && value.every((r) => r && typeof r === "object" && typeof (r as SellerReview).id === "string")
    ? (value as SellerReview[])
    : initialSellerReviews,
);

export function useSellerReviews(): SellerReview[] {
  return useStore(reviewsStore);
}

export function replyToReview(id: string, reply: string): void {
  reviewsStore.set((previous) => previous.map((r) => (r.id === id ? { ...r, reply } : r)));
}

export type StoreProfile = {
  storeName: string;
  businessName: string;
  contactEmail: string;
  description: string;
  returnDays: number;
  processingDays: number;
  payoutMethod: "Bank transfer" | "PayPal";
};

const initialStore: StoreProfile = {
  storeName: "Maison Vance",
  businessName: "Vance Goods LLC",
  contactEmail: "hello@maisonvance.example",
  description: "Considered audio, leather goods and everyday objects made to last.",
  returnDays: 30,
  processingDays: 2,
  payoutMethod: "Bank transfer",
};

export const storeProfileStore = new LocalStorageStore<StoreProfile>("atlas-seller-store", initialStore, (value) =>
  value && typeof value === "object" && typeof (value as StoreProfile).storeName === "string"
    ? { ...initialStore, ...(value as StoreProfile) }
    : initialStore,
);

export function useStoreProfile(): StoreProfile {
  return useStore(storeProfileStore);
}
