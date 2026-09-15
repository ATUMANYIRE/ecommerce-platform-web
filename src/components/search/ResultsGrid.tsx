"use client";

import { useState } from "react";
import { search } from "@/lib/api/search";
import type { SearchItem } from "@/types/product";
import { ProductCardLink } from "@/components/product/ProductCard";
import { SkeletonCard } from "@/components/search/SearchSkeleton";

export type GridParams = {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: number;
  maxPrice?: number;
};

const PAGE_SIZE = 20;
const PLACEHOLDER = "/images/product-placeholder.svg";

type ResultsGridProps = {
  items: SearchItem[];
  totalElements: number;
  params: GridParams;
};

export default function ResultsGrid({
  items,
  totalElements,
  params,
}: ResultsGridProps) {
  const [productList, setProductList] = useState<SearchItem[]>(items);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasMore = productList.length < totalElements && !error;

  async function loadMore() {
    setLoading(true);
    setError(null);
    try {
      const res = await search({ ...params, page: page + 1, size: PAGE_SIZE });
      setProductList((prev) => [...prev, ...res.items]);
      setPage(page + 1);
    } catch (err) {
      const detail =
        err && typeof err === "object" && "detail" in err
          ? String((err as { detail?: unknown }).detail ?? "")
          : "";
      setError(detail || "Something went wrong while loading more results.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
        {productList.map((item) => (
          <ProductCardLink
            key={item.productId}
            sku={item.sku}
            name={item.name}
            price={item.listPrice}
            currency={item.currency}
            image={item.image ?? PLACEHOLDER}
          />
        ))}
        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
      </div>

      {error && (
        <p className="mt-8 text-center font-body-md text-body-md text-error">
          {error}
        </p>
      )}

      {hasMore && !loading && (
        <div className="mt-xl flex w-full justify-center pb-xl">
          <button
            type="button"
            onClick={loadMore}
            className="rounded border border-on-surface px-8 py-3 font-label-md text-label-md uppercase tracking-widest text-on-surface transition-colors duration-300 hover:bg-on-surface hover:text-background"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
