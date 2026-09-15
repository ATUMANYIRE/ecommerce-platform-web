import type { Metadata } from "next";
import SellerInventoryView from "@/components/seller/SellerInventoryView";

export const metadata: Metadata = { title: "Inventory - Seller Hub - Atlas" };

export default function SellerInventoryPage() {
  return <SellerInventoryView />;
}
