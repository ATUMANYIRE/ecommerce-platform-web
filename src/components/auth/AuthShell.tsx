import Image from "next/image";
import Link from "next/link";

export const AUTH_PANEL_IMAGE = "/images/lifestyle-screen.png";

/**
 * Split layout shared by the secondary auth screens (forgot password, reset
 * password, verify e-mail), matching the sign-in page.
 */
export default function AuthShell({
  heading,
  copy,
  children,
}: {
  heading: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-dvh w-full flex-col overflow-hidden bg-background md:flex-row">
      <aside className="relative hidden h-full min-h-dvh w-1/2 flex-col justify-between bg-surface-container-lowest p-margin-desktop md:flex">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={AUTH_PANEL_IMAGE}
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/50 to-transparent" />
        </div>
        <Link
          href="/"
          className="relative z-10 font-headline-lg text-headline-lg tracking-tighter text-on-surface"
        >
          Atlas
        </Link>
        <div className="relative z-10 mb-margin-desktop max-w-md">
          <h1 className="mb-lg font-display-md text-display-md text-on-surface">
            {heading}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">{copy}</p>
        </div>
      </aside>

      <section className="relative z-20 flex min-h-dvh w-full items-center justify-center overflow-y-auto bg-background p-margin-mobile md:w-1/2 md:p-margin-desktop">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-xl block text-center font-headline-lg text-headline-lg tracking-tighter text-on-surface md:hidden"
          >
            Atlas
          </Link>
          {children}
        </div>
      </section>
    </main>
  );
}

export const authInputClass =
  "w-full rounded-none border-0 border-b border-b-ivory/30 bg-ink px-0 pb-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 transition-colors focus:border-b-ivory focus:outline-none focus:ring-0 disabled:opacity-60";

export const authLabelClass =
  "font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant";

export const authButtonClass =
  "flex h-[48px] w-full items-center justify-center gap-sm rounded bg-secondary font-label-md text-label-md uppercase tracking-wider text-obsidian transition-all duration-300 hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-70";
