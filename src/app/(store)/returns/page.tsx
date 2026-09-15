import type { Metadata } from "next";
import InfoPage from "@/components/info/InfoPage";
import { infoPages } from "@/lib/demo/info-pages";

export const metadata: Metadata = {
  title: "Returns & Refunds - Atlas Marketplace",
  description: infoPages.returns.intro,
};

export default function ReturnsPage() {
  return <InfoPage content={infoPages.returns} />;
}
