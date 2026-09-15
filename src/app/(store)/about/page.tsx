import type { Metadata } from "next";
import InfoPage from "@/components/info/InfoPage";
import { infoPages } from "@/lib/demo/info-pages";

export const metadata: Metadata = {
  title: "About Atlas - Atlas Marketplace",
  description: infoPages.about.intro,
};

export default function AboutPage() {
  return <InfoPage content={infoPages.about} />;
}
