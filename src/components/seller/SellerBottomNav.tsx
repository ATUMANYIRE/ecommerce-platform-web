"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";
import { sellerNavItems } from "@/components/seller/nav";

export default function SellerBottomNav({
  activeId = "overview",
}: {
  activeId?: string;
}) {
  return (
    <nav className="fixed right-0 bottom-0 left-0 z-40 flex items-center justify-around border-t border-outline-variant/20 bg-surface-dim px-margin-mobile py-sm md:hidden">
      {sellerNavItems.map((item) => {
        const active = item.id === activeId;
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-colors",
              active
                ? "font-bold text-secondary"
                : "text-on-surface-variant hover:text-secondary",
            )}
          >
            <Icon name={item.icon} className="text-[24px]" fill={active ? 1 : 0} />
            <span className="font-label-sm text-[10px] uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}