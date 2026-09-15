"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import SummaryItems from "@/components/checkout/SummaryItems";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { useAddresses } from "@/context/AddressContext";
import { useCart } from "@/context/CartContext";
import { estimateTax } from "@/lib/checkout/tax";
import { placeDemoOrder } from "@/lib/orders/placed-orders";
import { formatAmount } from "@/lib/utils/currency";
import { useHydrated } from "@/lib/utils/localStorageStore";
import { cn } from "@/lib/utils/cn";

type Method = "card" | "paypal" | "cod";
type Speed = "standard" | "express";

const methods: { id: Method; label: string; hint: string; icon: IconName }[] = [
  { id: "card", label: "Credit or debit card", hint: "Visa, Mastercard, American Express", icon: "credit_card" },
  { id: "paypal", label: "PayPal", hint: "You'll confirm in a PayPal window", icon: "account_balance_wallet" },
  { id: "cod", label: "Cash on delivery", hint: "Pay the courier when your order arrives", icon: "payments" },
];

const FREE_SHIPPING_FROM = 200;

/**
 * Final checkout step. Demo only: no card details are entered or collected and
 * no payment is taken; "Pay" records the order in this browser.
 */
export default function PaymentView({ promoCode }: { promoCode?: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const { items, subtotal, clearCart } = useCart();
  const { selectedAddress } = useAddresses();
  const [method, setMethod] = useState<Method>("card");
  const [speed, setSpeed] = useState<Speed>("standard");
  const [phase, setPhase] = useState<"idle" | "paying">("idle");
  const submitted = useRef(false);

  const currency = items[0]?.currency ?? "USD";
  const discount = promoCode ? Math.round(subtotal * 10) / 100 : 0;
  const shipping =
    speed === "express" ? 30 : subtotal - discount >= FREE_SHIPPING_FROM ? 0 : 15;
  const tax = estimateTax(subtotal - discount);
  const total = subtotal - discount + shipping + tax;

  if (!hydrated) {
    return <div className="mx-auto h-[60vh] w-full max-w-max-width px-margin-mobile py-xxl" aria-busy="true" />;
  }

  // While paying, the cart is cleared just before navigating away: keep this screen.
  if (phase === "idle" && (items.length === 0 || !selectedAddress)) {
    return (
      <div className="mx-auto flex w-full max-w-max-width flex-grow flex-col items-center justify-center px-margin-mobile py-xxl text-center md:px-margin-desktop">
        <Icon name={items.length === 0 ? "remove_shopping_cart" : "location_off"} className="mb-lg text-[56px] text-on-surface-variant opacity-60" />
        <h1 className="mb-md font-display-md text-headline-lg-mobile text-on-background md:text-display-md">
          {items.length === 0 ? "Your cart is empty" : "Choose a delivery address"}
        </h1>
        <p className="mb-xl max-w-md font-body-lg text-body-lg text-on-surface-variant">
          {items.length === 0
            ? "Add something to your cart before paying."
            : "Select where we should deliver your order before paying."}
        </p>
        <Link
          href={items.length === 0 ? "/" : "/checkout"}
          className="rounded bg-secondary px-lg py-md font-label-md text-label-md uppercase tracking-wider text-background transition-colors hover:bg-secondary-fixed"
        >
          {items.length === 0 ? "Continue Shopping" : "Back to Checkout"}
        </Link>
      </div>
    );
  }

  async function pay() {
    // Guard against double submits: each click would otherwise place another order.
    if (submitted.current || !selectedAddress) return;
    submitted.current = true;
    setPhase("paying");
    await new Promise((resolve) => setTimeout(resolve, 1600));
    const order = placeDemoOrder({
      items: items.map((item) => ({
        sku: item.sku,
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: item.price,
        currency: item.currency,
      })),
      addressLines: [
        selectedAddress.name,
        selectedAddress.line1,
        ...(selectedAddress.line2 ? [selectedAddress.line2] : []),
        `${selectedAddress.city}, ${selectedAddress.postalCode}`,
        selectedAddress.country,
      ],
      subtotal,
      discount,
      promoCode,
      shipping,
      tax,
      currency,
      paymentLabel: methods.find((m) => m.id === method)?.label ?? "Card",
    });
    clearCart();
    router.replace(`/checkout/confirmation?state=success&order=${encodeURIComponent(order.id)}`);
  }

  return (
    <div className="mx-auto w-full max-w-max-width flex-grow px-margin-mobile py-xxl md:px-margin-desktop">
      <div className="mb-xl flex flex-col justify-between gap-md border-b border-outline/10 pb-lg md:flex-row md:items-end">
        <div>
          <Link
            href="/checkout"
            className="mb-sm inline-flex items-center gap-xs font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Icon name="arrow_back" className="text-[18px]" />
            Back
          </Link>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background md:font-display-md md:text-display-md">
            Payment
          </h1>
        </div>
        <div className="flex items-center gap-md font-label-md text-label-md">
          {["Delivery", "Review"].map((step) => (
            <div key={step} className="flex items-center text-secondary">
              <span className="mr-xs flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                <Icon name="check" className="text-[14px] text-surface-container-lowest" />
              </span>
              <span className="uppercase tracking-widest">{step}</span>
              <div className="ml-md h-px w-8 bg-secondary/50" />
            </div>
          ))}
          <div className="flex items-center text-on-surface">
            <span className="mr-xs flex h-6 w-6 items-center justify-center rounded-full border-2 border-secondary">3</span>
            <span className="uppercase tracking-widest">Pay</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        <div className="flex flex-col gap-xl md:col-span-7">
          <p className="flex items-start gap-sm rounded-lg border border-secondary/30 bg-secondary/5 p-md font-body-md text-body-md text-on-surface-variant">
            <Icon name="info" className="mt-[2px] text-[18px] text-secondary" />
            <span>
              <span className="text-on-surface">Demo store — no payment is taken.</span> Choose any
              method; card details are never requested or collected.
            </span>
          </p>

          <section className="rounded-lg border border-outline-variant/30 bg-surface p-lg">
            <h2 className="mb-md flex items-center gap-sm border-b border-outline/10 pb-md font-title-lg text-title-lg text-on-surface">
              <Icon name="local_shipping" className="text-secondary" />
              Delivery speed
            </h2>
            <div className="grid grid-cols-1 gap-md sm:grid-cols-2" role="radiogroup" aria-label="Delivery speed">
              {(
                [
                  { id: "standard", label: "Standard", hint: "3–5 business days", price: subtotal - discount >= FREE_SHIPPING_FROM ? "Free" : formatAmount(15, currency) },
                  { id: "express", label: "Express", hint: "1–2 business days", price: formatAmount(30, currency) },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={speed === option.id}
                  onClick={() => setSpeed(option.id)}
                  className={cn(
                    "flex items-center justify-between rounded-lg border p-md text-left transition-colors",
                    speed === option.id ? "border-secondary bg-surface-container-low" : "border-outline/20 hover:border-outline/50",
                  )}
                >
                  <span>
                    <span className="block font-body-lg text-body-lg text-on-surface">{option.label}</span>
                    <span className="block font-body-md text-body-md text-on-surface-variant">{option.hint}</span>
                  </span>
                  <span className="font-title-lg text-title-lg text-on-surface">{option.price}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-outline-variant/30 bg-surface p-lg">
            <h2 className="mb-md flex items-center gap-sm border-b border-outline/10 pb-md font-title-lg text-title-lg text-on-surface">
              <Icon name="credit_card" className="text-secondary" />
              Payment method
            </h2>
            <div className="flex flex-col gap-md" role="radiogroup" aria-label="Payment method">
              {methods.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  role="radio"
                  aria-checked={method === option.id}
                  onClick={() => setMethod(option.id)}
                  className={cn(
                    "flex items-center gap-md rounded-lg border p-md text-left transition-colors",
                    method === option.id ? "border-secondary bg-surface-container-low" : "border-outline/20 hover:border-outline/50",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      method === option.id ? "border-secondary" : "border-outline/40",
                    )}
                  >
                    {method === option.id ? <span className="h-2 w-2 rounded-full bg-secondary" /> : null}
                  </span>
                  <Icon name={option.icon} className="text-[24px] text-on-surface-variant" />
                  <span>
                    <span className="block font-body-lg text-body-lg text-on-surface">{option.label}</span>
                    <span className="block font-body-md text-body-md text-on-surface-variant">{option.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-outline-variant/30 bg-surface p-lg">
            <div className="mb-sm flex items-center justify-between">
              <h2 className="flex items-center gap-sm font-title-lg text-title-lg text-on-surface">
                <Icon name="location_on" className="text-secondary" />
                Delivering to
              </h2>
              <Link href="/checkout" className="font-label-sm text-label-sm text-secondary underline underline-offset-4">
                Change
              </Link>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {selectedAddress
                ? `${selectedAddress.name}, ${selectedAddress.line1}${selectedAddress.line2 ? `, ${selectedAddress.line2}` : ""}, ${selectedAddress.city} ${selectedAddress.postalCode}, ${selectedAddress.country}`
                : ""}
            </p>
          </section>
        </div>

        <div className="md:col-span-5">
          <div className="sticky top-24 rounded-lg border border-outline-variant/30 bg-surface p-lg">
            <h2 className="mb-md border-b border-outline/10 pb-md font-title-lg text-title-lg text-on-surface">
              Order Summary
            </h2>
            <div className="mb-xl">
              <SummaryItems items={items} />
            </div>
            <div className="mb-md flex flex-col gap-sm border-b border-outline/10 pb-md font-body-md text-body-md text-on-surface-variant">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-on-surface">{formatAmount(subtotal, currency)}</span>
              </div>
              {discount > 0 ? (
                <div className="flex justify-between text-secondary">
                  <span>Promo ({promoCode})</span>
                  <span>−{formatAmount(discount, currency)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="text-on-surface">{shipping === 0 ? "Free" : formatAmount(shipping, currency)}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated tax</span>
                <span className="text-on-surface">{formatAmount(tax, currency)}</span>
              </div>
            </div>
            <div className="mb-xl flex items-end justify-between gap-sm pt-md">
              <span className="font-body-lg text-body-lg text-on-surface">Total</span>
              <span className="font-display-md text-[32px] leading-none text-on-surface">
                {formatAmount(total, currency)}
              </span>
            </div>
            <button
              type="button"
              onClick={pay}
              disabled={phase === "paying"}
              className="flex w-full items-center justify-center gap-sm rounded bg-secondary py-md font-title-lg text-title-lg text-on-secondary transition-colors hover:bg-secondary/90 disabled:cursor-wait disabled:opacity-80"
            >
              {phase === "paying" ? (
                <>
                  <Icon name="progress_activity" className="animate-spin" />
                  Processing payment…
                </>
              ) : (
                <>
                  <Icon name="lock" className="text-body-lg" />
                  {method === "cod" ? "Place Order" : `Pay ${formatAmount(total, currency)}`}
                </>
              )}
            </button>
            <p className="mt-md text-center font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              By placing your order you agree to the{" "}
              <Link href="/terms" className="underline underline-offset-2">
                terms
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
