"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { logout, useSession } from "@/lib/auth/session";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  links: { label: string; href: string }[];
};

const accountLinks: { label: string; href: string; icon: IconName }[] = [
  { label: "My Account", href: "/account", icon: "person" },
  { label: "My Orders", href: "/orders", icon: "local_shipping" },
  { label: "Wishlist", href: "/wishlist", icon: "favorite_border" },
  { label: "Notifications", href: "/account/notifications", icon: "notifications" },
];

const moreLinks: { label: string; href: string; icon: IconName }[] = [
  { label: "Sell on Atlas", href: "/become-seller", icon: "storefront" },
  { label: "Help & FAQ", href: "/faq", icon: "help" },
  { label: "Contact", href: "/contact", icon: "support_agent" },
];

const rowClass =
  "flex items-center gap-md rounded px-md py-sm font-body-lg text-body-lg text-on-surface transition-colors hover:bg-surface-container-high";

/** Slide-in navigation for small screens (the header's menu button did nothing before). */
export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  if (!open) return null;

  async function signOut() {
    await logout();
    onClose();
    router.push("/login");
  }

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
      <button
        type="button"
        aria-label="Close menu"
        onClick={onClose}
        className="absolute inset-0 bg-obsidian/70 backdrop-blur-sm"
      />
      <aside className="absolute right-0 top-0 flex h-full w-[85%] max-w-sm flex-col overflow-y-auto border-l border-outline-variant/20 bg-surface-container px-lg py-lg">
        <div className="mb-xl flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="font-display-md text-headline-lg-mobile tracking-tighter text-on-surface"
          >
            ATLAS
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 text-on-surface transition-colors hover:border-secondary hover:text-secondary"
          >
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>

        <nav aria-label="Shop" className="mb-lg flex flex-col gap-xs border-b border-ivory/10 pb-lg">
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={onClose}
              className="px-md py-sm font-display-md text-headline-lg-mobile text-on-surface transition-colors hover:text-secondary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="Account" className="mb-lg flex flex-col gap-xs border-b border-ivory/10 pb-lg">
          <p className="mb-xs px-md font-label-sm text-label-sm uppercase tracking-widest text-muted">
            {session?.email ? session.email : "Your account"}
          </p>
          {accountLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className={rowClass}>
              <Icon name={link.icon} className="text-[20px] text-secondary" />
              {link.label}
            </Link>
          ))}
        </nav>

        <nav aria-label="More" className="flex flex-col gap-xs">
          {moreLinks.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose} className={rowClass}>
              <Icon name={link.icon} className="text-[20px] text-on-surface-variant" />
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-sm pt-xl">
          {session ? (
            <button
              type="button"
              onClick={signOut}
              className="flex items-center justify-center gap-sm rounded border border-error/40 py-md font-label-md text-label-md uppercase tracking-wider text-error transition-colors hover:bg-error/10"
            >
              <Icon name="logout" className="text-[18px]" />
              Sign Out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-sm rounded bg-secondary py-md font-label-md text-label-md uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary-fixed"
              >
                <Icon name="login" className="text-[18px]" />
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-sm rounded border border-on-surface/30 py-md font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors hover:border-on-surface"
              >
                <Icon name="person_add" className="text-[18px]" />
                Create Account
              </Link>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
