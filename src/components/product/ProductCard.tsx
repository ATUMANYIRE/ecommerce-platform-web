import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import { formatAmount } from "@/lib/utils/currency";
import WishlistButton from "@/components/product/WishlistButton";

type ProductCardProps = {
  sku: string;
  name: string;
  price: number;
  currency: string;
  image?: string;
  aspect?: "square" | "tall" | "wide" | "portrait5x4";
  width?: string;
  className?: string;
};

const aspectClasses = {
  square: "aspect-square",
  tall: "aspect-[3/4]",
  wide: "aspect-[4/3]",
  portrait5x4: "aspect-[4/5]",
};

export default function ProductCard({
  sku,
  name,
  price,
  currency,
  image,
  aspect = "square",
  width,
  className,
}: ProductCardProps) {
  const src = image ?? "/placeholder.svg";
  return (
    <div
      className={cn(
        "group relative flex flex-col gap-md rounded bg-surface-container-low p-md shadow-md transition-all hover:bg-surface-container hover:shadow-xl",
        width,
        className,
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded bg-surface-container-highest",
          aspectClasses[aspect],
        )}
      >
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 768px) 50vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <WishlistButton productId={sku} className="absolute right-3 top-3" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-body-md text-body-md text-on-surface">{name}</h3>
        <span className="shrink-0 font-title-lg text-title-lg text-on-surface">
          {formatAmount(price, currency)}
        </span>
      </div>
    </div>
  );
}

export function ProductCardLink(props: ProductCardProps) {
  const { sku, className, ...rest } = props;
  return (
    <Link href={`/products/${encodeURIComponent(sku)}`} className="block">
      <ProductCard sku={sku} className={className} {...rest} />
    </Link>
  );
}
