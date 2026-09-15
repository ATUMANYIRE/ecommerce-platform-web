import type { IconName } from "@/components/ui/Icon";

/**
 * Copy for the storefront's help and legal pages. Atlas Marketplace is a
 * portfolio demo store: policies describe how the demo behaves and are not a
 * contract with anyone.
 */
export type InfoSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type InfoPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  icon: IconName;
  updated?: string;
  sections: InfoSection[];
};

export type FaqGroup = {
  topic: string;
  questions: { q: string; a: string }[];
};

export const faqGroups: FaqGroup[] = [
  {
    topic: "Orders",
    questions: [
      {
        q: "How do I track my order?",
        a: "Open My Orders from your account and choose the order. The tracking timeline updates as the parcel moves, and the carrier and tracking number appear once it ships.",
      },
      {
        q: "Can I change or cancel an order?",
        a: "Orders can be changed or cancelled while they are still Processing. Once an order is Confirmed it is being packed and can be returned after delivery instead.",
      },
      {
        q: "Where can I download my invoice?",
        a: "Every order has an invoice page with a print button. Open the order and choose View Invoice.",
      },
    ],
  },
  {
    topic: "Payments",
    questions: [
      {
        q: "Which payment methods do you accept?",
        a: "Cards, PayPal and cash on delivery are shown at checkout. This is a demo store, so no payment is ever taken and no card details are collected.",
      },
      {
        q: "How do promotion codes work?",
        a: "Enter the code in the order summary before paying. Codes can have an expiry date, a minimum order value and a usage limit.",
      },
    ],
  },
  {
    topic: "Shipping & returns",
    questions: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3–5 business days and express delivery 1–2 business days. Orders over $200 ship free.",
      },
      {
        q: "What is your returns policy?",
        a: "Unused items can be returned within 30 days of delivery. See the Returns page for the full steps.",
      },
    ],
  },
  {
    topic: "Account",
    questions: [
      {
        q: "I forgot my password.",
        a: "Choose “Forgot password?” on the sign-in page and we will send you a link to set a new one.",
      },
      {
        q: "How do I become a seller?",
        a: "Choose Sell on Atlas in the footer, tell us about your store and you will get access to the Seller Hub.",
      },
    ],
  },
];

export const infoPages = {
  shipping: {
    eyebrow: "Support",
    title: "Shipping",
    intro: "Every order is packed with care and shipped with tracking from the moment it leaves the warehouse.",
    icon: "local_shipping",
    sections: [
      {
        heading: "Delivery options",
        bullets: [
          "Standard — 3 to 5 business days, $15 or free on orders over $200.",
          "Express — 1 to 2 business days, $30.",
          "Orders placed before 2 pm ship the same business day.",
        ],
      },
      {
        heading: "Tracking your parcel",
        paragraphs: [
          "When your order ships you will see the carrier and tracking number on the order page. The timeline updates at each scan, from departure to the delivery confirmation.",
        ],
      },
      {
        heading: "International shipping",
        paragraphs: [
          "We currently deliver to the United States, Canada, the United Kingdom and Australia. Duties and import taxes, where they apply, are shown before you pay.",
        ],
      },
    ],
  },
  returns: {
    eyebrow: "Support",
    title: "Returns & Refunds",
    intro: "Changed your mind? Return unused items within 30 days of delivery for a full refund.",
    icon: "undo",
    sections: [
      {
        heading: "How to return an item",
        bullets: [
          "Open the order in My Orders and choose the items you want to return.",
          "Print the prepaid label and pack the items in their original packaging.",
          "Drop the parcel at any carrier location within 14 days of requesting the return.",
        ],
      },
      {
        heading: "Refunds",
        paragraphs: [
          "Refunds go back to the original payment method within 5 business days of the return arriving at our warehouse. Shipping costs are refunded when the item arrived damaged or was not as described.",
        ],
      },
      {
        heading: "Items that cannot be returned",
        bullets: [
          "Opened beauty and personal-care products.",
          "Personalised or made-to-order items.",
          "Gift cards.",
        ],
      },
    ],
  },
  about: {
    eyebrow: "Company",
    title: "About Atlas",
    intro: "Atlas is a curated marketplace connecting independent designers and premier brands with people who value things made well.",
    icon: "handshake",
    sections: [
      {
        heading: "What we do",
        paragraphs: [
          "We select every seller and review every listing, so the catalogue stays small, considered and trustworthy. Sellers manage their own products, stock and orders from the Seller Hub; we handle discovery, payments and customer care.",
        ],
      },
      {
        heading: "How it is built",
        paragraphs: [
          "Atlas is a portfolio project: a Next.js storefront designed to run on an event-driven platform of independent services for catalogue, search, inventory, cart, checkout, payments, shipping, reviews and notifications.",
        ],
      },
      {
        heading: "Our principles",
        bullets: [
          "Quality over quantity in everything we list.",
          "Clear prices, honest stock levels and no dark patterns.",
          "Fair terms for the independent sellers who make Atlas what it is.",
        ],
      },
    ],
  },
  terms: {
    eyebrow: "Legal",
    title: "Terms of Service",
    intro: "These terms explain how the Atlas demo store may be used.",
    icon: "description",
    updated: "Last updated September 2026",
    sections: [
      {
        heading: "1. A demonstration service",
        paragraphs: [
          "Atlas Marketplace is a demonstration storefront. Products, prices, sellers, orders and reviews shown on the site are sample data. Nothing you do on the site creates a purchase, a payment or a contract.",
        ],
      },
      {
        heading: "2. Accounts",
        paragraphs: [
          "You are responsible for keeping your sign-in details private. Do not use a password you use anywhere else, and do not enter real payment details.",
        ],
      },
      {
        heading: "3. Acceptable use",
        bullets: [
          "Do not attempt to disrupt, overload or gain unauthorised access to the service.",
          "Do not upload unlawful, harmful or infringing content in reviews or listings.",
        ],
      },
      {
        heading: "4. Changes",
        paragraphs: [
          "The demo may change or be reset at any time, including removing accounts and sample orders.",
        ],
      },
    ],
  },
  privacy: {
    eyebrow: "Legal",
    title: "Privacy Policy",
    intro: "How the Atlas demo store handles the little information it uses.",
    icon: "shield",
    updated: "Last updated September 2026",
    sections: [
      {
        heading: "What is stored",
        bullets: [
          "Your cart, wishlist, saved addresses and demo orders are stored in your own browser (local storage).",
          "If you create an account, your e-mail address and a securely hashed password are stored by the platform.",
        ],
      },
      {
        heading: "What is not collected",
        paragraphs: [
          "No payment card details are collected. Newsletter and contact forms on this demo do not send any messages.",
        ],
      },
      {
        heading: "Your choices",
        paragraphs: [
          "Clearing your browser's site data removes everything stored locally. Signing out ends your session on this device.",
        ],
      },
    ],
  },
} satisfies Record<string, InfoPageContent>;
