import Link from "next/link";
import NewsletterForm from "@/components/layout/NewsletterForm";

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
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Sell on Atlas", href: "/become-seller" },
      { label: "Seller Hub", href: "/seller" },
      { label: "Admin Console", href: "/admin" },
    ],
  },
];

const legalLinks = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Privacy Policy", href: "/privacy" },
];

export default function Footer() {
  return (
    <footer className="relative z-20 mt-auto w-full print:hidden border-t border-white/5 bg-surface-container-lowest">
      <div className="mx-auto grid max-w-max-width grid-cols-2 gap-gutter px-margin-mobile py-xxl md:grid-cols-4 md:px-margin-desktop">
        {columns.map((col) => (
          <div key={col.heading} className="space-y-4">
            <h4 className="font-label-md text-label-md uppercase tracking-wider text-secondary">
              {col.heading}
            </h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="cursor-pointer font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
                  >
                    {link.label}
                  </Link>
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
                <Link
                  href={link.href}
                  className="cursor-pointer font-body-md text-body-md text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-white/5 py-lg text-center font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
        © {new Date().getFullYear()} ATLAS MARKETPLACE. ALL RIGHTS RESERVED.
      </div>
    </footer>
  );
}
