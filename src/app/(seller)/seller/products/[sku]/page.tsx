import type { Metadata } from "next";
import SellerProductForm from "@/components/seller/SellerProductForm";

export const metadata: Metadata = { title: "Edit Product - Seller Hub - Atlas" };

export default async function EditSellerProductPage({
  params,
}: {
  params: Promise<{ sku: string }>;
}) {
  const { sku } = await params;
  return <SellerProductForm sku={decodeURIComponent(sku)} />;
}
