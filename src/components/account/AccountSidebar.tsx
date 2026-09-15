"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { logout, useSession } from "@/lib/auth/session";
import { useProfile } from "@/lib/demo/profile";
import { cn } from "@/lib/utils/cn";

export type AccountSection =
  | "overview"
  | "orders"
  | "wishlist"
  | "addresses"
  | "notifications"
  | "settings";

const navItems: { id: AccountSection; label: string; icon: IconName; href: string }[] = [
  { id: "overview", label: "Overview", icon: "dashboard", href: "/account" },
  { id: "orders", label: "Orders", icon: "shopping_cart", href: "/account/orders" },
  { id: "wishlist", label: "Wishlist", icon: "favorite", href: "/account/wishlist" },
  { id: "addresses", label: "Addresses", icon: "location_on", href: "/account/addresses" },
  { id: "notifications", label: "Notifications", icon: "notifications", href: "/account/notifications" },
];

function navClass(active: boolean) {
  return active
    ? "flex items-center gap-md rounded border-l-2 border-secondary bg-surface-variant/30 px-md py-sm font-label-md text-label-md font-bold text-secondary scale-95"
    : "flex items-center gap-md rounded px-md py-sm font-label-md text-label-md text-on-surface-variant transition-colors hover:bg-surface-variant/20 hover:text-on-surface";
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return (parts[0]?.[0] ?? "A").concat(parts[1]?.[0] ?? "").toUpperCase();
}

/**
 * Shared account navigation column. Rendered as a sticky card on md+ screens;
 * on mobile the store header carries the primary navigation so the sidebar is
 * hidden to keep the layout compact.
 */
export default function AccountSidebar({ active }: { active: AccountSection }) {
  const router = useRouter();
  const session = useSession();
  const profile = useProfile();

  async function signOut() {
    // Revokes the refresh token; previously this only linked to /signin and kept the session.
    await logout();
    router.push("/login");
  }

  return (
    <aside className="w-full flex-shrink-0 md:mb-0 md:w-64">
      <div className="flex flex-col rounded-lg border border-muted/20 bg-surface p-lg md:sticky md:top-24">
        <div className="mb-lg flex items-center gap-md border-b border-white/10 pb-md">
          {/* Initials instead of the hot-linked avatar image, which no longer loads. */}
          <div
            aria-hidden="true"
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-outline-variant bg-surface-container-highest font-display-md text-title-lg text-secondary"
          >
            {initials(profile.fullName)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-title-lg text-title-lg leading-tight text-on-surface">
              {profile.fullName || "My Account"}
            </p>
            <p className="truncate font-label-sm text-label-sm text-on-surface-variant">
              {session?.email ?? "Premium Member"}
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
            className={cn(navClass(active === "settings"), "mt-lg border-t border-white/5 pt-lg")}
            aria-current={active === "settings" ? "page" : undefined}
            href="/account/settings"
          >
            <Icon name="settings" className="text-[20px]" />
            Account Settings
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-md rounded px-md py-sm text-left font-label-md text-label-md text-error transition-colors hover:bg-error/10"
          >
            <Icon name="logout" className="text-[20px]" />
            Sign Out
          </button>
        </nav>
      </div>
    </aside>
  );
}
