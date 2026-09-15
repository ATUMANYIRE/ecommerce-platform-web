export const heroImage = "/images/hero.png";
export const electronicsImage = "/images/keyboard.png";
export const fashionImage = "/images/tote.png";
export const homeImage = "/images/hero.png";
export const beautyImage = "/images/serum.png";
export const sportsImage = "/images/runner.png";

export const headphonesImage = "/images/headphones.png";
export const toteImage = "/images/tote.png";
export const keyboardImage = "/images/keyboard.png";
export const serumImage = "/images/serum.png";
export const watchImage = "/images/watch.png";
export const runnerImage = "/images/runner.png";
export const vaseImage = "/images/hero.png";
export const candleImage = "/images/hero.png";

export const lifestyleImage = "/images/lifestyle-screen.png";
export const promoImage = "/images/hero.png";

/**
 * Real product photos shipped with the demo (in /public/images/). The backend
 * never populates product images, so homepage demo content uses these local
 * assets; the search/listing page uses /images/product-placeholder.svg for
 * arbitrary search results.
 */
export type DemoProduct = {
  sku: string;
  name: string;
  price: number;
  currency: string;
  image: string;
};

export const trendingProducts: DemoProduct[] = [
  { sku: "WH-300", name: "Momentum Wireless Headphones", price: 399, currency: "USD", image: headphonesImage },
  { sku: "LT-180", name: "Leather Tote", price: 180, currency: "USD", image: toteImage },
  { sku: "MK-140", name: "Mechanical Keyboard", price: 140, currency: "USD", image: keyboardImage },
  { sku: "RS-045", name: "Rejuvenating Serum", price: 45, currency: "USD", image: serumImage },
];

export const mixedProducts: DemoProduct[] = [
  { sku: "MW-085", name: "Minimalist Watch", price: 85, currency: "USD", image: watchImage },
  { sku: "PR-120", name: "Performance Runner", price: 120, currency: "USD", image: runnerImage },
  { sku: "CV-065", name: "Ceramic Vase", price: 65, currency: "USD", image: vaseImage },
  { sku: "SC-035", name: "Scented Candle", price: 35, currency: "USD", image: candleImage },
];

export type ProductReview = {
  initials: string;
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  verified: boolean;
};

/**
 * Rich preview content for the /products/[sku] page. The gateway is optional in
 * local dev and never returns images/descriptions/reviews, so each known SKU
 * carries its own copy; unknown SKUs fall back to the defaults below.
 */
export type ProductDetail = {
  sku: string;
  name: string;
  price: number;
  currency: string;
  image: string;
  categoryId: string;
  stock: number;
  headline: string;
  description: string[];
  reviews: ProductReview[];
};

export const defaultHeadline = "Thoughtfully designed.";

export const defaultDescription = [
  "Selected for its considered construction and quiet presence, this piece balances refined aesthetics with everyday utility. Materials, proportions and finish work together, so it feels as good as it looks.",
  "Built to be lived with, it holds up to daily use while ageing gracefully. Our curation centres on durable, timeless design that quietly elevates the everyday.",
];

export const defaultReviews: ProductReview[] = [
  {
    initials: "EJ",
    author: "Elias J.",
    rating: 5,
    title: "Exquisite quality.",
    body: "The quality is unmatched, and the detailing elevates it well beyond expectations. Worth the asking price for the construction alone.",
    verified: true,
  },
  {
    initials: "SW",
    author: "Sarah W.",
    rating: 4,
    title: "Beautiful, well built.",
    body: "A very solid piece that looks even better in person. Minor quibbles aside, it delivers a refined feel you do not often find.",
    verified: false,
  },
];

const headphonesDetail: ProductDetail = {
  sku: "WH-300",
  name: "Momentum Wireless Headphones",
  price: 399,
  currency: "USD",
  image: headphonesImage,
  categoryId: "electronics",
  stock: 4,
  headline: "Uncompromising Audio Fidelity.",
  description: [
    "Engineered for the discerning audiophile, the Momentum Wireless represents the pinnacle of acoustic design. The bespoke 42mm transducers deliver a soundstage that is breathtakingly expansive, characterized by crystalline highs, articulate mids, and a tightly controlled, resonant bass response that never overwhelms.",
    "Crafted from aerospace-grade aluminum and swathed in genuine, sustainably sourced leather, the physical architecture is as uncompromising as the sound. Adaptive Active Noise Cancellation seamlessly adjusts to your environment, creating a sanctuary of silence, while the 60-hour battery life ensures uninterrupted immersion.",
  ],
  reviews: [
    {
      initials: "EJ",
      author: "Elias J.",
      rating: 5,
      title: "Exquisite sound and build.",
      body: "The clarity is unmatched. The leather earcups are incredibly soft, providing comfort for hours of continuous listening. Worth every penny for the build quality alone.",
      verified: true,
    },
    {
      initials: "SW",
      author: "Sarah W.",
      rating: 4,
      title: "Solid ANC, beautiful design.",
      body: "The noise cancellation is very good, though perhaps not class-leading. However, the aesthetic and sound profile lean perfectly into a more analog, natural feel that I prefer over overly processed audio.",
      verified: false,
    },
  ],
};

const keyboardDetail: ProductDetail = {
  sku: "KP-185",
  name: "Tactile Pro Keyboard",
  price: 185,
  currency: "USD",
  image: keyboardImage,
  categoryId: "electronics",
  stock: 12,
  headline: defaultHeadline,
  description: defaultDescription,
  reviews: defaultReviews,
};

const watchDetail: ProductDetail = {
  sku: "WU-240",
  name: "Chronograph No. 2",
  price: 240,
  currency: "USD",
  image: watchImage,
  categoryId: "fashion",
  stock: 7,
  headline: defaultHeadline,
  description: defaultDescription,
  reviews: defaultReviews,
};

const runnerDetail: ProductDetail = {
  sku: "SR-160",
  name: "AeroRunner Elite",
  price: 160,
  currency: "USD",
  image: runnerImage,
  categoryId: "sports",
  stock: 18,
  headline: defaultHeadline,
  description: defaultDescription,
  reviews: defaultReviews,
};

const toteDetail: ProductDetail = {
  sku: "TB-425",
  name: "The Heritage Tote",
  price: 425,
  currency: "USD",
  image: toteImage,
  categoryId: "fashion",
  stock: 5,
  headline: defaultHeadline,
  description: defaultDescription,
  reviews: defaultReviews,
};

/**
 * Preview content keyed by SKU. `/products/[sku]` uses these as a fallback (and
 * for metadata) when the gateway is unreachable or returns no images.
 */
export const productDetails: Record<string, ProductDetail> = {
  [headphonesDetail.sku]: headphonesDetail,
  [keyboardDetail.sku]: keyboardDetail,
  [watchDetail.sku]: watchDetail,
  [runnerDetail.sku]: runnerDetail,
  [toteDetail.sku]: toteDetail,
};

/** Category slug for every demo SKU (config/categories ids). */
export const demoCategoryBySku: Record<string, string> = {
  "WH-300": "electronics",
  "LT-180": "fashion",
  "MK-140": "electronics",
  "RS-045": "beauty",
  "MW-085": "fashion",
  "PR-120": "sports",
  "CV-065": "home",
  "SC-035": "home",
  "KP-185": "electronics",
  "WU-240": "fashion",
  "SR-160": "sports",
  "TB-425": "fashion",
};

export function getDemoProductDetail(sku: string): ProductDetail | null {
  const detail = productDetails[sku];
  if (detail) return detail;
  // Home-page products have no rich copy; give them a page instead of an error.
  const product = [...trendingProducts, ...mixedProducts].find((p) => p.sku === sku);
  if (!product) return null;
  return {
    ...product,
    categoryId: demoCategoryBySku[sku] ?? "",
    stock: 20,
    headline: defaultHeadline,
    description: defaultDescription,
    reviews: defaultReviews,
  };
}

/** Every demo product once (home rails plus the detailed preview products). */
export function allDemoProducts(): ProductDetail[] {
  const skus = new Set([
    ...trendingProducts.map((p) => p.sku),
    ...mixedProducts.map((p) => p.sku),
    ...Object.keys(productDetails),
  ]);
  return [...skus]
    .map((sku) => getDemoProductDetail(sku))
    .filter((p): p is ProductDetail => p !== null);
}

export const relatedProducts: ProductDetail[] = [
  keyboardDetail,
  watchDetail,
  runnerDetail,
  toteDetail,
];