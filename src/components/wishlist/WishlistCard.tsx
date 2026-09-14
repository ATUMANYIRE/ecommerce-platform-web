"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { WishlistProduct } from "@/lib/wishlist/catalog";
import { isUnoptimizedImage } from "@/lib/utils/image";

type WishlistCardProps = {
  product: WishlistProduct;
};

export default function WishlistCard({ product }: WishlistCardProps) {
  const { addItem } = useCart();
  const { remove } = useWishlist();
  const [adding, setAdding] = useState(false);
  const [removing, setRemoving] = useState(false);
  const addTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const removeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const outOfStock = product.stockState === "out";
  const href = `/products/${encodeURIComponent(product.sku)}`;

  useEffect(() => {
    return () => {
      if (addTimer.current) clearTimeout(addTimer.current);
      if (removeTimer.current) clearTimeout(removeTimer.current);
    };
  }, []);

  function handleAddToCart() {
    if (adding || outOfStock) return;
    addItem(product.sku, 1, {
      name: product.name,
      price: product.price,
      currency: product.currency,
      image: product.image,
      category: product.category,
    });
    setAdding(true);
    if (addTimer.current) clearTimeout(addTimer.current);
    addTimer.current = setTimeout(() => setAdding(false), 1400);
  }

  function handleRemove() {
    if (removing) return;
    setRemoving(true);
    if (removeTimer.current) clearTimeout(removeTimer.current);
    removeTimer.current = setTimeout(() => remove(product.sku), 600);
  }

  return (
    <article
      className={`group relative flex h-full flex-col overflow-hidden rounded border border-white/5 bg-surface-container-low shadow-[0_32px_64px_-12px_rgba(17,20,24,0.4)] ${outOfStock ? "opacity-70" : ""} ${removing ? "fade-out" : ""}`}
    >
      {(adding || removing) && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-surface/50 backdrop-blur-[2px]">
          <span
            className={`loading-dots font-label-md text-label-md uppercase tracking-widest ${adding ? "text-secondary" : "text-on-surface"}`}
          >
            {adding ? "Adding" : "Removing"}
          </span>
        </div>
      )}

      <div
        className={`relative aspect-square overflow-hidden bg-obsidian p-md ${removing ? "blur-[1px]" : ""}`}
      >
        <Link
          href={href}
          aria-label={product.name}
          className="block h-full w-full"
        >
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized={isUnoptimizedImage(product.image)}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${outOfStock ? "grayscale" : ""}`}
          />
        </Link>
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(255,255,255,0.02)]" />
        <button
          type="button"
          onClick={handleRemove}
          aria-label={`Remove ${product.name} from wishlist`}
          className="absolute top-md right-md z-10 grid h-9 w-9 place-items-center rounded-full bg-background/50 text-secondary backdrop-blur-sm transition-all hover:bg-background/80"
        >
          <span
            className="material-symbols-outlined text-lg"
            aria-hidden="true"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
        </button>
      </div>

      <div
        className={`flex flex-grow flex-col gap-md p-lg ${removing ? "pointer-events-none opacity-50" : ""}`}
      >
        <div className="flex flex-col gap-xs">
          <h2 className="line-clamp-2 font-title-lg text-title-lg text-on-surface">
            <Link href={href} className="transition-colors hover:text-secondary">
              {product.name}
            </Link>
          </h2>
          <div className="flex items-baseline gap-xs">
            <span className="font-display-md text-headline-lg text-on-surface">
              {product.price.toLocaleString("en-US")}
            </span>
            <span className="font-body-md text-body-md text-on-surface-variant">
              {product.currency}
            </span>
          </div>

          {product.stockState === "in" && (
            <span className="mt-md font-label-sm text-label-sm uppercase tracking-widest text-secondary/80">
              In Stock
            </span>
          )}
          {product.stockState === "low" && (
            <span className="mt-md font-label-sm text-label-sm uppercase tracking-widest text-error">
              Only {product.stockLeft} left
            </span>
          )}
          {outOfStock && (
            <span className="mt-md font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
              Currently Unavailable
            </span>
          )}
        </div>

        {outOfStock ? (
          <button
            type="button"
            disabled
            aria-disabled="true"
            className="mt-auto w-full cursor-not-allowed rounded border border-ivory/30 bg-transparent py-3 font-label-md text-label-md uppercase tracking-widest text-ivory"
          >
            Out of Stock
          </button>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            className="mt-auto w-full rounded bg-champagne py-3 font-label-md text-label-md uppercase tracking-widest text-obsidian transition-colors hover:bg-secondary-fixed"
          >
            Add to Cart
          </button>
        )}
      </div>
    </article>
  );
}