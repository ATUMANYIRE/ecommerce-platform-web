"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/ui/Icon";
import { MAX_QUANTITY_PER_LINE } from "@/lib/api/cart";
import { formatAmount } from "@/lib/utils/currency";
import { isUnoptimizedImage } from "@/lib/utils/image";

/**
 * One row in the cart page. Converts to a product link, keeps a quantity
 * stepper and a remove action, then shows the line total.
 */
export default function CartItemRow({ sku }: { sku: string }) {
  const { items, setQuantity, removeItem } = useCart();
  const item = items.find((entry) => entry.sku === sku);
  if (!item) return null;

  return (
    <div className="flex flex-col gap-lg rounded-2xl border border-white/5 bg-surface-container-low p-lg shadow-[0_32px_64px_-12px_rgba(11,13,15,0.5)] sm:flex-row">
      <Link
        href={`/products/${encodeURIComponent(sku)}`}
        className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-primary-container sm:h-36 sm:w-36"
      >
        <Image
          src={item.image}
          alt={item.name}
          fill
          unoptimized={isUnoptimizedImage(item.image)}
          sizes="144px"
          className="object-cover"
        />
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
      </Link>

      <div className="flex flex-grow flex-col justify-between">
        <div className="flex items-start justify-between gap-md">
          <div className="min-w-0">
            <Link
              href={`/products/${encodeURIComponent(sku)}`}
              className="font-title-lg text-title-lg text-on-surface transition-colors hover:text-secondary"
            >
              {item.name}
            </Link>
            <p className="mt-unit font-label-md text-label-md uppercase text-muted">
              SKU: {item.sku}
            </p>
          </div>
          <button
            type="button"
            onClick={() => removeItem(sku)}
            aria-label={`Remove ${item.name} from cart`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-error"
          >
            <Icon name="close" className="text-inherit" />
          </button>
        </div>

        <div className="mt-lg flex items-center justify-between gap-md">
          <div className="flex items-center rounded-full border border-white/15 p-1">
            <button
              type="button"
              onClick={() => setQuantity(sku, item.quantity - 1)}
              aria-label="Decrease quantity"
              className="grid h-7 w-7 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
              disabled={item.quantity <= 1}
            >
              <Icon name="remove" className="text-[16px]" />
            </button>
            <span className="min-w-6 text-center font-body-md text-body-md text-on-surface">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(sku, item.quantity + 1)}
              aria-label="Increase quantity"
              disabled={item.quantity >= MAX_QUANTITY_PER_LINE}
              className="grid h-7 w-7 place-items-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Icon name="add" className="text-[16px]" />
            </button>
          </div>
          <p className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
            {formatAmount(item.price * item.quantity, item.currency)}
          </p>
        </div>
      </div>
    </div>
  );
}