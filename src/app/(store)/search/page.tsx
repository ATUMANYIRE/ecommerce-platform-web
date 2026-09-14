import Link from "next/link";
import Filters from "@/components/search/Filters";
import ResultsGrid from "@/components/search/ResultsGrid";
import RetryButton from "@/components/search/RetryButton";
import { search } from "@/lib/api/search";
import type { ApiError } from "@/lib/api/client";
import type { GridParams } from "@/components/search/ResultsGrid";
import { buildSearchUrl } from "@/lib/search-url";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function asString(v: string | string[] | undefined): string | undefined {
  return typeof v === "string" ? v : undefined;
}

function asNumber(v: string | string[] | undefined): number | undefined {
  const s = asString(v);
  if (s === undefined || s === "") return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const raw = await searchParams;

  const q = asString(raw.q);
  const categoryId = asString(raw.categoryId);
  const brandId = asString(raw.brandId);
  const minPrice = asNumber(raw.minPrice);
  const maxPrice = asNumber(raw.maxPrice);
  const page = asNumber(raw.page) ?? 0;

  const params: GridParams = { q, categoryId, brandId, minPrice, maxPrice };
  // Whole-string key so Filters/Results client state resets on every navigation.
  const urlKey = buildSearchUrl({
    q,
    categoryId,
    brandId,
    minPrice: minPrice !== undefined ? String(minPrice) : undefined,
    maxPrice: maxPrice !== undefined ? String(maxPrice) : undefined,
  });

  let items: Awaited<ReturnType<typeof search>>["items"] = [];
  let totalElements = 0;
  let error: ApiError | null = null;

  try {
    const res = await search({ ...params, page, size: PAGE_SIZE });
    items = res.items;
    totalElements = res.totalElements;
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      error = err as ApiError;
    } else {
      error = { status: 0, title: "Request failed", extensions: {} };
    }
  }

  const heading =
    q && q !== "*" ? `Results for "${q}"` : "All Products";

  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-xl px-margin-mobile py-xl md:flex-row md:px-margin-desktop md:py-xxl">
      <Filters
        key={`filters-${urlKey}`}
        q={q}
        categoryId={categoryId}
        brandId={brandId}
        minPrice={minPrice !== undefined ? String(minPrice) : undefined}
        maxPrice={maxPrice !== undefined ? String(maxPrice) : undefined}
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
