import type { Metadata } from "next";
import InfoPage from "@/components/info/InfoPage";
import { infoPages } from "@/lib/demo/info-pages";

export const metadata: Metadata = {
  title: "Shipping - Atlas Marketplace",
  description: infoPages.shipping.intro,
};

export default function ShippingPage() {
  return <InfoPage content={infoPages.shipping} />;
}
