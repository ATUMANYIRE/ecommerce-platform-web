import type { Metadata } from "next";
import SellerReviewsView from "@/components/seller/SellerReviewsView";

export const metadata: Metadata = { title: "Reviews - Seller Hub - Atlas" };

export default function SellerReviewsPage() {
  return <SellerReviewsView />;
}
