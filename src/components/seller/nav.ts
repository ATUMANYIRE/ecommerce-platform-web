import type { IconName } from "@/components/ui/Icon";

export type SellerNavItem = {
  id: string;
  label: string;
  icon: IconName;
  href: string;
};

/** Navigation for a dashboard shell (Seller Hub or Admin Console). */
export type DashboardNav = {
  title: string;
  subtitle: string;
  items: SellerNavItem[];
  cta?: { label: string; href: string };
};

export const sellerNavItems: SellerNavItem[] = [
  { id: "overview", label: "Overview", icon: "dashboard", href: "/seller" },
  { id: "products", label: "Products", icon: "inventory_2", href: "/seller/products" },
  { id: "orders", label: "Orders", icon: "shopping_cart", href: "/seller/orders" },
  { id: "inventory", label: "Inventory", icon: "store", href: "/seller/inventory" },
  { id: "reviews", label: "Reviews", icon: "reviews", href: "/seller/reviews" },
  { id: "settings", label: "Settings", icon: "settings", href: "/seller/settings" },
];

export const sellerNav: DashboardNav = {
  title: "Atlas",
  subtitle: "Seller Dashboard",
  items: sellerNavItems,
  cta: { label: "Add Product", href: "/seller/products/new" },
};

export const adminNav: DashboardNav = {
  title: "Atlas",
  subtitle: "Admin Console",
  items: [
    { id: "overview", label: "Overview", icon: "dashboard", href: "/admin" },
    { id: "promotions", label: "Promotions", icon: "local_offer", href: "/admin/promotions" },
    { id: "reviews", label: "Moderation", icon: "rate_review", href: "/admin/reviews" },
    { id: "sellers", label: "Sellers", icon: "storefront", href: "/admin/sellers" },
  ],
  cta: { label: "New Promotion", href: "/admin/promotions?new=1" },
};

/** The nav item whose href is the longest prefix of the current path. */
export function getActiveNavItem(items: SellerNavItem[], pathname: string): SellerNavItem {
  return (
    [...items]
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? items[0]
  );
}

export function getActiveSellerId(pathname: string): string {
  return getActiveNavItem(sellerNavItems, pathname).id;
}
