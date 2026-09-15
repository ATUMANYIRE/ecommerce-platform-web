import type { Metadata } from "next";
import PaymentView from "@/components/checkout/PaymentView";

export const metadata: Metadata = {
  title: "Payment - Atlas Marketplace",
};

export default async function PaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ promo?: string }>;
}) {
  const { promo } = await searchParams;
  return <PaymentView promoCode={promo === "ATLAS10" ? promo : undefined} />;
}
