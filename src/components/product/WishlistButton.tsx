"use client";

import { cn } from "@/lib/utils/cn";
import { useWishlist } from "@/context/WishlistContext";
import Icon from "@/components/ui/Icon";

type WishlistButtonProps = {
  productId: string;
  className?: string;
};

/**
 * Wishlist toggle backed by the shared wishlist store, so hearts persist
 * across pages and feed the /wishlist page.
 */
export default function WishlistButton({
  productId,
  className,
}: WishlistButtonProps) {
  const { has, toggle } = useWishlist();
  const active = has(productId);

  return (
    <button
      type="button"
      data-product-id={productId}
      onClick={() => toggle(productId)}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-background/50 p-2 backdrop-blur-sm transition-colors",
        active ? "text-secondary" : "text-on-surface-variant hover:text-secondary",
        className,
      )}
    >
      <Icon name={active ? "favorite" : "favorite_border"} />
    </button>
  );
}