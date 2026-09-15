import { LocalStorageStore, useStore } from "@/lib/utils/localStorageStore";

/** Demo data for the Admin Console, kept in this browser. */
export type Promotion = {
  code: string;
  discountType: "PERCENT" | "FIXED";
  discountValue: number;
  minOrderAmount?: number;
  usageLimit?: number;
  usageCount: number;
  startsAt: string;
  expiresAt: string;
  active: boolean;
};

const initialPromotions: Promotion[] = [
  { code: "ATLAS10", discountType: "PERCENT", discountValue: 10, usageCount: 184, startsAt: "2023-09-01", expiresAt: "2026-12-31", active: true },
  { code: "WELCOME25", discountType: "FIXED", discountValue: 25, minOrderAmount: 150, usageLimit: 500, usageCount: 312, startsAt: "2023-06-01", expiresAt: "2026-12-31", active: true },
  { code: "BLACKFRIDAY", discountType: "PERCENT", discountValue: 30, usageLimit: 1000, usageCount: 0, startsAt: "2026-11-27", expiresAt: "2026-11-30", active: true },
  { code: "HOLIDAY2023", discountType: "PERCENT", discountValue: 15, usageLimit: 300, usageCount: 300, startsAt: "2023-12-01", expiresAt: "2023-12-31", active: false },
];

const promotionsStore = new LocalStorageStore<Promotion[]>("atlas-admin-promotions", initialPromotions, (value) =>
  Array.isArray(value) && value.every((p) => p && typeof p === "object" && typeof (p as Promotion).code === "string")
    ? (value as Promotion[])
    : initialPromotions,
);

export function usePromotions(): Promotion[] {
  return useStore(promotionsStore);
}

export function addPromotion(promotion: Promotion): void {
  promotionsStore.set((previous) => [promotion, ...previous]);
}

export function setPromotionActive(code: string, active: boolean): void {
  promotionsStore.set((previous) => previous.map((p) => (p.code === code ? { ...p, active } : p)));
}

export type PromotionState = "Active" | "Scheduled" | "Expired" | "Used up" | "Paused";

export function promotionState(promotion: Promotion, today = new Date().toISOString().slice(0, 10)): PromotionState {
  if (!promotion.active) return "Paused";
  if (promotion.expiresAt < today) return "Expired";
  if (promotion.usageLimit !== undefined && promotion.usageCount >= promotion.usageLimit) return "Used up";
  if (promotion.startsAt > today) return "Scheduled";
  return "Active";
}

export type ModerationStatus = "PENDING" | "APPROVED" | "REJECTED" | "FLAGGED";

export type ModerationReview = {
  id: string;
  product: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  status: ModerationStatus;
  reason?: string;
};

const initialModeration: ModerationReview[] = [
  { id: "m-88", product: "Momentum Wireless Headphones", author: "Jordan T.", rating: 5, title: "Worth every cent", body: "Incredible noise cancelling on my commute. Battery lasts all week.", date: "Nov 2, 2023", status: "PENDING" },
  { id: "m-87", product: "Rejuvenating Serum", author: "user4821", rating: 1, title: "SCAM visit my site for cheaper", body: "Buy the same thing for half price at cheap-serums dot example.", date: "Nov 1, 2023", status: "FLAGGED", reason: "Reported as spam by 3 customers" },
  { id: "m-86", product: "The Heritage Tote", author: "Maya R.", rating: 4, title: "Beautiful leather", body: "Gorgeous bag. I wish the strap drop were a little longer.", date: "Oct 31, 2023", status: "PENDING" },
  { id: "m-85", product: "Tactile Pro Keyboard", author: "Dana K.", rating: 5, title: "Best keyboard I've owned", body: "Solid, quiet and the switches feel fantastic.", date: "Oct 15, 2023", status: "APPROVED" },
  { id: "m-84", product: "AeroRunner Elite", author: "anon", rating: 1, title: "!!!!!!", body: "Terrible terrible terrible.", date: "Oct 12, 2023", status: "REJECTED", reason: "No product-specific content" },
];

const moderationStore = new LocalStorageStore<ModerationReview[]>("atlas-admin-moderation", initialModeration, (value) =>
  Array.isArray(value) && value.every((r) => r && typeof r === "object" && typeof (r as ModerationReview).id === "string")
    ? (value as ModerationReview[])
    : initialModeration,
);

export function useModerationQueue(): ModerationReview[] {
  return useStore(moderationStore);
}

export function moderateReview(id: string, status: ModerationStatus): void {
  moderationStore.set((previous) => previous.map((r) => (r.id === id ? { ...r, status } : r)));
}

export type SellerAccount = {
  id: string;
  storeName: string;
  owner: string;
  products: number;
  sales: number;
  joined: string;
  status: "ACTIVE" | "ONBOARDING" | "SUSPENDED";
};

const initialSellers: SellerAccount[] = [
  { id: "s-12", storeName: "Maison Vance", owner: "Eleanor Vance", products: 7, sales: 24500, joined: "Mar 2023", status: "ACTIVE" },
  { id: "s-15", storeName: "Keycap Collective", owner: "Tom Becker", products: 22, sales: 11840, joined: "May 2023", status: "ACTIVE" },
  { id: "s-19", storeName: "Glow Apothecary", owner: "Priya Nair", products: 14, sales: 6230, joined: "Aug 2023", status: "ACTIVE" },
  { id: "s-23", storeName: "North Trail Co.", owner: "Kenji Mori", products: 0, sales: 0, joined: "Oct 2023", status: "ONBOARDING" },
  { id: "s-08", storeName: "Replica Watches Ltd", owner: "Unknown", products: 38, sales: 910, joined: "Jan 2023", status: "SUSPENDED" },
];

const sellersStore = new LocalStorageStore<SellerAccount[]>("atlas-admin-sellers", initialSellers, (value) =>
  Array.isArray(value) && value.every((s) => s && typeof s === "object" && typeof (s as SellerAccount).id === "string")
    ? (value as SellerAccount[])
    : initialSellers,
);

export function useSellerAccounts(): SellerAccount[] {
  return useStore(sellersStore);
}

export function setSellerStatus(id: string, status: SellerAccount["status"]): void {
  sellersStore.set((previous) => previous.map((s) => (s.id === id ? { ...s, status } : s)));
}
