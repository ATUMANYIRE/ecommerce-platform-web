import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/config/categories";
import ProductActions from "@/components/product/ProductActions";
import ProductReviews from "@/components/product/ProductReviews";
import NoImagePlaceholder from "@/components/product/NoImagePlaceholder";
import { ProductCardLink } from "@/components/product/ProductCard";
import RetryButton from "@/components/search/RetryButton";
import { getCategories } from "@/lib/api/catalog";
import { isApiError } from "@/lib/api/client";
import { getProductBySku } from "@/lib/api/products";
import { getProductReviews } from "@/lib/api/reviews";
import type { ReviewResponse } from "@/lib/api/reviews";
import { getStock } from "@/lib/api/stock";
import { buildSearchUrl } from "@/lib/search-url";
import { pickDemoState } from "@/lib/demo-mode";
import {
  defaultHeadline,
  getDemoProductDetail,
  relatedProducts,
} from "@/lib/demo-data";
import type { ProductReview } from "@/lib/demo-data";
import { formatAmount } from "@/lib/utils/currency";
import { isUnoptimizedImage } from "@/lib/utils/image";
import type { ProductResponse } from "@/types/product";

export const dynamic = "force-dynamic";

const PLACEHOLDER_IMAGE = "/images/product-placeholder.svg";

type ProductPageProps = {
  params: Promise<{ sku: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function loadProduct(sku: string): Promise<{
  product: ProductResponse | null;
  notFound: boolean;
}> {
  try {
    return { product: await getProductBySku(sku), notFound: false };
  } catch (error) {
    // 400 is a malformed SKU, 404 an unknown or hidden draft product.
    const notFound = isApiError(error) && (error.status === 404 || error.status === 400);
    return { product: null, notFound };
  }
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { sku } = await params;
  const { product } = await loadProduct(sku);
  const demo = getDemoProductDetail(sku);
  const name = product?.name ?? demo?.name ?? `Product ${sku}`;
  return {
    title: `${name} - Atlas Marketplace`,
    description: product?.description ?? demo?.description[0],
  };
}

function toReview(review: ReviewResponse): ProductReview {
  const rating = Math.min(5, Math.max(1, Math.round(review.rating))) as ProductReview["rating"];
  // Reviews carry a customer id, not a display name.
  return {
    initials: "C",
    author: review.verifiedPurchase ? "Verified buyer" : "Customer",
    rating,
    title: review.title,
    body: review.body,
    verified: review.verifiedPurchase,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { sku } = await params;
  const demoMode = pickDemoState((await searchParams).state, ["emptystates"]) !== undefined;

  const { product: apiProduct, notFound } = await loadProduct(sku);
  const demo = getDemoProductDetail(sku);

  if (!apiProduct && !demo) {
    return (
      <div className="flex flex-col items-center justify-center py-xxl text-center">
        <h1 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
          {notFound ? "Product not found" : "Something went wrong"}
        </h1>
        <p className="mb-xl max-w-md font-body-md text-body-md text-on-surface-variant">
          {notFound
            ? "This product doesn't exist or is no longer available."
            : "We couldn't load this product. Please try again."}
        </p>
        {notFound ? (
          <Link
            href="/search?q=*"
            className="rounded border border-on-surface px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors hover:bg-on-surface hover:text-background"
          >
            Browse products
          </Link>
        ) : (
          <RetryButton />
        )}
      </div>
    );
  }

  // Stock, reviews and categories are independent: one failing must not hide the product.
  const [stockResult, reviewsResult, categoriesResult] = await Promise.allSettled([
    getStock(sku),
    apiProduct ? getProductReviews(apiProduct.id) : Promise.resolve([]),
    apiProduct ? getCategories() : Promise.resolve([]),
  ]);
  const remainingStock =
    stockResult.status === "fulfilled" ? stockResult.value.availableQuantity : null;

  // Catalog data wins; the shipped preview copy only fills in for demo SKUs or when offline.
  const name = apiProduct?.name ?? demo!.name;
  const price = apiProduct ? Number(apiProduct.listPrice.amount) : demo!.price;
  const currency = apiProduct?.listPrice.currency ?? demo!.currency;
  const image = apiProduct?.images[0]?.url ?? demo?.image ?? PLACEHOLDER_IMAGE;
  const description = apiProduct
    ? (apiProduct.description ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)
    : demo!.description;
  const headline = apiProduct ? defaultHeadline : demo!.headline;
  // Real products show their real reviews (or the empty state), never the demo ones.
  const productReviews = apiProduct
    ? reviewsResult.status === "fulfilled"
      ? reviewsResult.value.map(toReview)
      : []
    : demo!.reviews;

  const apiCategory =
    apiProduct && categoriesResult.status === "fulfilled"
      ? categoriesResult.value.find((c) => c.id === apiProduct.categoryId)
      : undefined;
  const configCategory = demo
    ? categories.find((c) => c.categoryId === demo.categoryId)
    : undefined;
  const category = apiCategory
    ? { name: apiCategory.name, categoryId: apiCategory.id }
    : configCategory;

  // Only ACTIVE products can be bought; drafts and discontinued items are shown but not sellable.
  const purchasable = apiProduct ? apiProduct.status === "ACTIVE" : true;
  const stockLeft = remainingStock ?? (apiProduct ? null : demo!.stock);

  const showImage = demoMode ? false : image !== PLACEHOLDER_IMAGE;
  const isOutOfStock = demoMode || !purchasable || (stockLeft !== null && stockLeft <= 0);
  const reviews = demoMode ? [] : productReviews;

  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-xxl px-margin-mobile pt-xl pb-xxl md:px-margin-desktop">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-sm font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant"
      >
        <Link href="/" className="transition-colors hover:text-secondary">
          Home
        </Link>
        <span aria-hidden="true">/</span>
        {category ? (
          <Link
            href={buildSearchUrl({ categoryId: category.categoryId })}
            className="transition-colors hover:text-secondary"
          >
            {category.name}
          </Link>
        ) : (
          <span>Catalog</span>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-on-surface">{name}</span>
      </nav>

      {/* Hero */}
      <section className="grid grid-cols-1 items-start gap-gutter md:grid-cols-12">
        <div className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container-low shadow-[0_32px_32px_rgba(11,14,18,0.15)] md:col-span-7">
          {showImage ? (
            <Image
              src={image}
              alt={name}
              fill
              priority
              unoptimized={isUnoptimizedImage(image)}
              sizes="(max-width: 768px) 100vw, 840px"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <NoImagePlaceholder />
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-surface-container-low/40 to-transparent" />
        </div>

        {/* Sticky info panel */}
        <div className="mt-lg flex flex-col gap-lg rounded-lg bg-surface-container-lowest p-lg md:sticky md:top-32 md:col-span-5 md:mt-0 md:rounded-none md:bg-transparent md:p-0">
          <div className="flex flex-col gap-sm border-b border-outline-variant/30 pb-lg">
            <h1 className="font-display-md text-display-md text-on-surface">
              {name}
            </h1>
            <span className="font-display-md text-headline-lg text-on-surface">
              {formatAmount(price, currency)}
            </span>
          </div>

          <div className="flex flex-col gap-md">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-error">
                <span className="material-symbols-outlined text-[16px]">
                  inventory_2
                </span>
                {purchasable ? "Out of stock" : "Not available"}
              </div>
            ) : stockLeft === null ? null : stockLeft <= 10 ? (
              <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary/80">
                <span className="material-symbols-outlined text-[16px]">
                  inventory_2
                </span>
                {`Only ${stockLeft} left in stock`}
              </div>
            ) : (
              <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-secondary/80">
                <span className="material-symbols-outlined text-[16px]">
                  inventory_2
                </span>
                In stock
              </div>
            )}

            <ProductActions
              sku={sku}
              name={name}
              price={price}
              currency={currency}
              image={image}
              category={category?.name}
              disabled={isOutOfStock}
            />
          </div>

          <div className="flex flex-col gap-2 border-t border-outline-variant/30 pt-4 font-label-sm text-label-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                local_shipping
              </span>
              Free Premium Shipping on orders over $200
            </div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">
                assignment_return
              </span>
              30-Day Client Care Returns
            </div>
          </div>
        </div>
      </section>

      {description.length > 0 && (
        <section className="grid grid-cols-1 gap-gutter md:grid-cols-12">
          <div className="flex flex-col gap-lg text-center md:col-span-8 md:col-start-3">
            <h2 className="font-display-md text-headline-lg text-on-surface">
              {headline}
            </h2>
            <div className="mx-auto max-w-3xl space-y-6 font-body-lg text-body-lg text-on-surface-variant">
              {description.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        </section>
      )}

      <hr className="my-xl w-full max-w-max-width border-t border-outline-variant/20" />

      <div id="review">
        <ProductReviews reviews={reviews} />
      </div>

      <section className="mt-xxl flex flex-col gap-xl">
        <h2 className="border-b border-outline-variant/30 pb-md font-display-md text-headline-lg text-on-surface">
          Curated Pairings
        </h2>
        <div className="grid grid-cols-2 gap-gutter md:grid-cols-4">
          {relatedProducts.map((product) => (
            <ProductCardLink
              key={product.sku}
              sku={product.sku}
              name={product.name}
              price={product.price}
              currency={product.currency}
              image={product.image}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
