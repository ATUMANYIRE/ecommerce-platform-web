"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";
import { getActiveNavItem, sellerNav } from "@/components/seller/nav";
import type { DashboardNav } from "@/components/seller/nav";

export default function SellerBottomNav({ nav = sellerNav }: { nav?: DashboardNav }) {
  const pathname = usePathname();
  const activeId = getActiveNavItem(nav.items, pathname).id;

  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-around border-t border-outline-variant/20 bg-surface-dim px-sm py-sm md:hidden">
      {nav.items.map((item) => {
        const active = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-w-0 flex-col items-center gap-1 p-1 transition-colors",
              active
                ? "font-bold text-secondary"
                : "text-on-surface-variant hover:text-secondary",
            )}
          >
            <Icon name={item.icon} className="text-[22px]" fill={active ? 1 : 0} />
            <span className="max-w-full truncate font-label-sm text-[10px] uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
