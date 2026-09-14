import Hero from "@/components/home/Hero";
import CategoryGrid from "@/components/home/CategoryGrid";
import TrendingSection from "@/components/home/TrendingSection";
import MixedBlock from "@/components/home/MixedBlock";
import HowItWorks from "@/components/home/HowItWorks";
import PromoBanner from "@/components/home/PromoBanner";
import { trendingProducts, mixedProducts } from "@/lib/demo-data";

export default function HomePage() {
  return (
    <main className="flex flex-grow flex-col gap-xxl pb-xxl relative">
      <Hero />
      <CategoryGrid />
      <TrendingSection items={trendingProducts} />
      <MixedBlock items={mixedProducts} />
      <HowItWorks />
      <PromoBanner />
    </main>
  );
}
