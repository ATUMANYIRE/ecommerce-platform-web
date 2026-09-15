"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useWishlist } from "@/context/WishlistContext";
import { fetchWishlistProduct, resolveWishlistProduct } from "@/lib/wishlist/catalog";
import type { WishlistProduct } from "@/lib/wishlist/catalog";
import WishlistCard from "@/components/wishlist/WishlistCard";
import Icon from "@/components/ui/Icon";

type WishlistViewProps = {
  demoState?: "auth" | "error";
};

function StatePanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="glass-panel w-full max-w-2xl rounded-xl p-xxl shadow-[0_32px_64px_-16px_rgba(17,20,24,0.5)]">
        {children}
      </div>
    </div>
  );
}

function StateCircle({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mb-lg grid h-24 w-24 place-items-center rounded-full border border-outline-variant/20 bg-surface-container-low shadow-inner">
      {children}
    </div>
  );
}

/**
 * Renders the wishlist page. The filled grid is driven by the shared store;
 * the empty / auth / error panels are also reachable via ?state=auth and
 * ?state=error demo params (mirroring the cart's ?state=error).
 */
export default function WishlistView({ demoState }: WishlistViewProps) {
  const router = useRouter();
  const { skus } = useWishlist();
  // Catalog lookups for saved SKUs outside the demo catalog; null = not found.
  const [fetched, setFetched] = useState<Record<string, WishlistProduct | null>>({});
  const unresolved = skus.filter(
    (sku) => resolveWishlistProduct(sku) === null && !(sku in fetched),
  );
  const unresolvedKey = unresolved.join(",");

  useEffect(() => {
    if (!unresolvedKey) return;
    let cancelled = false;
    const pending = unresolvedKey.split(",");
    Promise.all(
      pending.map(async (sku) => [sku, await fetchWishlistProduct(sku)] as const),
    ).then((entries) => {
      if (!cancelled) {
        setFetched((previous) => ({ ...previous, ...Object.fromEntries(entries) }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [unresolvedKey]);

  if (demoState === "auth") {
    return (
      <div className="mx-auto flex w-full max-w-max-width flex-grow flex-col items-center justify-center px-margin-mobile py-xxl md:px-margin-desktop">
        <StatePanel>
          <StateCircle>
            <span className="material-symbols-outlined text-4xl text-outline">
              lock
            </span>
            <div className="absolute -bottom-2 -right-2 rounded-full border border-outline-variant/20 bg-surface-container-low p-1">
              <span
                className="material-symbols-outlined text-sm text-secondary"
                aria-hidden="true"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                favorite
              </span>
            </div>
          </StateCircle>
          <h1 className="mb-md font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:text-headline-lg">
            Sign in to view your wishlist
          </h1>
          <p className="mb-xl max-w-md font-body-lg text-body-lg text-on-surface-variant">
            Saving products requires an account. Sign in to access your curated
            collections across all devices.
          </p>
          <div className="flex w-full flex-col justify-center gap-md sm:flex-row">
            <button
              type="button"
              className="flex w-full items-center justify-center rounded bg-champagne px-8 py-4 font-label-md text-label-md uppercase tracking-widest text-obsidian transition-colors hover:bg-secondary-fixed sm:w-auto"
            >
              Sign In
            </button>
            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded border border-ivory px-8 py-4 font-label-md text-label-md uppercase tracking-widest text-ivory transition-colors hover:bg-white/5 sm:w-auto"
            >
              Create Account
            </button>
          </div>
        </StatePanel>
      </div>
    );
  }

  if (demoState === "error") {
    return (
      <div className="mx-auto flex w-full max-w-max-width flex-grow flex-col items-center justify-center px-margin-mobile py-xxl md:px-margin-desktop">
        <StatePanel>
          <StateCircle>
            <span
              className="material-symbols-outlined text-5xl text-outline opacity-80"
              aria-hidden="true"
            >
              cloud_off
            </span>
          </StateCircle>
          <h1 className="mb-md max-w-lg font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:text-headline-lg">
            Something went wrong while loading your wishlist.
          </h1>
          <p className="mb-xl max-w-md font-body-lg text-body-lg text-on-surface-variant">
            We&apos;re having trouble connecting to the server. Please try again
            or continue browsing the marketplace.
          </p>
          <div className="flex w-full flex-col justify-center gap-md sm:flex-row">
            <button
              type="button"
              onClick={() => router.replace("/wishlist")}
              className="flex w-full items-center justify-center rounded bg-secondary px-xl py-md font-label-md text-label-md uppercase tracking-widest text-on-secondary-fixed transition-colors hover:bg-secondary-fixed sm:w-auto"
            >
              Retry
            </button>
            <Link
              href="/"
              className="flex w-full items-center justify-center rounded border border-tertiary-fixed px-xl py-md font-label-md text-label-md uppercase tracking-widest text-tertiary-fixed transition-colors hover:bg-surface-container-high sm:w-auto"
            >
              Continue Shopping
            </Link>
          </div>
        </StatePanel>
      </div>
    );
  }

  const resolvedProducts = skus
    .map((sku) => resolveWishlistProduct(sku) ?? fetched[sku] ?? null)
    .filter((product): product is WishlistProduct => product !== null);

  if (resolvedProducts.length === 0 && unresolved.length > 0) {
    // Still looking the saved items up; avoid flashing the empty state.
    return <div className="flex-grow" aria-busy="true" />;
  }

  if (skus.length === 0 || resolvedProducts.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-max-width flex-grow flex-col items-center justify-center px-margin-mobile py-xxl md:px-margin-desktop">
        <StatePanel>
          <StateCircle>
            <Icon name="favorite_border" className="text-4xl text-outline" />
          </StateCircle>
          <h1 className="mb-md font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:text-headline-lg">
            Your wishlist is empty
          </h1>
          <p className="mb-xl max-w-md font-body-lg text-body-lg text-on-surface-variant">
            Save products you love and find them here later. Curate your perfect
            collection of premium goods.
          </p>
          <div className="flex w-full flex-col justify-center gap-md sm:flex-row">
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded bg-champagne px-8 py-4 font-label-md text-label-md uppercase tracking-widest text-obsidian transition-colors hover:bg-secondary-fixed sm:w-auto"
            >
              Start Shopping
              <Icon name="arrow_forward" className="text-[16px]" />
            </Link>
            <Link
              href="/#promo"
              className="flex w-full items-center justify-center gap-2 rounded border border-ivory px-8 py-4 font-label-md text-label-md uppercase tracking-widest text-ivory transition-colors hover:bg-white/5 sm:w-auto"
            >
              Explore Deals
            </Link>
          </div>
        </StatePanel>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-xxl px-margin-mobile pt-xl pb-xxl md:px-margin-desktop">
      <header className="flex flex-col gap-sm">
        <h1 className="font-display-lg text-display-lg text-on-surface">
          My Wishlist
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Products you&apos;ve saved for later.
        </p>
      </header>

      <div className="grid w-full grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        {resolvedProducts.map((product) => (
          <WishlistCard key={product.sku} product={product} />
        ))}
      </div>
    </div>
  );
}