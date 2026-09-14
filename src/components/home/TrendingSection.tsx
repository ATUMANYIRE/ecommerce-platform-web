import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import Icon from "@/components/ui/Icon";
import type { DemoProduct } from "@/lib/demo-data";

const railStyles = [
  { width: "w-[280px] md:w-[320px]", aspect: "square" as const },
  { width: "w-[260px] md:w-[300px]", aspect: "tall" as const },
  { width: "w-[320px] md:w-[400px]", aspect: "wide" as const },
  { width: "w-[280px] md:w-[320px]", aspect: "square" as const },
];

type TrendingSectionProps = {
  items: DemoProduct[];
  title?: string;
  subtitle?: string;
};

export default function TrendingSection({
  items,
  title = "Trending Now",
  subtitle = "Highly coveted pieces this week.",
}: TrendingSectionProps) {
  return (
    <section className="relative z-10 mx-auto w-full max-w-max-width space-y-xl px-margin-mobile md:px-margin-desktop">
      <div className="flex items-end justify-between border-b border-white/10 pb-4">
        <div>
          <h2 className="font-title-lg text-title-lg text-on-surface">{title}</h2>
          <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
            {subtitle}
          </p>
        </div>
        <Link
          href="/search?q=*"
          className="flex items-center gap-1 font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-secondary"
        >
          View All <Icon name="arrow_forward" className="text-sm" />
        </Link>
      </div>

      <div className="hide-scrollbar flex snap-x gap-gutter overflow-x-auto pb-8">
        {items.map((product, index) => {
          const style = railStyles[index % railStyles.length];
          return (
            <ProductCard
              key={product.sku}
              sku={product.sku}
              name={product.name}
              price={product.price}
              currency={product.currency}
              image={product.image}
              aspect={style.aspect}
              width={`${style.width} flex-shrink-0 snap-start`}
            />
          );
        })}
      </div>
    </section>
  );
}
