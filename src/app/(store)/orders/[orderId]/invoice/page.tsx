import type { Metadata } from "next";
import InvoiceView from "@/components/orders/InvoiceView";

export const metadata: Metadata = {
  title: "Invoice - Atlas Marketplace",
};

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <InvoiceView orderId={decodeURIComponent(orderId)} />;
}
