"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Icon from "@/components/ui/Icon";

type ProductActionsProps = {
  sku: string;
  name?: string;
  price?: number;
  currency?: string;
  image?: string;
  category?: string;
  disabled?: boolean;
};

type CartState = "idle" | "added";

export default function ProductActions({
  sku,
  name,
  price,
  currency,
  image,
  category,
  disabled = false,
}: ProductActionsProps) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const wishlisted = has(sku);
  const [quantity, setQuantity] = useState(1);
  const [cartState, setCartState] = useState<CartState>("idle");
  const [notify, setNotify] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  function adjustQuantity(delta: number) {
    setQuantity((q) => Math.max(1, q + delta));
  }

  function addToCart() {
    if (cartState === "added") return;
    addItem(
      sku,
      quantity,
      name !== undefined && price !== undefined && currency !== undefined
        ? { name, price, currency, image, category }
        : undefined,
    );
    setCartState("added");
    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCartState("idle"), 2000);
  }

  function toggleWishlist() {
    toggle(sku);
  }

  const cartLabel = cartState === "added" ? "Added to Cart" : "Add to Cart";

  if (disabled) {
    return (
      <div className="flex flex-col gap-md pt-md">
        <div className="flex items-center gap-sm text-error">
          <Icon name="error_outline" className="text-[20px]" />
          <span className="font-label-md text-label-md uppercase tracking-widest">
            Out of Stock
          </span>
        </div>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="flex w-full items-center justify-center gap-sm rounded bg-surface-variant py-md font-label-md text-label-md uppercase tracking-widest text-outline opacity-70 transition-colors duration-300"
        >
          Unavailable
        </button>
        <p className="text-center">
          {notify ? (
            <span role="status" className="inline-flex items-center gap-xs font-body-md text-body-md text-secondary">
              <Icon name="mark_email_read" className="text-[18px]" />
              We&apos;ll e-mail you when it&apos;s back in stock.
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setNotify(true)}
              className="font-body-md text-body-md text-on-surface-variant underline underline-offset-4 transition-colors hover:text-on-surface"
            >
              Notify me when available
            </button>
          )}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-xs">
        <label
          htmlFor="quantity"
          className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant"
        >
          Quantity
        </label>
        <div className="flex w-max items-center border-b border-on-surface/30 bg-surface transition-colors focus-within:border-on-surface">
          <button
            type="button"
            onClick={() => adjustQuantity(-1)}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="p-2 text-on-surface-variant transition-colors hover:text-on-surface disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Icon name="remove" />
          </button>
          <span className="w-8 text-center font-body-md text-body-md text-on-surface">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => adjustQuantity(1)}
            aria-label="Increase quantity"
            className="p-2 text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <Icon name="add" />
          </button>
        </div>
      </div>

      <div className="mt-md flex items-center gap-md">
        <button
          type="button"
          onClick={addToCart}
          className="flex-1 rounded bg-secondary py-4 text-center font-label-md text-label-md uppercase tracking-widest text-background transition-colors hover:bg-secondary-fixed"
        >
          {cartLabel}
        </button>
        <button
          type="button"
          onClick={toggleWishlist}
          aria-pressed={wishlisted}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="flex items-center justify-center rounded border border-outline-variant p-4 text-on-surface-variant transition-all hover:border-on-surface hover:text-on-surface"
        >
          <Icon name={wishlisted ? "favorite" : "favorite_border"} />
        </button>
      </div>
    </>
  );
}