"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAddresses } from "@/context/AddressContext";
import type { ShippingAddress } from "@/context/AddressContext";
import SummaryItems from "@/components/checkout/SummaryItems";
import Icon from "@/components/ui/Icon";
import { formatAmount } from "@/lib/utils/currency";
import { estimateTax } from "@/lib/checkout/tax";

const PROMO_CODE = "ATLAS10";

type CheckoutViewProps = {
  demoState?: "noaddress" | "empty" | "expiredpromo";
};

function EmptyCartOverlay({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-60 flex flex-col bg-background/95 backdrop-blur-md">
      <div className="flex items-center justify-between px-margin-mobile py-lg md:px-margin-desktop">
        <Link
          href="/"
          className="font-display-lg text-display-lg text-on-surface"
        >
          Atlas
        </Link>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close empty cart state"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 text-on-surface transition-colors hover:border-secondary hover:text-secondary"
        >
          <Icon name="close" className="text-[20px]" />
        </button>
      </div>
      <div className="mx-auto flex w-full max-w-max-width flex-grow flex-col items-center justify-center px-margin-mobile py-xxl text-center md:px-margin-desktop">
        <Icon
          name="remove_shopping_cart"
          className="mb-lg text-[64px] text-on-surface-variant opacity-50"
        />
        <h2 className="mb-md font-display-md text-display-md text-on-background">
          Your cart is empty
        </h2>
        <p className="mb-xl max-w-md font-body-lg text-body-lg text-on-surface-variant">
          It looks like you haven&apos;t added anything to your cart yet. Explore
          our collections to find premium items tailored for you.
        </p>
        <div className="flex w-full flex-col gap-md sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-on-surface/30 px-lg py-md font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-variant"
          >
            Return to Cart
          </button>
          <Link
            href="/"
            className="rounded bg-secondary px-lg py-md font-label-md text-label-md uppercase tracking-wider text-background transition-colors hover:bg-secondary-fixed"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

function EmptyCartToggle({ onToggle }: { onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="fixed right-6 bottom-6 z-50 flex items-center gap-sm rounded-full border border-outline-variant/50 bg-surface px-lg py-md font-label-md text-label-md uppercase tracking-wider text-on-surface shadow-lg transition-colors hover:border-secondary hover:text-secondary"
    >
      <Icon name="remove_shopping_cart" className="text-[16px]" />
      View Empty Cart State
    </button>
  );
}

function AddressCard({
  address,
  selected,
  onSelect,
}: {
  address: ShippingAddress;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`relative rounded-lg border p-lg text-left transition-colors ${
        selected
          ? "border-secondary bg-surface-container-low hover:border-secondary"
          : "border-outline/20 bg-surface-container-low hover:border-outline/50"
      }`}
    >
      {selected && (
        <Icon
          name="check_circle"
          className="absolute top-lg right-lg font-light text-secondary"
        />
      )}
      <h3 className="mb-xs pr-lg font-title-lg text-title-lg text-on-surface">
        {address.name}
      </h3>
      <p className="font-body-md text-body-md leading-relaxed text-on-surface-variant">
        {address.line1}
        <br />
        {address.line2 && (
          <>
            {address.line2}
            <br />
          </>
        )}
        {address.city}, {address.postalCode}
        <br />
        {address.country}
      </p>
    </button>
  );
}

/**
 * Two-step checkout (Delivery → Review). Delivery carries the address picker,
 * promo code and the sticky order summary; Review shows the narrow mobile
 * summary with estimated tax before handing off to the confirmation step.
 */
export default function CheckoutView({ demoState }: CheckoutViewProps) {
  const router = useRouter();
  const { items, subtotal } = useCart();
  const currency = items[0]?.currency ?? "USD";
  const { addresses, selectedAddress, selectAddress } = useAddresses();
  const [step, setStep] = useState<"delivery" | "review">("delivery");
  const [promo, setPromo] = useState(
    demoState === "expiredpromo" ? "HOLIDAY2023" : "",
  );
  const [promoError, setPromoError] = useState(
    demoState === "expiredpromo",
  );
  const [promoApplied, setPromoApplied] = useState(false);
  const [showEmpty, setShowEmpty] = useState(demoState === "empty");
  // Derived from the live subtotal so it stays correct if the cart changes after applying.
  const discount = promoApplied ? Math.round(subtotal * 10) / 100 : 0;

  const promoLocked = demoState === "expiredpromo";
  const noSaved =
    demoState === "noaddress" ||
    demoState === "expiredpromo" ||
    addresses.length === 0;
  const canPlaceOrder = !noSaved && selectedAddress !== null;

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    setPromoError(code !== PROMO_CODE);
    setPromoApplied(code === PROMO_CODE);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-max-width flex-grow flex-col items-center justify-center px-margin-mobile py-xxl text-center md:px-margin-desktop">
        <Icon
          name="remove_shopping_cart"
          className="mb-lg text-[64px] text-on-surface-variant opacity-50"
        />
        <h2 className="mb-md font-display-lg text-display-lg text-on-background">
          Your cart is empty
        </h2>
        <p className="mb-xl max-w-md font-body-lg text-body-lg text-on-surface-variant">
          It looks like you haven&apos;t added anything to your cart yet. Explore
          our collections to find premium items tailored for you.
        </p>
        <div className="flex w-full flex-col gap-md sm:w-auto sm:flex-row">
          <Link
            href="/cart"
            className="rounded border border-on-surface/30 px-lg py-md font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors hover:bg-surface-variant"
          >
            Return to Cart
          </Link>
          <Link
            href="/"
            className="rounded bg-secondary px-lg py-md font-label-md text-label-md uppercase tracking-wider text-background transition-colors hover:bg-secondary-fixed"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  const total = subtotal - discount;
  const tax = estimateTax(total);
  const totalDue = total + tax;

  if (step === "review") {
    return (
      <div className="mx-auto flex w-full max-w-[600px] flex-grow flex-col gap-md px-margin-mobile py-lg md:px-margin-mobile">
        <button
          type="button"
          onClick={() => setStep("delivery")}
          className="-ml-sm flex w-max items-center gap-sm p-sm text-on-surface-variant transition-colors hover:text-on-surface"
        >
          <Icon name="arrow_back" className="text-[20px]" />
          <span className="font-label-md text-label-md uppercase">Back</span>
        </button>

        <div className="flex flex-col gap-xl">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background">
            Review
          </h1>

          {/* Progress indicator */}
          <div className="relative flex w-full items-start justify-between">
            <div className="absolute left-0 top-3 h-px w-full -translate-y-1/2 bg-on-surface/10" />
            <div className="relative z-10 flex flex-col items-center gap-sm bg-background px-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
                <Icon
                  name="check"
                  className="text-[14px] text-surface-container-lowest"
                />
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary">
                Delivery
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-sm bg-background px-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-secondary bg-surface-container-low">
                <div className="h-2 w-2 rounded-full bg-secondary" />
              </div>
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface">
                Review
              </span>
            </div>
            <div className="relative z-10 flex flex-col items-center gap-sm bg-background px-sm">
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-on-surface/20 bg-surface-container-low" />
              <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                Complete
              </span>
            </div>
          </div>

          {/* Delivery address */}
          <section className="flex flex-col gap-md">
            <div className="flex items-end justify-between">
              <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                Delivery Address
              </h2>
              <button
                type="button"
                onClick={() => setStep("delivery")}
                className="font-label-sm text-label-sm text-secondary underline decoration-secondary/30 underline-offset-4 transition-colors hover:text-secondary-fixed"
              >
                Edit
              </button>
            </div>
            {selectedAddress && (
              <div className="flex items-start gap-md rounded-lg border border-on-surface/5 bg-surface-container-low p-lg shadow-[0_32px_64px_rgba(11,14,18,0.5)]">
                <span>
                  <Icon name="location_on" className="mt-xs text-secondary" />
                </span>
                <div className="flex flex-col gap-xs font-body-lg text-body-lg text-on-surface">
                  <span className="font-title-lg text-title-lg">
                    {selectedAddress.name}
                  </span>
                  <span className="mt-xs font-body-md text-body-md text-on-surface-variant">
                    {selectedAddress.line1}
                    {selectedAddress.line2
                      ? `, ${selectedAddress.line2}`
                      : ""}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {selectedAddress.city}, {selectedAddress.postalCode}
                  </span>
                  <span className="font-body-md text-body-md text-on-surface-variant">
                    {selectedAddress.country}
                  </span>
                </div>
              </div>
            )}
          </section>

          {/* Order summary */}
          <section className="flex flex-col gap-md pb-8">
            <h2 className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              Order Summary
            </h2>
            <div className="flex flex-col gap-lg rounded-lg border border-on-surface/5 bg-surface-container-low p-lg shadow-[0_32px_64px_rgba(11,14,18,0.5)]">
              <SummaryItems items={items} />
              <div className="h-px w-full bg-on-surface/10" />
              <div className="flex flex-col gap-sm font-body-md text-body-md text-on-surface-variant">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-on-surface">
                    {formatAmount(subtotal, currency)}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span>Promo ({PROMO_CODE})</span>
                    <span className="text-secondary">
                      −{formatAmount(discount, currency)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-on-surface">Calculated next step</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="text-on-surface">
                    {formatAmount(tax, currency)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Bottom action bar */}
        <div className="sticky bottom-0 z-10 mt-auto border-t border-on-surface/10 bg-surface-container-lowest/95 pt-md backdrop-blur-md">
          <div className="flex items-end justify-between px-xs pb-md">
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              Total Due
            </span>
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-secondary">
              {formatAmount(totalDue, currency)}
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              router.push(
                promoApplied ? `/checkout/payment?promo=${PROMO_CODE}` : "/checkout/payment",
              )
            }
            className="flex w-full items-center justify-center gap-sm rounded bg-secondary py-md font-title-lg text-title-lg text-surface-container-lowest shadow-[0_4px_14px_0_rgba(201,168,106,0.2)] transition-colors hover:bg-secondary-fixed"
          >
            Continue to Payment
            <Icon name="arrow_forward" />
          </button>
        </div>
        {demoState === "empty" &&
          (showEmpty ? (
            <EmptyCartOverlay onClose={() => setShowEmpty(false)} />
          ) : (
            <EmptyCartToggle onToggle={() => setShowEmpty(true)} />
          ))}
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-max-width flex-grow px-margin-mobile py-xxl md:px-margin-desktop">
      {/* Page header + progress */}
      <div className="mb-xl flex flex-col justify-between gap-md border-b border-outline/10 pb-lg md:flex-row md:items-end">
        <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-background md:font-display-md md:text-display-md">
          Checkout
        </h1>
        <div className="flex items-center gap-md font-label-md text-label-md">
          <div className="flex items-center text-secondary">
            <span className="mr-xs flex h-6 w-6 items-center justify-center rounded-full border-2 border-secondary">
              1
            </span>
            <span className="uppercase tracking-widest">Delivery</span>
          </div>
          <div className="h-px w-8 bg-outline/30" />
          <div className="flex items-center text-on-surface-variant">
            <span className="mr-xs flex h-6 w-6 items-center justify-center rounded-full border-2 border-outline/30">
              2
            </span>
            <span className="uppercase tracking-widest">Review</span>
          </div>
          <div className="h-px w-8 bg-outline/30" />
          <div className="flex items-center text-on-surface-variant">
            <span className="mr-xs flex h-6 w-6 items-center justify-center rounded-full border-2 border-outline/30">
              3
            </span>
            <span className="uppercase tracking-widest">Complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-gutter md:grid-cols-12">
        {/* Left column */}
        <div className="flex flex-col gap-xl md:col-span-7">
          <section className="rounded-lg border border-outline-variant/30 bg-surface p-lg">
            <div className="mb-md flex items-center justify-between border-b border-outline/10 pb-md">
              <h2 className="flex items-center gap-sm font-title-lg text-title-lg text-on-surface">
                <Icon name="local_shipping" className="text-secondary" />
                Delivery Details
              </h2>
            </div>

            {noSaved ? (
              <div className="flex flex-col items-center justify-center px-lg py-xxl text-center">
                <div className="mb-md grid h-16 w-16 place-items-center rounded-full bg-surface-container">
                  <Icon
                    name="location_off"
                    className="text-3xl text-on-surface-variant"
                  />
                </div>
                <h3 className="mb-sm font-title-lg text-title-lg text-on-surface">
                  No saved addresses
                </h3>
                <p className="mb-lg max-w-md font-body-md text-body-md text-on-surface-variant">
                  Add a delivery address to continue your checkout process and
                  receive your items.
                </p>
                <Link
                  href="/checkout/address"
                  className="rounded bg-secondary px-lg py-md font-label-md text-label-md uppercase tracking-wider text-background transition-colors hover:bg-secondary-fixed"
                >
                  Add Address
                </Link>
              </div>
            ) : (
              <>
                <div className="mb-lg grid grid-cols-1 gap-md md:grid-cols-2">
                  {addresses.map((address) => (
                    <AddressCard
                      key={address.id}
                      address={address}
                      selected={selectedAddress?.id === address.id}
                      onSelect={() => selectAddress(address.id)}
                    />
                  ))}
                </div>
                <Link
                  href="/checkout/address"
                  className="inline-flex items-center justify-center gap-xs rounded border border-inverse-surface px-lg py-md font-label-md text-label-md uppercase transition-all hover:border-secondary hover:text-secondary"
                >
                  <Icon name="add" className="text-[16px]" />
                  Add New Address
                </Link>
              </>
            )}
          </section>

          <section
            className={`rounded-lg border border-outline-variant/30 bg-surface p-lg transition-opacity ${
              noSaved ? "opacity-50" : ""
            }`}
          >
            <div className="mb-md flex items-center justify-between border-b border-outline/10 pb-md">
              <h2 className="flex items-center gap-sm font-title-lg text-title-lg text-on-surface">
                <Icon name="credit_card" className="text-secondary" />
                Payment Method
              </h2>
            </div>
            <div className="py-xs">
              <p className="font-body-md text-body-md text-on-surface-variant">
                {noSaved
                  ? "Requires delivery address."
                  : "Payment will be securely completed at the review step."}
              </p>
            </div>
          </section>
        </div>

        {/* Right column: order summary */}
        <div className="md:col-span-5">
          <div className="sticky top-24 rounded-lg border border-outline-variant/30 bg-surface p-lg">
            <h2 className="mb-md border-b border-outline/10 pb-md font-title-lg text-title-lg text-on-surface">
              Order Summary
            </h2>
            <div className="mb-xl">
              <SummaryItems items={items} />
            </div>

            <div className="mb-lg">
              <label className="mb-sm block font-label-md text-label-md uppercase text-on-surface">
                Promo Code
              </label>
              <div className="flex gap-sm">
                <input
                  type="text"
                  value={promo}
                  readOnly={promoLocked}
                  onChange={(e) => {
                    setPromo(e.target.value);
                    if (promoError) setPromoError(false);
                  }}
                  placeholder="Enter code"
                  className={`w-full rounded-t border-b bg-surface-container-high px-md py-sm font-body-md text-body-md text-on-surface outline-none placeholder:text-on-surface-variant/50 ${
                    promoError
                      ? "border-error"
                      : "border-on-surface/20 focus:border-on-surface"
                  }`}
                />
                <button
                  type="button"
                  onClick={applyPromo}
                  disabled={promoLocked}
                  className={`rounded border bg-surface-container-high px-lg font-label-md text-label-md uppercase transition-colors ${
                    promoLocked
                      ? "cursor-not-allowed border-outline-variant/50 text-on-surface-variant/40"
                      : "border-transparent text-on-surface hover:text-secondary"
                  }`}
                >
                  Apply
                </button>
              </div>
              {promoError && (
                <div className="mt-sm flex items-center gap-xs font-label-sm text-label-sm text-error">
                  <Icon name="error" className="text-[14px]" />
                  {promoLocked
                    ? "Invalid promotion: code has expired"
                    : "Invalid promotion code."}
                </div>
              )}
              {!promoError && discount > 0 && (
                <div className="mt-sm font-label-sm text-label-sm text-secondary">
                  Promo code applied.
                </div>
              )}
            </div>

            <div className="mb-md flex flex-col gap-md border-b border-outline/10 pb-md font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-body-lg text-body-lg text-on-surface">
                  {formatAmount(subtotal, currency)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex items-center justify-between text-secondary">
                  <span>Promo ({PROMO_CODE})</span>
                  <span>−{formatAmount(discount, currency)}</span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Shipping</span>
                <span className="text-on-surface">Pending</span>
              </div>
            </div>

            <div className="mb-xl flex items-end justify-between gap-sm pt-md">
              <span className="font-body-lg text-body-lg text-on-surface">
                Total
              </span>
              <span className="font-display-md text-[32px] leading-none text-on-surface">
                {formatAmount(total, currency)}
              </span>
            </div>

            <button
              type="button"
              onClick={() => setStep("review")}
              disabled={!canPlaceOrder}
              className={`flex w-full items-center justify-center gap-sm rounded py-md font-title-lg text-title-lg transition-colors ${
                canPlaceOrder
                  ? "bg-secondary text-on-secondary hover:bg-secondary/90"
                  : "cursor-not-allowed border border-outline-variant/30 bg-surface-variant text-on-surface-variant"
              }`}
            >
              Place Order
              <Icon name="arrow_forward" className="text-body-lg" />
            </button>
            <div className="mt-md flex items-center justify-center gap-xs text-on-surface-variant">
              <Icon name="lock" className="text-[16px]" />
              <span className="font-label-sm text-label-sm uppercase tracking-wider">
                Secure Checkout
              </span>
            </div>
          </div>
        </div>
      </div>
      {demoState === "empty" &&
        (showEmpty ? (
          <EmptyCartOverlay onClose={() => setShowEmpty(false)} />
        ) : (
          <EmptyCartToggle onToggle={() => setShowEmpty(true)} />
        ))}
    </div>
  );
}