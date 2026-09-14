"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/ui/Icon";
import { demoStatesEnabled } from "@/lib/demo-mode";
import { formatAmount } from "@/lib/utils/currency";
import { isUnoptimizedImage } from "@/lib/utils/image";
import { vaseImage } from "@/lib/demo-data";

export type OrderDemoState = "processing" | "success" | "failure" | "loading";

const arcFloorLampImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYrLRDKgX1EKJ1pivSf7NN8FV766mBFrZwnV_hC4EE-9r_8_QZ_2ZImKzFkgzp8qspJMhzSrSrqW_8nC7LseUwraDHUrW3eGRl3lIt2LxnFT3YFo87GrftkA8Q6Z6wUWWgWYlpym_409wws13LcCSd0DAVuU1ac12RoIlrF2DniVPIHoePR4Th-TprupZp0HEb1kRzGWw_EWV-62zfBmhEWm7q5iO50NDMh2bD5g9KZ_MnHxoxaSjO2g";

const confirmationItems: {
  sku: string;
  name: string;
  price: number;
  quantity: number;
  currency: string;
  image: string;
}[] = [
  {
    sku: "NV-120",
    name: "Nocturne Vase",
    price: 120,
    quantity: 1,
    currency: "USD",
    image: vaseImage,
  },
  {
    sku: "AL-450",
    name: "Arc Floor Lamp",
    price: 450,
    quantity: 1,
    currency: "USD",
    image: arcFloorLampImage,
  },
];

type OrderProcessingViewProps = {
  demoState?: OrderDemoState;
};

/**
 * Order processing screen for the tail of the checkout flow. Renders the
 * processing state (stepper + order summary) by default; `?state=` demo params
 * drive the success, failure, and loading-skeleton states. The summary mirrors
 * the confirmation design's sample line items.
 */
export default function OrderProcessingView({
  demoState,
}: OrderProcessingViewProps) {
  const state = demoState ?? "processing";
  const { items: cartItems, clearCart } = useCart();

  // The summary shows what the shopper is actually buying; the design's sample
  // lines are only a preview fallback in development.
  const summaryItems: typeof confirmationItems =
    cartItems.length > 0 ? cartItems : demoStatesEnabled ? confirmationItems : [];
  const currency = summaryItems[0]?.currency ?? "USD";

  const confirmationTotal = summaryItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const orderId = `ATLAS-${
    10000 +
    ((Math.round(confirmationTotal * 100) * 31 + summaryItems.length * 1237) %
      89999)
  }-B`;

  return (
    <main className="mx-auto flex w-full max-w-[800px] flex-grow flex-col items-center justify-center gap-xxl p-margin-mobile md:p-margin-desktop">
      {/* Processing */}
      {state === "processing" && (
        <div className="flex w-full flex-col items-center gap-xl text-center">
          <div className="flex flex-col items-center gap-md">
            <div className="pulse-dot mb-sm h-unit w-unit rounded-full bg-champagne" />
            <h1 className="font-display-md text-display-md text-on-surface">
              We&apos;re processing your order
            </h1>
            <p className="max-w-2xl font-body-lg text-body-lg text-muted">
              Your order has been received. We&apos;re confirming the details
              and will update you shortly.
            </p>
            <p className="mt-xs font-label-md text-label-md uppercase tracking-widest text-on-surface">
              Order #{orderId}
            </p>
          </div>

          <div className="my-md flex w-full max-w-2xl items-center">
            <div className="flex flex-1 flex-col items-center gap-sm">
              <Icon
                name="check_circle"
                className="text-2xl text-champagne"
              />
              <span className="font-label-sm text-label-sm uppercase text-champagne">
                Received
              </span>
            </div>
            <div className="mb-6 h-px w-12 bg-champagne opacity-50" />
            <div className="flex flex-1 flex-col items-center gap-sm">
              <div className="relative mb-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-champagne">
                <div className="pulse-dot absolute h-2 w-2 rounded-full bg-champagne" />
              </div>
              <span className="font-label-sm text-label-sm uppercase text-on-surface">
                Processing
              </span>
            </div>
            <div className="mb-6 h-px w-12 bg-surface-variant" />
            <div className="flex flex-1 flex-col items-center gap-sm opacity-50">
              <div className="mb-1 h-6 w-6 rounded-full border-2 border-surface-variant" />
              <span className="font-label-sm text-label-sm uppercase text-muted">
                Confirmed
              </span>
            </div>
          </div>

          <div className="relative w-full max-w-2xl overflow-hidden rounded bg-ink p-lg text-left shadow-[0_32px_64px_rgba(11,13,15,0.15)]">
            <div className="pointer-events-none absolute inset-0 rounded border border-white/5" />
            <h3 className="mb-md font-title-lg text-title-lg text-on-surface">
              Order Summary
            </h3>
            <div className="flex flex-col gap-md">
              {summaryItems.map((item) => (
                <div
                  key={item.sku}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-md">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded border border-white/5 bg-surface-dim shadow-inner">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        unoptimized={isUnoptimizedImage(item.image)}
                        sizes="48px"
                        className="object-cover opacity-80"
                      />
                    </div>
                    <div>
                      <p className="font-body-md text-body-md text-on-surface">
                        {item.name}
                      </p>
                      <p className="font-label-sm text-label-sm uppercase text-muted">
                        Qty: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <span className="font-body-md text-body-md font-medium text-on-surface">
                    {formatAmount(item.price * item.quantity, item.currency)}
                  </span>
                </div>
              ))}
            </div>
            <div className="divider mt-md mb-md h-px w-full bg-ivory/10" />
            <div className="flex items-center justify-between">
              <span className="font-body-lg text-body-lg text-muted">Total</span>
              <span className="font-title-lg text-title-lg text-on-surface">
                {formatAmount(confirmationTotal, currency)}
              </span>
            </div>
          </div>

          {/* Preview switches for designers; never shown to shoppers in production. */}
          {demoStatesEnabled && (
          <div className="mt-md flex gap-sm">
            <Link
              href="/checkout/confirmation?state=success"
              className="border-b border-transparent pb-1 text-xs text-muted transition-colors hover:border-white hover:text-white"
            >
              Test Success
            </Link>
            <Link
              href="/checkout/confirmation?state=failure"
              className="border-b border-transparent pb-1 text-xs text-muted transition-colors hover:border-white hover:text-white"
            >
              Test Failure
            </Link>
            <Link
              href="/checkout/confirmation?state=loading"
              className="border-b border-transparent pb-1 text-xs text-muted transition-colors hover:border-white hover:text-white"
            >
              Test Loading
            </Link>
          </div>
          )}
        </div>
      )}

      {/* Success */}
      {state === "success" && (
        <div className="flex w-full flex-col items-center gap-xl text-center">
          <div className="flex flex-col items-center gap-md">
            <Icon name="check_circle" className="text-[64px] text-champagne" />
            <h1 className="mt-sm font-display-md text-display-md text-on-surface">
              Order confirmed
            </h1>
            <p className="max-w-2xl font-body-lg text-body-lg text-muted">
              Thank you for your purchase. We&apos;ve sent a confirmation email
              with your order details.
            </p>
            <p className="mt-xs font-label-md text-label-md uppercase tracking-widest text-on-surface">
              Order #{orderId}
            </p>
          </div>
          <div className="mt-lg flex w-full max-w-2xl flex-col gap-md sm:flex-row">
            <Link
              href="/orders"
              className="flex-1 rounded bg-champagne px-6 py-3 font-label-md text-label-md uppercase tracking-widest text-obsidian transition-opacity hover:opacity-90"
            >
              View Order
            </Link>
            <Link
              href="/"
              onClick={clearCart}
              className="flex-1 rounded border border-ivory bg-transparent px-6 py-3 font-label-md text-label-md uppercase tracking-widest text-on-surface transition-colors hover:bg-white/5"
            >
              Continue Shopping
            </Link>
          </div>
          {demoStatesEnabled && (
            <Link
              href="/checkout/confirmation"
              className="mt-xl text-xs text-muted transition-colors hover:text-white"
            >
              Return to Processing View
            </Link>
          )}
        </div>
      )}

      {/* Failure */}
      {state === "failure" && (
        <div className="flex w-full flex-col items-center gap-xl text-center">
          <div className="flex flex-col items-center gap-md">
            <Icon name="error" className="text-[64px] text-error" />
            <h1 className="mt-sm font-display-md text-display-md text-on-surface">
              We couldn&apos;t complete your order
            </h1>
            <p className="max-w-2xl font-body-lg text-body-lg text-muted">
              There was an issue processing your payment. Please check your
              details and try again.
            </p>
          </div>
          <div className="mt-lg flex w-full max-w-2xl flex-col gap-md sm:flex-row">
            <Link
              href="/checkout"
              className="flex-1 rounded bg-surface-bright px-6 py-3 font-label-md text-label-md uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-highest"
            >
              Try Again
            </Link>
            <Link
              href="/cart"
              className="flex-1 rounded bg-transparent px-6 py-3 font-label-md text-label-md uppercase tracking-widest text-on-surface transition-colors hover:text-white"
            >
              Return to Cart
            </Link>
          </div>
          {demoStatesEnabled && (
            <Link
              href="/checkout/confirmation"
              className="mt-xl text-xs text-muted transition-colors hover:text-white"
            >
              Return to Processing View
            </Link>
          )}
        </div>
      )}

      {/* Loading skeleton */}
      {state === "loading" && (
        <div className="flex w-full flex-col items-center gap-xl text-center">
          <div className="flex w-full max-w-2xl flex-col items-center gap-md">
            <div className="shimmer mb-sm h-12 w-12 rounded-full" />
            <div className="shimmer mb-2 h-10 w-3/4 rounded" />
            <div className="shimmer h-6 w-full rounded" />
            <div className="shimmer h-6 w-5/6 rounded" />
          </div>
          <div className="relative mt-md w-full max-w-2xl overflow-hidden rounded bg-ink p-lg text-left">
            <div className="pointer-events-none absolute inset-0 rounded border border-white/5" />
            <div className="shimmer mb-md h-8 w-1/3 rounded" />
            <div className="mb-md flex gap-md">
              <div className="shimmer h-12 w-12 rounded" />
              <div className="flex flex-1 flex-col justify-center gap-2">
                <div className="shimmer h-4 w-1/2 rounded" />
                <div className="shimmer h-3 w-1/4 rounded" />
              </div>
            </div>
            <div className="divider mb-md h-px w-full bg-ivory/10" />
            <div className="flex gap-md">
              <div className="shimmer h-12 w-12 rounded" />
              <div className="flex flex-1 flex-col justify-center gap-2">
                <div className="shimmer h-4 w-1/2 rounded" />
                <div className="shimmer h-3 w-1/4 rounded" />
              </div>
            </div>
          </div>
          {demoStatesEnabled && (
            <Link
              href="/checkout/confirmation"
              className="mt-xl text-xs text-muted transition-colors hover:text-white"
            >
              Return to Processing View
            </Link>
          )}
        </div>
      )}
    </main>
  );
}