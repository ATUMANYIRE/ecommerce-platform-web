import Image from "next/image";
import ProductCard from "@/components/product/ProductCard";
import { lifestyleImage } from "@/lib/demo-data";
import type { DemoProduct } from "@/lib/demo-data";

const clusterAspects = [
  "portrait5x4",
  "square",
  "square",
  "portrait5x4",
] as const;

type MixedBlockProps = {
  items: DemoProduct[];
};

export default function MixedBlock({ items }: MixedBlockProps) {
  return (
    <section className="relative z-10 mx-auto grid w-full max-w-max-width grid-cols-1 gap-gutter px-margin-mobile md:px-margin-desktop mt-xl lg:grid-cols-2">
      <div className="group relative h-100 overflow-hidden rounded shadow-lg lg:h-auto">
        <Image
          src={lifestyleImage}
          alt="Curated lifestyle styling"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/30 to-transparent px-xl pb-6">
          <h3 className="font-display-md text-[40px] leading-tight text-white drop-shadow-md">
            Elevate Your
            <br />
            Everyday
          </h3>
          <p className="mt-2  font-body-lg text-white/80 drop-shadow-md">
            Discover pieces that seamlessly blend form and function.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-md">
        {items.map((product, index) => (
          <ProductCard
            key={product.sku}
            sku={product.sku}
            name={product.name}
            price={product.price}
            currency={product.currency}
            image={product.image}
            aspect={clusterAspects[index % clusterAspects.length]}
          />
        ))}
      </div>
    </section>
  );
}
