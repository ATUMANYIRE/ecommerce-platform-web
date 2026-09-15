import Link from "next/link";
import Icon from "@/components/ui/Icon";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-margin-mobile py-xxl text-center">
      <Link
        href="/"
        className="mb-xxl font-display-md text-display-md tracking-tighter text-on-surface"
      >
        ATLAS
      </Link>
      <Icon name="search_off" className="mb-lg text-[64px] text-outline opacity-60" />
      <p className="mb-sm font-label-md text-label-md uppercase tracking-widest text-secondary">
        Error 404
      </p>
      <h1 className="mb-md font-display-md text-headline-lg-mobile text-on-surface md:text-display-md">
        This page doesn&apos;t exist
      </h1>
      <p className="mb-xl max-w-md font-body-lg text-body-lg text-on-surface-variant">
        The link may be broken or the page may have moved. Let&apos;s get you back
        to something worth finding.
      </p>
      <div className="flex flex-col gap-md sm:flex-row">
        <Link
          href="/"
          className="rounded bg-secondary px-lg py-md font-label-md text-label-md uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary-fixed"
        >
          Return Home
        </Link>
        <Link
          href="/search?q=*"
          className="rounded border border-on-surface/30 px-lg py-md font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors hover:border-on-surface"
        >
          Browse Products
        </Link>
      </div>
    </main>
  );
}
