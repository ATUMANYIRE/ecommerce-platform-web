"use client";

import Icon from "@/components/ui/Icon";
import { SellerDrawer } from "@/components/seller/SellerSidebar";
import { useState } from "react";

export default function SellerTopBar() {
  const [menuOpen, setMenuOpen] = useState(false);

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
            Atlas
          </span>
        </div>

        <div className="hidden md:flex items-center">
          <span className="font-title-lg text-title-lg text-on-surface">
            Overview
          </span>
        </div>

        <div className="flex items-center gap-md md:gap-lg ml-auto">
          <button
            type="button"
            aria-label="Search"
            className="text-on-surface-variant transition-colors duration-200 hover:text-primary"
          >
            <Icon name="search" />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative text-on-surface-variant transition-colors duration-200 hover:text-primary"
          >
            <Icon name="notifications" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-secondary" />
          </button>
          <button
            type="button"
            className="hidden items-center gap-sm rounded bg-champagne px-lg py-sm font-label-md text-label-md uppercase text-obsidian transition-opacity hover:opacity-90 sm:flex"
          >
            <Icon name="add" className="text-[18px]" />
            Add Product
          </button>
        </div>
      </header>

      <div className="md:hidden">
        <SellerDrawer
          open={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      </div>
    </>
  );
}