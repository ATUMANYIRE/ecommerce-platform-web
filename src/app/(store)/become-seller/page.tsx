import type { Metadata } from "next";
import BecomeSellerView from "@/components/seller/BecomeSellerView";

export const metadata: Metadata = {
  title: "Sell on Atlas - Atlas Marketplace",
  description: "Open a store on Atlas and reach customers who value things made well.",
};

export default function BecomeSellerPage() {
  return <BecomeSellerView />;
}
