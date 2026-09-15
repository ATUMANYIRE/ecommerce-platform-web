import type { Metadata } from "next";
import InfoPage from "@/components/info/InfoPage";
import { infoPages } from "@/lib/demo/info-pages";

export const metadata: Metadata = {
  title: "Terms of Service - Atlas Marketplace",
  description: infoPages.terms.intro,
};

export default function TermsPage() {
  return <InfoPage content={infoPages.terms} />;
}
