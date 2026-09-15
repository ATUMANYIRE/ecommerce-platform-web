import Link from "next/link";
import Icon from "@/components/ui/Icon";
import type { InfoPageContent } from "@/lib/demo/info-pages";

/** Shared layout for the help and legal pages linked from the footer. */
export default function InfoPage({
  content,
  children,
}: {
  content: InfoPageContent;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xl md:px-margin-desktop md:py-xxl">
      <nav
        aria-label="Breadcrumb"
        className="mb-lg flex items-center gap-xs font-label-sm text-label-sm uppercase tracking-wider text-muted"
      >
        <Link href="/" className="transition-colors hover:text-ivory">
          Home
        </Link>
        <span>/</span>
        <span>{content.eyebrow}</span>
        <span>/</span>
        <span className="text-ivory">{content.title}</span>
      </nav>

      <header className="mb-xxl flex flex-col gap-md border-b border-ivory/10 pb-xl md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="mb-md inline-flex rounded-full bg-surface-container-highest p-sm">
            <Icon name={content.icon} className="text-[24px] text-secondary" />
          </div>
          <h1 className="mb-sm font-display-md text-headline-lg-mobile text-on-surface md:text-display-md">
            {content.title}
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            {content.intro}
          </p>
        </div>
        {content.updated ? (
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-muted">
            {content.updated}
          </p>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-xl lg:col-span-8">
          {content.sections.map((section) => (
            <section key={section.heading} className="flex flex-col gap-md">
              <h2 className="font-title-lg text-title-lg text-ivory">
                {section.heading}
              </h2>
              {section.paragraphs?.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="font-body-lg text-body-lg leading-relaxed text-on-surface-variant"
                >
                  {paragraph}
                </p>
              ))}
              {section.bullets ? (
                <ul className="flex flex-col gap-sm">
                  {section.bullets.map((bullet) => (
                    <li
                      key={bullet.slice(0, 32)}
                      className="flex items-start gap-sm font-body-lg text-body-lg text-on-surface-variant"
                    >
                      <Icon name="check" className="mt-[3px] text-[18px] text-secondary" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
          {children}
        </div>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded-lg border border-ivory/10 bg-ink p-lg">
            <h2 className="mb-sm font-title-lg text-title-lg text-ivory">
              Need a hand?
            </h2>
            <p className="mb-lg font-body-md text-body-md text-muted">
              Our client care team answers every message within one business day.
            </p>
            <div className="flex flex-col gap-sm">
              <Link
                href="/contact"
                className="inline-flex items-center gap-sm font-label-md text-label-md uppercase tracking-wider text-secondary transition-colors hover:text-secondary-fixed"
              >
                <Icon name="support_agent" className="text-[18px]" />
                Contact us
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-ivory"
              >
                <Icon name="help" className="text-[18px]" />
                Read the FAQ
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
