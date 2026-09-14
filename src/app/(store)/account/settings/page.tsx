import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function AccountSettingsPage() {
  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xl md:px-margin-desktop">
      <div className="mb-xl">
        <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
          Account Settings
        </h1>
        <p className="font-body-md text-body-md text-muted">
          Update your personal details and preferences.
        </p>
      </div>

      <div className="relative max-w-xl overflow-hidden rounded bg-ink p-lg shadow-[0_4px_32px_rgba(11,13,15,0.15)]">
        <div className="pointer-events-none absolute inset-0 rounded border border-ivory/10" />
        <div className="relative flex flex-col gap-md py-xl text-center">
          <Icon name="settings" className="mx-auto text-4xl text-muted" />
          <p className="mx-auto max-w-sm font-body-md text-body-md text-muted">
            Settings are coming soon. Return to your account overview to manage
            your orders, wishlist, and addresses.
          </p>
          <div className="mt-md">
            <Link
              href="/account"
              className="inline-flex items-center font-label-md text-label-md uppercase text-ivory transition-colors hover:text-champagne"
            >
              <Icon name="arrow_back" className="mr-xs text-[18px]" />
              Back to Overview
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}