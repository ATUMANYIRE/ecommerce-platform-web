"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import { SellerDrawer } from "@/components/seller/SellerSidebar";
import { getActiveNavItem, sellerNav } from "@/components/seller/nav";
import type { DashboardNav } from "@/components/seller/nav";

export default function SellerTopBar({ nav = sellerNav }: { nav?: DashboardNav }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const active = getActiveNavItem(nav.items, pathname);

  return (
    <>
      <header className="sticky top-0 z-30 flex w-full items-center justify-between border-b border-outline-variant/20 bg-surface/90 px-margin-mobile py-md backdrop-blur-md md:px-margin-desktop">
        <div className="flex items-center gap-md md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMenuOpen(true)}
            className="rounded p-sm text-on-surface transition-colors hover:bg-surface-variant"
          >
            <Icon name="menu" />
          </button>
          <span className="font-headline-lg-mobile text-headline-lg-mobile text-primary">
            {nav.title}
          </span>
        </div>

        <div className="hidden items-center md:flex">
          <span className="font-title-lg text-title-lg text-on-surface">
            {active.label}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-md md:gap-lg">
          <Link
            href="/"
            aria-label="View store"
            title="View store"
            className="text-on-surface-variant transition-colors duration-200 hover:text-primary"
          >
            <Icon name="open_in_new" />
          </Link>
          <Link
            href="/account/notifications"
            aria-label="Notifications"
            className="relative text-on-surface-variant transition-colors duration-200 hover:text-primary"
          >
            <Icon name="notifications" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary" />
          </Link>
          {nav.cta ? (
            <Link
              href={nav.cta.href}
              className="hidden items-center gap-sm rounded bg-champagne px-lg py-sm font-label-md text-label-md uppercase text-obsidian transition-opacity hover:opacity-90 sm:flex"
            >
              <Icon name="add" className="text-[18px]" />
              {nav.cta.label}
            </Link>
          ) : null}
        </div>
      </header>

      <div className="md:hidden">
        <SellerDrawer nav={nav} open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
    </>
  );
}
