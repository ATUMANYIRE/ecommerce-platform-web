"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";
import { getActiveNavItem, sellerNav } from "@/components/seller/nav";
import type { DashboardNav } from "@/components/seller/nav";

const sellerAvatar =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA982Ukmkc1fRO82w-5-4D_8YBXTmvkPtXEEXh0aKvjXFK3T1j9HNu5tgt6ys_w0br14MZWrKTWRET_Dgvy5SbY6-HC8GoKw8mcIaQEFk7lVYhjdsPxamWK3ILItFxGXvWjyfdVVLZgWk3YpaQeBvZkRqahKbcl62bnFT7DYZ0VCRb8dga8CpgZNEP6PVeZy4oyBCPNc-DWry2JQfZS583H2aAI2fXIoY4rxbKSNfJwGxrNTHldHhXIKQ";

function NavLinks({ nav, onNavigate }: { nav: DashboardNav; onNavigate?: () => void }) {
  // The active item follows the route; before, the sidebar always highlighted Overview.
  const pathname = usePathname();
  const activeId = getActiveNavItem(nav.items, pathname).id;
  return (
    <>
      {nav.items.map((item) => {
        const active = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-md px-md py-sm text-left transition-all active:scale-95",
              active
                ? "rounded bg-secondary/10 font-bold text-secondary hover:text-secondary"
                : "rounded text-on-surface-variant hover:text-secondary",
            )}
          >
            <Icon name={item.icon} className="text-[20px]" fill={active ? 1 : 0} />
            <span className="font-label-md text-label-md uppercase">{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}

function Footer({ nav }: { nav: DashboardNav }) {
  const isSeller = nav.subtitle === sellerNav.subtitle;
  return (
    <Link
      href={isSeller ? "/seller/settings" : "/"}
      className="mt-auto flex items-center gap-md border-t border-outline-variant/20 pt-lg transition-opacity hover:opacity-80"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-variant">
        {isSeller ? (
          <Image src={sellerAvatar} alt="Store avatar" width={40} height={40} className="h-full w-full object-cover" />
        ) : (
          <Icon name="admin_panel_settings" className="text-secondary" />
        )}
      </div>
      <div>
        <p className="font-label-md text-label-md text-on-surface">
          {isSeller ? "Store Settings" : "Back to Store"}
        </p>
        <p className="font-label-sm text-label-sm text-on-surface-variant">
          {isSeller ? "Premium Member" : "Administrator"}
        </p>
      </div>
    </Link>
  );
}

export function SellerSidebar({ nav = sellerNav }: { nav?: DashboardNav }) {
  return (
    <aside className="sticky top-0 z-40 hidden h-screen w-64 shrink-0 flex-col border-r border-outline-variant/20 bg-surface-container py-xl px-lg md:flex">
      <div className="mb-xxl">
        <Link href="/" className="font-headline-lg text-headline-lg tracking-tight text-primary">
          {nav.title}
        </Link>
        <p className="mt-sm font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
          {nav.subtitle}
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-sm">
        <NavLinks nav={nav} />
      </nav>
      <Footer nav={nav} />
    </aside>
  );
}

export function SellerDrawer({
  open,
  onClose,
  nav = sellerNav,
}: {
  open: boolean;
  onClose: () => void;
  nav?: DashboardNav;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm"
      />
      <aside className="absolute left-0 top-0 flex h-full w-72 flex-col border-r border-outline-variant/20 bg-surface-container py-xl px-lg">
        <div className="mb-xxl flex items-center justify-between">
          <div>
            <span className="font-headline-lg text-headline-lg tracking-tight text-primary">{nav.title}</span>
            <p className="mt-sm font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
              {nav.subtitle}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 text-on-surface transition-colors hover:border-secondary hover:text-secondary"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>
        <nav className="flex flex-1 flex-col gap-sm">
          <NavLinks nav={nav} onNavigate={onClose} />
        </nav>
        <Footer nav={nav} />
      </aside>
    </div>
  );
}
