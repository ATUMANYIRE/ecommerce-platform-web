import Link from "next/link";
import Filters from "@/components/search/Filters";
import ResultsGrid from "@/components/search/ResultsGrid";
import RetryButton from "@/components/search/RetryButton";
import { getBrands, getCategories, resolveTaxonomyId } from "@/lib/api/catalog";
import { search } from "@/lib/api/search";
import { isApiError } from "@/lib/api/client";
import type { ApiError } from "@/lib/api/client";
import type { GridParams } from "@/components/search/ResultsGrid";
import { buildSearchUrl } from "@/lib/search-url";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;
/** search-service rejects (page + 1) × size above Elasticsearch's 10 000 result window. */
const MAX_PAGE = Math.floor(10_000 / PAGE_SIZE) - 1;
const MAX_QUERY_LENGTH = 200;

function asString(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asNumber(v: string | string[] | undefined): number | undefined {
  const s = asString(v);
  if (s === undefined || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) && n >= 0 ? n : undefined;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;

  const q = asString(raw.q)?.slice(0, MAX_QUERY_LENGTH);
  let minPrice = asNumber(raw.minPrice);
  let maxPrice = asNumber(raw.maxPrice);
  if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
    [minPrice, maxPrice] = [maxPrice, minPrice];
  }
  const page = Math.min(MAX_PAGE, Math.floor(asNumber(raw.page) ?? 0));

  const [categoriesResult, brandsResult] = await Promise.allSettled([
    getCategories(),
    getBrands(),
  ]);
  const knownCategories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];
  const knownBrands = brandsResult.status === "fulfilled" ? brandsResult.value : [];

  // Home tiles and footer links carry slugs ("electronics"); search needs catalog ids.
  const categoryId = resolveTaxonomyId(asString(raw.categoryId), knownCategories);
  const brandId = resolveTaxonomyId(asString(raw.brandId), knownBrands);
  const unknownFilter = categoryId === null || brandId === null;

  const params: GridParams = {
    q,
    categoryId: categoryId ?? undefined,
    brandId: brandId ?? undefined,
    minPrice,
    maxPrice,
  };
  // Whole-string key so Filters/Results client state resets on every navigation.
  const urlKey = buildSearchUrl({
    q,
    categoryId: params.categoryId,
    brandId: params.brandId,
    minPrice: minPrice !== undefined ? String(minPrice) : undefined,
    maxPrice: maxPrice !== undefined ? String(maxPrice) : undefined,
  });

  let items: Awaited<ReturnType<typeof search>>["items"] = [];
  let totalElements = 0;
  let error: ApiError | null = null;

  if (!unknownFilter) {
    try {
      const res = await search({ ...params, page, size: PAGE_SIZE });
      items = res.items;
      totalElements = res.totalElements;
    } catch (err) {
      error = isApiError(err)
        ? err
        : { status: 0, title: "Request failed", extensions: {} };
    }
  }

  const heading =
    q && q !== "*" ? `Results for "${q}"` : "All Products";

  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-xl px-margin-mobile py-xl md:flex-row md:px-margin-desktop md:py-xxl">
      <Filters
        key={`filters-${urlKey}`}
        q={q}
        categoryId={params.categoryId}
        brandId={params.brandId}
        minPrice={minPrice !== undefined ? String(minPrice) : undefined}
        maxPrice={maxPrice !== undefined ? String(maxPrice) : undefined}
        categories={
          knownCategories.length > 0
            ? knownCategories.map((c) => ({ name: c.name, categoryId: c.id }))
            : undefined
        }
        brands={
          knownBrands.length > 0
            ? knownBrands.map((b) => ({ name: b.name, brandId: b.id }))
            : undefined
        }
      />

      <div className="flex flex-1 flex-col">
        {error ? (
          <div className="flex flex-col items-center justify-center py-xxl text-center">
            <h1 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
              Something went wrong
            </h1>
            <p className="mb-xl max-w-md font-body-md text-body-md text-on-surface-variant">
              {error.detail || error.title}
            </p>
            <RetryButton />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xxl text-center">
            <h1 className="mb-4 font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
              No products found
            </h1>
            <p className="mb-xl max-w-md font-body-md text-body-md text-on-surface-variant">
              We couldn&apos;t find anything matching
              {q && q !== "*" ? (
                <>
                  {" "}
                  <span className="text-on-surface">&quot;{q}&quot;</span>.
                </>
              ) : (
                "."
              )}{" "}
              Try adjusting your filters or searching for something else.
            </p>
            <div className="flex flex-col items-center gap-md sm:flex-row">
              <a
                href={buildSearchUrl({ q })}
                className="rounded bg-secondary px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-secondary transition-colors hover:bg-secondary-fixed"
              >
                Clear all filters
              </a>
              <Link
                href="/"
                className="rounded border border-on-surface/30 px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors hover:border-on-surface"
              >
                Return to Shop
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-lg flex flex-col justify-between gap-md">
              <div>
                <div className="mb-sm font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
                  {totalElements} Results Found
                </div>
                <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
                  {heading}
                </h1>
              </div>
            </div>
            <ResultsGrid
              key={`grid-${urlKey}-${page}`}
              items={items}
              totalElements={totalElements}
              params={params}
            />
          </>
        )}
      </div>
    </div>
  );
}
