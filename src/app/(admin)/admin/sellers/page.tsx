import type { Metadata } from "next";
import AdminSellersView from "@/components/admin/AdminSellersView";

export const metadata: Metadata = { title: "Sellers - Admin Console - Atlas" };

export default function AdminSellersPage() {
  return <AdminSellersView />;
}
