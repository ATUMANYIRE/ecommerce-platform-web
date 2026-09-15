import type { Metadata } from "next";
import SellerSettingsView from "@/components/seller/SellerSettingsView";

export const metadata: Metadata = { title: "Settings - Seller Hub - Atlas" };

export default function SellerSettingsPage() {
  return <SellerSettingsView />;
}
