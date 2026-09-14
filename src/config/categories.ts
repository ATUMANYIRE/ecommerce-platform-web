import {
  electronicsImage,
  fashionImage,
  homeImage,
  beautyImage,
  sportsImage,
} from "@/lib/demo-data";

export type Category = {
  name: string;
  categoryId: string;
  image: string;
};

export type Brand = {
  name: string;
  brandId: string;
};

/**
 * Static brand list until the backend exposes a brand endpoint. brandId is an
 * opaque slug used for the `/search` brandId filter (search items carry no
 * brand name, so labels are config-only).
 */
export const brands: Brand[] = [
  { name: "Sony", brandId: "sony" },
  { name: "Sennheiser", brandId: "sennheiser" },
  { name: "Keychron", brandId: "keychron" },
  { name: "Logitech", brandId: "logitech" },
];

/**
 * Placeholder category list until the backend exposes GET /categories.
 * Images are demo placeholders; categoryId is an opaque slug used for search links.
 */
export const categories: Category[] = [
  { name: "Electronics", categoryId: "electronics", image: electronicsImage },
  { name: "Fashion", categoryId: "fashion", image: fashionImage },
  { name: "Home", categoryId: "home", image: homeImage },
  { name: "Beauty", categoryId: "beauty", image: beautyImage },
  { name: "Sports", categoryId: "sports", image: sportsImage },
];
