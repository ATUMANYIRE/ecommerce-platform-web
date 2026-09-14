"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import CartItemRow from "@/components/cart/CartItemRow";
import OrderSummary from "@/components/cart/OrderSummary";
import Icon from "@/components/ui/Icon";

type CartViewProps = {
  demoState?: "error";
};

/**
 * Renders the cart page in one of four states: filled, empty, loading (handled
 * by the route's loading.tsx) or the demo error state reached via
 * /cart?state=error.
 */
export default function CartView({ demoState }: CartViewProps) {
  const router = useRouter();
  const { items, totalCount } = useCart();

  if (demoState === "error") {
    return (
      <div className="mx-auto flex w-full max-w-max-width flex-col items-center justify-center px-margin-mobile py-xxl text-center md:px-margin-desktop">
        <div className="flex w-full max-w-[560px] flex-col items-center rounded-2xl border border-white/5 bg-surface-container-low p-xl shadow-2xl md:p-xxl">
          <div className="mb-lg grid h-16 w-16 place-items-center rounded-full bg-error/10">
            <Icon name="error_outline" className="text-[32px] text-error" />
          </div>
          <h1 className="mb-md font-display-md text-display-md text-on-background">
            Cart Unavailable
          </h1>
          <p className="mb-xl max-w-sm font-body-md text-body-md text-muted">
            We&apos;re having trouble loading your cart right now. Please try
            again in a moment.
          </p>
          <div className="flex w-full flex-col gap-md sm:flex-row">
            <button
              type="button"
              onClick={() => router.replace("/cart")}
              className="flex-grow rounded bg-champagne px-xl py-md font-label-md text-label-md uppercase tracking-wider text-obsidian transition-colors hover:bg-champagne/90"
            >
              Retry
            </button>
            <Link
              href="/"
              className="flex-grow rounded border border-white/10 px-xl py-md font-label-md text-label-md uppercase tracking-wider text-on-background transition-colors hover:bg-white/5"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-max-width flex-col items-center justify-center px-margin-mobile py-xxl text-center md:px-margin-desktop">
        <div className="mb-lg grid h-24 w-24 place-items-center rounded-full border border-white/5 bg-surface-container-low shadow-[0_32px_64px_-12px_rgba(11,13,15,0.5)] md:h-28 md:w-28">
          <Icon
            name="shopping_cart_off"
            className="text-[40px] text-muted md:text-[48px]"
          />
        </div>
        <h2 className="mb-md font-display-md text-display-md text-on-background">
          Your cart is empty
        </h2>
        <p className="mb-xl max-w-md font-body-lg text-body-lg text-muted">
          Looks like you haven&apos;t added anything to your cart yet. Discover
          our curated selection of premium goods.
        </p>
        <div className="flex flex-col gap-md sm:flex-row">
          <Link
            href="/"
            className="rounded bg-champagne px-xl py-md font-label-md text-label-md uppercase tracking-wider text-obsidian transition-colors hover:bg-champagne/90"
          >
            Continue Shopping
          </Link>
          <Link
            href="/#promo"
            className="rounded border border-white/10 px-xl py-md font-label-md text-label-md uppercase tracking-wider text-on-background transition-colors hover:bg-white/5"
          >
            Explore Deals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xxl md:px-margin-desktop">
      <div className="mb-xl">
        <h1 className="font-display-md text-display-md text-on-background">
          Shopping Cart
        </h1>
        <p className="mt-sm font-body-md text-body-md text-muted">
          {totalCount} {totalCount === 1 ? "item" : "items"}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-md lg:col-span-8">
          {items.map((item) => (
            <CartItemRow key={item.sku} sku={item.sku} />
          ))}

          <div className="mt-sm">
            <p className="flex items-center gap-sm font-label-sm text-label-sm text-muted">
              <Icon name="info" className="text-[16px]" />
              Need to change something? Add the item again with a new quantity.
            </p>
          </div>
        </div>

        <div className="lg:col-span-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}