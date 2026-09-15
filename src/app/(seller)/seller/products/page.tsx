import type { Metadata } from "next";
import SellerProductsView from "@/components/seller/SellerProductsView";

export const metadata: Metadata = { title: "Products - Seller Hub - Atlas" };

export default function SellerProductsPage() {
  return <SellerProductsView />;
}
