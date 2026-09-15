import type { Metadata } from "next";
import PromotionsView from "@/components/admin/PromotionsView";

export const metadata: Metadata = { title: "Promotions - Admin Console - Atlas" };

export default async function PromotionsPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const { new: openNew } = await searchParams;
  return <PromotionsView key={openNew ?? "list"} startCreating={openNew === "1"} />;
}
