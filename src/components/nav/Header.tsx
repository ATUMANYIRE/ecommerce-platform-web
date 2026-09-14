"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { autocomplete } from "@/lib/api/search";
import { trendingProducts, mixedProducts } from "@/lib/demo-data";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import type { Suggestion } from "@/types/product";
import Icon from "@/components/ui/Icon";

const demoProducts = [...trendingProducts, ...mixedProducts];

function demoMatches(trimmed: string): Suggestion[] {
  const q = trimmed.toLowerCase();
  return demoProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q),
    )
    .map((p) => ({ productId: p.sku, sku: p.sku, name: p.name }));
}

const navLinks = [
  { label: "Shop", href: "/search?q=*" },
  // Sections of the home page; a bare "#categories" did nothing on any other page.
  { label: "Categories", href: "/#categories" },
  { label: "Deals", href: "/#promo" },
];

export default function Header() {
  const router = useRouter();
  const { totalCount: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    debounceRef.current = setTimeout(async () => {
      let suggestions = demoMatches(trimmed);
      try {
        const res = await autocomplete(trimmed);
        if (res.suggestions.length > 0) suggestions = res.suggestions;
      } catch {
        // fall back to demo matches
      }
      setSuggestions(suggestions);
      setOpen(suggestions.length > 0);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background shadow-sm shadow-background/50">
      {/* Desktop */}
      <div className="mx-auto hidden w-full max-w-max-width items-center justify-between px-margin-desktop py-md md:flex">
        <div className="flex items-center gap-xl">
          <Link
            href="/"
            className="font-display-md text-display-md tracking-tighter text-on-surface"
          >
            ATLAS
          </Link>
          <nav className="flex gap-lg">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="font-body-md text-body-md uppercase tracking-wider text-on-surface-variant transition-colors duration-300 hover:text-primary hover:text-on-surface"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-lg">
          <div ref={searchRef} className="group relative w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-on-surface-variant">
              search
            </span>
            <form onSubmit={handleSubmit}>
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  if (e.target.value.trim().length < 2) {
                    setSuggestions([]);
                    setOpen(false);
                  } else {
                    setOpen(true);
                  }
                }}
                placeholder="Search..."
                type="text"
                maxLength={200}
                className="w-full border-b border-white/30 bg-surface-container-highest py-2 pl-10 pr-4 text-sm text-on-surface transition-colors focus:border-white focus:outline-none placeholder:text-on-surface-variant"
                aria-label="Search"
              />
            </form>
            {open && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded border border-white/10 bg-surface-container-high shadow-lg">
                <div className="bg-surface-container px-4 py-2 font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                  Suggestions
                </div>
                {suggestions.map((s) => (
                  <button
                    key={s.productId}
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      router.push(`/products/${encodeURIComponent(s.sku)}`);
                    }}
                    className="block w-full px-4 py-2 text-left font-body-md text-body-md text-on-surface transition-colors hover:bg-surface-container-highest"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-md">
            <Link
              href="/wishlist"
              aria-label={`Wishlist, ${wishlistCount} items`}
              className="relative text-on-surface transition-opacity hover:text-primary active:opacity-80"
            >
              <Icon name={wishlistCount > 0 ? "favorite" : "favorite_border"} />
              {wishlistCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary-fixed">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              aria-label="Account"
              className="text-on-surface transition-opacity hover:text-primary active:opacity-80"
            >
              <Icon name="person" />
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart, ${cartCount} items`}
              className="relative text-on-surface transition-opacity hover:text-primary active:opacity-80"
            >
              <Icon name="shopping_bag" />
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary-fixed">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile */}
      <div className="flex items-center justify-between px-margin-mobile py-md md:hidden">
        <Link href="/" className="font-display-md text-headline-lg-mobile tracking-tighter text-on-surface">
          ATLAS
        </Link>
        <div className="flex items-center gap-md">
          {/* Was a button with no action; the search page has the full filter panel. */}
          <Link href="/search?q=*" aria-label="Search" className="text-on-surface">
            <Icon name="search" />
          </Link>
          <Link
            href="/wishlist"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative text-on-surface"
          >
            <Icon name={wishlistCount > 0 ? "favorite" : "favorite_border"} />
            {wishlistCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary-fixed">
                {wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart, ${cartCount} items`}
            className="relative text-on-surface"
          >
            <Icon name="shopping_bag" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-secondary text-[10px] font-bold text-on-secondary-fixed">
                {cartCount}
              </span>
            )}
          </Link>
          <button type="button" aria-label="Menu" className="text-on-surface">
            <Icon name="menu" />
          </button>
        </div>
      </div>
    </header>
  );
}
