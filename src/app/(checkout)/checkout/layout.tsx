import Link from "next/link";
import { AddressProvider } from "@/context/AddressContext";

/**
 * Transactional chrome for the checkout flow — a centered brand mark and a
 * bare-bones footer, no nav shell (per the checkout/transactional design rule).
 */
export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-obsidian text-on-background antialiased">
      <header className="sticky top-0 z-10 flex items-center justify-center border-b border-ivory/10 bg-obsidian px-margin-mobile py-lg md:px-margin-desktop">
        <Link
          href="/"
          className="font-display-md text-display-md tracking-tighter text-on-background transition-colors hover:text-secondary"
        >
          ATLAS
        </Link>
      </header>
      <AddressProvider>{children}</AddressProvider>
      <footer className="mt-auto w-full border-t border-white/5 bg-obsidian py-lg">
        <div className="mx-auto flex max-w-max-width items-center justify-center px-margin-mobile md:px-margin-desktop">
          <span className="font-label-sm text-label-sm uppercase tracking-wider text-muted">
            © {new Date().getFullYear()} ATLAS MARKETPLACE. SECURE ENCRYPTED
            CONNECTION.
          </span>
        </div>
      </footer>
    </div>
  );
}