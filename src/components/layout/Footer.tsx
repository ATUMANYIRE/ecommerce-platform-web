const columns = [
  {
    heading: "Shop",
    links: [
      { label: "Electronics", href: "/search?categoryId=electronics" },
      { label: "Fashion", href: "/search?categoryId=fashion" },
      { label: "Home", href: "/search?categoryId=home" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "FAQ", href: "/faq" },
      { label: "Shipping", href: "/shipping" },
      { label: "Returns", href: "/returns" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="relative z-20 mt-auto w-full border-t border-white/5 bg-surface-container-lowest">
      <div className="mx-auto grid max-w-max-width grid-cols-2 gap-gutter px-margin-mobile py-xxl md:grid-cols-4 md:px-margin-desktop">
        {columns.map((col) => (
          <div key={col.heading} className="space-y-4">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-secondary">
              {col.heading}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="cursor-pointer font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="space-y-4">
          <h4 className="font-label-md text-label-md uppercase tracking-wider text-secondary">
            Legal &amp; Updates
          </h4>
          <ul className="mb-4 space-y-2">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="cursor-pointer font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="rounded border border-white/10 bg-surface-container px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant focus:border-white focus:outline-none"
            />
            <button
              type="button"
              className="rounded bg-surface-container-highest py-2 text-sm text-on-surface transition-colors hover:bg-surface-variant"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 py-lg text-center font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
        © {new Date().getFullYear()} ATLAS MARKETPLACE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
