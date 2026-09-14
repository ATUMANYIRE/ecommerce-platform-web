import type { IconName } from "@/components/ui/Icon";

export type SellerNavItem = {
  id: string;
  label: string;
  icon: IconName;
  href: string;
};

export const sellerNavItems: SellerNavItem[] = [
  { id: "overview", label: "Overview", icon: "dashboard", href: "/seller" },
  { id: "products", label: "Products", icon: "inventory_2", href: "/seller/products" },
  { id: "orders", label: "Orders", icon: "shopping_cart", href: "#" },
  { id: "inventory", label: "Inventory", icon: "store", href: "#" },
  { id: "reviews", label: "Reviews", icon: "reviews", href: "#" },
  { id: "settings", label: "Settings", icon: "settings", href: "#" },
];

export function getActiveSellerId(pathname: string): string {
  if (pathname === "/seller/products") return "products";
  if (pathname === "/seller") return "overview";
  return "overview";
}