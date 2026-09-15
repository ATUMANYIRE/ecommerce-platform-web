import Image from "next/image";
import type { CartItem } from "@/context/CartContext";
import { formatAmount } from "@/lib/utils/currency";
import { isUnoptimizedImage } from "@/lib/utils/image";

type SummaryItemsProps = {
  items: CartItem[];
};

/**
 * Compact cart item rows for the checkout order summaries (thumb + name +
 * qty/variant + line total).
 */
export default function SummaryItems({ items }: SummaryItemsProps) {
  return (
    <div className="flex flex-col gap-md">
      {items.map((item) => (
        <div key={item.sku} className="flex items-start gap-md">
          <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-highest">
            <span className="pointer-events-none absolute inset-0 z-10 rounded-lg shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)]" />
            <Image
              src={item.image}
              alt={item.name}
              fill
              unoptimized={isUnoptimizedImage(item.image)}
              sizes="80px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-grow flex-col justify-center gap-xs">
            <h4 className="line-clamp-1 font-body-lg text-body-lg text-on-surface">
              {item.name}
            </h4>
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Qty: {item.quantity}
              {item.category ? ` • ${item.category}` : ""}
            </span>
          </div>
          <div className="shrink-0 text-right">
            <span className="font-title-lg text-title-lg text-on-surface">
              {formatAmount(item.price * item.quantity, item.currency)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}