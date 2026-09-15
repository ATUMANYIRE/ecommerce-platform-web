"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import { primaryButtonClass } from "@/components/forms/styles";
import { setSellerProductStatus, useSellerProducts } from "@/lib/demo/seller";
import type { SellerProductStatus } from "@/lib/demo/seller";
import { formatAmount } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

const statusTone: Record<SellerProductStatus, string> = {
  Active: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Draft: "border-champagne/30 bg-champagne/10 text-champagne",
  Discontinued: "border-muted/30 bg-muted/10 text-muted",
};

function StockLabel({ stock }: { stock: number }) {
  if (stock <= 0) return <span className="text-error">Out of stock</span>;
  if (stock <= 5) return <span className="text-champagne">{stock} left</span>;
  return <span className="text-on-surface-variant">{stock} in stock</span>;
}

/** Seller catalogue: search, status filter and lifecycle actions (demo). */
export default function SellerProductsView() {
  const products = useSellerProducts();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"All" | SellerProductStatus>("All");

  const needle = query.trim().toLowerCase();
  const visible = products.filter(
    (p) =>
      (status === "All" || p.status === status) &&
      (!needle || p.name.toLowerCase().includes(needle) || p.sku.toLowerCase().includes(needle)),
  );

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader
        title="Products"
        description={`${products.length} products · ${products.filter((p) => p.status === "Active").length} active`}
        actions={
          <Link href="/seller/products/new" className={primaryButtonClass}>
            <Icon name="add" className="text-[18px]" />
            Add Product
          </Link>
        }
      />

      <div className="mb-lg flex flex-col gap-md md:flex-row md:items-center md:justify-between">
        <label className="relative w-full md:w-80">
          <span className="sr-only">Search products</span>
          <Icon name="search" className="absolute left-0 top-1/2 -translate-y-1/2 text-[18px] text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or SKU"
            className="w-full border-0 border-b border-ivory/30 bg-transparent py-sm pl-lg font-body-md text-body-md text-ivory placeholder:text-muted/60 focus:border-secondary focus:outline-none"
          />
        </label>
        <div className="hide-scrollbar flex gap-sm overflow-x-auto" role="tablist" aria-label="Filter by status">
          {(["All", "Active", "Draft", "Discontinued"] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={status === item}
              onClick={() => setStatus(item)}
              className={cn(
                "shrink-0 rounded-full border px-md py-xs font-label-md text-label-md uppercase tracking-wider transition-colors",
                status === item ? "border-secondary bg-secondary/10 text-secondary" : "border-ivory/15 text-on-surface-variant hover:text-ivory",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-ivory/20 bg-ink p-xxl text-center">
          <Icon name="inventory_2" className="mb-md text-[40px] text-muted" />
          <p className="font-title-lg text-title-lg text-ivory">No products match</p>
          <p className="font-body-md text-body-md text-muted">Try a different search or status.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-outline-variant/10 bg-ink">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ivory/10">
                  {["Product", "Category", "Price", "Stock", "Status", "Sold", ""].map((heading) => (
                    <th key={heading} className="px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((product) => (
                  <tr key={product.sku} className="border-b border-ivory/5 transition-colors last:border-0 hover:bg-surface-variant/30">
                    <td className="px-lg py-md">
                      <div className="flex items-center gap-md">
                        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-surface">
                          <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-body-md text-body-md text-on-surface">{product.name}</p>
                          <p className="font-label-sm text-label-sm text-muted">SKU {product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{product.category}</td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface">{formatAmount(product.price, product.currency)}</td>
                    <td className="px-lg py-md font-body-md text-body-md"><StockLabel stock={product.stock} /></td>
                    <td className="px-lg py-md">
                      <span className={cn("inline-block rounded-sm border px-sm py-xs text-[10px] font-bold uppercase tracking-wider", statusTone[product.status])}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{product.sold}</td>
                    <td className="px-lg py-md">
                      <div className="flex items-center justify-end gap-md">
                        {product.status === "Draft" ? (
                          <button
                            type="button"
                            onClick={() => setSellerProductStatus(product.sku, "Active")}
                            className="font-label-md text-label-md uppercase tracking-wider text-secondary hover:text-secondary-fixed"
                          >
                            Publish
                          </button>
                        ) : null}
                        <Link
                          href={`/seller/products/${encodeURIComponent(product.sku)}`}
                          className="inline-flex items-center gap-xs font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-ivory"
                        >
                          <Icon name="edit" className="text-[16px]" />
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
