"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { categories, brands } from "@/config/categories";
import type { Brand, Category } from "@/config/categories";
import { buildSearchUrl } from "@/lib/search-url";
import type { SearchUrlValues } from "@/lib/search-url";

type FiltersProps = {
  q?: string;
  categoryId?: string;
  brandId?: string;
  minPrice?: string;
  maxPrice?: string;
};

export default function Filters(initial: FiltersProps) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState(initial.categoryId);
  const [brandId, setBrandId] = useState(initial.brandId);
  const [minPrice, setMinPrice] = useState(initial.minPrice ?? "");
  const [maxPrice, setMaxPrice] = useState(initial.maxPrice ?? "");

  function navigate(next: SearchUrlValues) {
    router.push(
      buildSearchUrl({
        q: initial.q,
        categoryId,
        brandId,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        ...next,
      }),
    );
  }

  function toggleCategory(cat: Category) {
    const next = categoryId === cat.categoryId ? undefined : cat.categoryId;
    setCategoryId(next);
    navigate({ categoryId: next });
  }

  function toggleBrand(brand: Brand) {
    const next = brandId === brand.brandId ? undefined : brand.brandId;
    setBrandId(next);
    navigate({ brandId: next });
  }

  function applyPrice() {
    navigate({ minPrice: minPrice || undefined, maxPrice: maxPrice || undefined });
  }

  function clearAll() {
    setCategoryId(undefined);
    setBrandId(undefined);
    setMinPrice("");
    setMaxPrice("");
    router.push(buildSearchUrl({ q: initial.q }));
  }

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="flex flex-col gap-lg">
        <div className="mb-md flex items-baseline justify-between">
          <h2 className="font-title-lg text-title-lg text-on-surface">Filters</h2>
          <button
            type="button"
            onClick={clearAll}
            className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Clear All
          </button>
        </div>

        <div className="border-t border-outline-variant/30 pt-md">
          <h3 className="mb-md font-label-md text-label-md uppercase tracking-widest text-on-surface">
            Category
          </h3>
          <div className="flex flex-col gap-sm">
            {categories.map((cat) => (
              <label key={cat.categoryId} className="group flex cursor-pointer items-center gap-sm">
                <input
                  type="checkbox"
                  checked={categoryId === cat.categoryId}
                  onChange={() => toggleCategory(cat)}
                  className="h-4 w-4 accent-secondary"
                />
                <span className="font-body-md text-body-md text-on-surface-variant transition-colors group-hover:text-on-surface">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-outline-variant/30 pt-md">
          <h3 className="mb-md font-label-md text-label-md uppercase tracking-widest text-on-surface">
            Brand
          </h3>
          <div className="flex flex-col gap-sm">
            {brands.map((brand) => (
              <label key={brand.brandId} className="group flex cursor-pointer items-center gap-sm">
                <input
                  type="checkbox"
                  checked={brandId === brand.brandId}
                  onChange={() => toggleBrand(brand)}
                  className="h-4 w-4 accent-secondary"
                />
                <span className="font-body-md text-body-md text-on-surface-variant transition-colors group-hover:text-on-surface">
                  {brand.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border-t border-outline-variant/30 pt-md">
          <h3 className="mb-md font-label-md text-label-md uppercase tracking-widest text-on-surface">
            Price
          </h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              applyPrice();
            }}
            className="flex flex-col gap-md"
          >
            <div className="flex items-center gap-sm">
              <input
                type="number"
                min="0"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                aria-label="Minimum price"
                className="w-full rounded-none border-b border-outline-variant bg-surface-container-low px-2 py-2 font-body-md text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:border-white focus:outline-none"
              />
              <span className="text-on-surface-variant">-</span>
              <input
                type="number"
                min="0"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                aria-label="Maximum price"
                className="w-full rounded-none border-b border-outline-variant bg-surface-container-low px-2 py-2 font-body-md text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:border-white focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="font-label-md text-label-md uppercase tracking-widest text-on-surface-variant transition-colors hover:text-on-surface"
            >
              Apply
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
