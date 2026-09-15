import type { Metadata } from "next";
import SellerProductForm from "@/components/seller/SellerProductForm";

export const metadata: Metadata = { title: "Add Product - Seller Hub - Atlas" };

export default function NewSellerProductPage() {
  return <SellerProductForm />;
}
