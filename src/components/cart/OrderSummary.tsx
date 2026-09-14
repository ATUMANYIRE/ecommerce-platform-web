"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/ui/Icon";
import { formatAmount } from "@/lib/utils/currency";

const PROMO_CODE = "ATLAS10";

/**
 * Sticky order summary for the cart. Includes a demo promo code (ATLAS10 = 10%
 * off subtotal) so the Apply action has real behavior.
 */
export default function OrderSummary() {
  const { subtotal } = useCart();
  const [promo, setPromo] = useState("");
  const [discount, setDiscount] = useState(0);
  const [promoStatus, setPromoStatus] = useState<"idle" | "applied" | "invalid">(
    "idle",
  );

  function applyPromo() {
    const code = promo.trim().toUpperCase();
    if (code === PROMO_CODE) {
      setDiscount(subtotal * 0.1);
      setPromoStatus("applied");
    } else {
      setDiscount(0);
      setPromoStatus("invalid");
    }
  }

  const total = subtotal - discount;

  return (
    <div className="sticky top-xxl rounded-2xl border border-white/5 bg-surface-container-low p-lg shadow-[0_32px_64px_-12px_rgba(11,13,15,0.5)]">
      <h2 className="mb-lg font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
        Order Summary
      </h2>

      <div className="mb-lg flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant">
            Subtotal
          </span>
          <span className="font-body-md text-body-md text-on-surface">
            {formatAmount(subtotal, "USD")}
          </span>
        </div>
        {promoStatus === "applied" && (
          <div className="flex items-center justify-between">
            <span className="font-body-md text-body-md text-on-surface-variant">
              Promo ({PROMO_CODE})
            </span>
            <span className="font-body-md text-body-md text-secondary">
              −{formatAmount(discount, "USD")}
            </span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span className="font-body-md text-body-md text-on-surface-variant">
            Shipping
          </span>
          <span className="font-body-md text-body-md text-on-surface">
            Calculated at checkout
          </span>
        </div>
      </div>

      <div className="mb-xl flex items-baseline justify-between border-t border-white/10 pt-md">
        <span className="font-title-lg text-title-lg text-on-surface">Total</span>
        <span className="font-headline-lg text-headline-lg text-on-surface">
          {formatAmount(total, "USD")}
        </span>
      </div>

      <div className="mb-xl">
        <label
          className="mb-sm block font-label-sm text-label-sm text-on-surface uppercase"
          htmlFor="promo"
        >
          Promo Code
        </label>
        <div className="flex gap-sm">
          <input
            id="promo"
            type="text"
            value={promo}
            onChange={(e) => {
              setPromo(e.target.value);
              if (promoStatus !== "idle") setPromoStatus("idle");
            }}
            placeholder="Enter code"
            className="flex-grow border-0 border-b border-white/30 bg-surface px-0 py-sm font-body-md text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:border-white focus:ring-0 focus:outline-none"
          />
          <button
            type="button"
            onClick={applyPromo}
            className="shrink-0 rounded border border-secondary bg-transparent px-md py-sm font-label-md text-label-md uppercase tracking-wider text-secondary transition-colors hover:bg-secondary/10"
          >
            Apply
          </button>
        </div>
        {promoStatus === "applied" && (
          <p className="mt-sm font-label-sm text-label-sm text-secondary">
            Promo code applied.
          </p>
        )}
        {promoStatus === "invalid" && (
          <p className="mt-sm font-label-sm text-label-sm text-error">
            Invalid promotion code.
          </p>
        )}
      </div>

      <Link
        href="/checkout"
        className="flex w-full items-center justify-center gap-sm rounded bg-secondary px-xl py-md font-label-md text-label-md uppercase tracking-wider text-on-secondary transition-colors hover:bg-secondary-fixed-dim"
      >
        Proceed to Checkout
        <Icon name="arrow_forward" className="text-[16px]" />
      </Link>
    </div>
  );
}