import type { Metadata } from "next";
import InfoPage from "@/components/info/InfoPage";
import { infoPages } from "@/lib/demo/info-pages";

export const metadata: Metadata = {
  title: "Privacy Policy - Atlas Marketplace",
  description: infoPages.privacy.intro,
};

export default function PrivacyPage() {
  return <InfoPage content={infoPages.privacy} />;
}
