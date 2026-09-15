import type { Metadata } from "next";
import SellerOrdersView from "@/components/seller/SellerOrdersView";

export const metadata: Metadata = { title: "Orders - Seller Hub - Atlas" };

export default function SellerOrdersPage() {
  return <SellerOrdersView />;
}
