import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { categories } from "@/config/categories";
import ProductActions from "@/components/product/ProductActions";
import ProductReviews from "@/components/product/ProductReviews";
import NoImagePlaceholder from "@/components/product/NoImagePlaceholder";
import { ProductCardLink } from "@/components/product/ProductCard";
import RetryButton from "@/components/search/RetryButton";
import { getProductBySku } from "@/lib/api/products";
import { getStock } from "@/lib/api/stock";
import { buildSearchUrl } from "@/lib/search-url";
import {
  defaultDescription,
  defaultHeadline,
  defaultReviews,
  getDemoProductDetail,
  relatedProducts,
} from "@/lib/demo-data";
import { formatAmount } from "@/lib/utils/currency";
import type { ProductDetail } from "@/lib/demo-data";
import type { ProductResponse } from "@/types/product";

export const dynamic = "force-dynamic";

const PLACEHOLDER_IMAGE = "/images/product-placeholder.svg";

type ProductPageProps = {
  params: Promise<{ sku: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { sku } = await params;
  const demo = getDemoProductDetail(sku);
  return {
    title: `${demo?.name ?? `Product ${sku}`} - Atlas Marketplace`,
    description: demo?.description[0],
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
  const { sku } = await params;
  const state = (await searchParams).state;
  const demoMode = typeof state === "string" && state === "emptystates";

  let apiProduct: ProductResponse | null = null;
  let remainingStock: number | null = null;
  try {
    const [product, stock] = await Promise.all([
      getProductBySku(sku),
      getStock(sku),
    ]);
    apiProduct = product;
    remainingStock = stock.availableQuantity;
  } catch {
    // Gateway is optional in local dev — fall back to the shipped preview data.
  }

  const demo = getDemoProductDetail(sku);

  const hasData = apiProduct !== null || demo !== null;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-xxl text-center">
        <h1 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
          Something went wrong
        </h1>
        <p className="mb-xl max-w-md font-body-md text-body-md text-on-surface-variant">
          We couldn&apos;t load this product. Please try again.
        </p>
        <RetryButton />
      </div>
    );
  }

  const detail: ProductDetail =
    demo ?? {
      sku,
      name: apiProduct?.name ?? sku,
      price: apiProduct ? Number(apiProduct.listPrice.amount) : 0,
      currency: apiProduct?.listPrice.currency ?? "USD",
      image: apiProduct?.images[0]?.url ?? PLACEHOLDER_IMAGE,
      categoryId: apiProduct?.categoryId ?? "",
      stock: remainingStock ?? 0,
      headline: defaultHeadline,
      description: defaultDescription,
      reviews: defaultReviews,
    };

  const stockLeft = remainingStock ?? detail.stock;
  const category = categories.find((c) => c.categoryId === detail.categoryId);

  const showImage = demoMode ? false : detail.image !== PLACEHOLDER_IMAGE;
  const isOutOfStock = demoMode ? true : stockLeft <= 0;
  const reviews = demoMode ? [] : detail.reviews;

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
            href={buildSearchUrl({ categoryId: detail.categoryId })}
            className="transition-colors hover:text-secondary"
          >
            {category.name}
          </Link>
        ) : (
          <span>Catalog</span>
        )}
        <span aria-hidden="true">/</span>
        <span className="text-on-surface">{detail.name}</span>
      </nav>

      {/* Hero */}
      <section className="grid grid-cols-1 items-start gap-gutter md:grid-cols-12">
        <div className="group relative aspect-square overflow-hidden rounded-lg bg-surface-container-low shadow-[0_32px_32px_rgba(11,14,18,0.15)] md:col-span-7">
          {showImage ? (
            <Image
              src={detail.image}
              alt={detail.name}
              fill
              priority
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
              {detail.name}
            </h1>
            <span className="font-display-md text-headline-lg text-on-surface">
              {formatAmount(detail.price, detail.currency)}
            </span>
          </div>

          <div className="flex flex-col gap-md">
            {isOutOfStock ? (
              <div className="flex items-center gap-2 font-label-sm text-label-sm uppercase tracking-widest text-error">
                <span className="material-symbols-outlined text-[16px]">
                  inventory_2
                </span>
                Out of stock
              </div>
            ) : stockLeft <= 10 ? (
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
              name={detail.name}
              price={detail.price}
              currency={detail.currency}
              image={detail.image}
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

      {detail.description.length > 0 && (
        <section className="grid grid-cols-1 gap-gutter md:grid-cols-12">
          <div className="flex flex-col gap-lg text-center md:col-span-8 md:col-start-3">
            <h2 className="font-display-md text-headline-lg text-on-surface">
              {detail.headline}
            </h2>
            <div className="mx-auto max-w-3xl space-y-6 font-body-lg text-body-lg text-on-surface-variant">
              {detail.description.map((paragraph, index) => (
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