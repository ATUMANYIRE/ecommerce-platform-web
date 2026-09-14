"use client";

import Image from "next/image";
import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

export type AccountSection =
  | "overview"
  | "orders"
  | "wishlist"
  | "addresses"
  | "settings";

const avatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXu0U96xvZLTD0NZM9SYmxLnWZIc3DOREJsSn0eakqMXCQA47GbpLHhI6bjvpRPDo9E9mm4Fbp2PEVwNp0iS6vtttOFiP9z1n0ArBfBwePqEccCs5WIZX_WjAxE5AfAxkN1rV9IJQ_P2m34c-Wg0vUJGcST1DnvHjQ1H4LNexP_9t0Kxu-GXBusl_2j0ApM6UYdQEI9x7nRheY-ZGyKXFZ9seYlUaO6eWLTz4rt_bphDd9GXH34rHk5lEHa2BmVe-uWa1rFnrgR1H-EUX2lF7QBn5O7of-Dn9Rod_m2b0xA9qJ4ME9H-eBcSfBwC7ubPipX2dIGAKAf4QmvU";

const navItems: { id: AccountSection; label: string; icon: IconName; href: string }[] = [
  { id: "overview", label: "Overview", icon: "dashboard", href: "/account" },
  { id: "orders", label: "Orders", icon: "shopping_cart", href: "/account/orders" },
  { id: "wishlist", label: "Wishlist", icon: "favorite", href: "/account/wishlist" },
  { id: "addresses", label: "Addresses", icon: "location_on", href: "/account/addresses" },
];

function navClass(active: boolean) {
  return active
    ? "flex items-center gap-md rounded border-l-2 border-secondary bg-surface-variant/30 px-md py-sm font-label-md text-label-md font-bold text-secondary scale-95"
    : "flex items-center gap-md rounded px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-variant/20 hover:text-on-surface";
}

/**
 * Shared account navigation column. Rendered as a sticky card on md+ screens;
 * on mobile the store header carries the primary navigation so the sidebar is
 * hidden to keep the layout compact.
 */
export default function AccountSidebar({ active }: { active: AccountSection }) {
  return (
    <aside className="w-full flex-shrink-0 md:mb-0 md:w-64">
      <div className="flex flex-col rounded-lg border border-muted/20 bg-surface p-lg md:sticky md:top-24">
        <div className="mb-lg flex items-center gap-md border-b border-white/10 pb-md">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-outline-variant bg-surface-container-highest">
            <Image
              src={avatar}
              alt="Profile"
              width={56}
              height={56}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="font-title-lg text-title-lg leading-tight text-on-surface">
              My Account
            </p>
            <p className="font-label-sm text-label-sm text-on-surface-variant">
              Premium Member
            </p>
          </div>
        </div>

        <nav aria-label="Account Navigation" className="flex flex-col space-y-sm">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              aria-current={item.id === active ? "page" : undefined}
              className={cn(navClass(item.id === active))}
            >
              <Icon name={item.icon} className="text-[20px]" />
              {item.label}
            </Link>
          ))}
          <Link
            className={cn(
              navClass(false),
              "mt-lg border-t border-white/5 pt-lg",
            )}
            href="/account/settings"
          >
            <Icon name="settings" className="text-[20px]" />
            Account Settings
          </Link>
          <Link
            href="/signin"
            className="flex w-full items-center gap-md rounded px-md py-sm font-label-md text-label-md text-error transition-colors hover:bg-error/10"
          >
            <Icon name="logout" className="text-[20px]" />
            Sign Out
          </Link>
        </nav>
      </div>
    </aside>
  );
}