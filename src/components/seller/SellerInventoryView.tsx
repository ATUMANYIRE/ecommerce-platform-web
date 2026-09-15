"use client";

import Image from "next/image";
import { useState } from "react";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import { setSellerStock, useSellerProducts } from "@/lib/demo/seller";
import type { SellerProduct } from "@/lib/demo/seller";
import { cn } from "@/lib/utils/cn";

const LOW_STOCK = 5;

function StockRow({ product }: { product: SellerProduct }) {
  const [draft, setDraft] = useState(String(product.stock));
  const [saved, setSaved] = useState(false);
  const value = Number(draft);
  const valid = Number.isInteger(value) && value >= 0 && value <= 99_999;
  const dirty = valid && value !== product.stock;

  function commit(next: number) {
    setSellerStock(product.sku, next);
    setDraft(String(Math.max(0, next)));
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  const state = product.stock <= 0 ? "out" : product.stock <= LOW_STOCK ? "low" : "ok";

  return (
    <tr className="border-b border-ivory/5 last:border-0">
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
      <td className="px-lg py-md">
        <span
          className={cn(
            "inline-flex items-center gap-xs font-label-md text-label-md uppercase tracking-wider",
            state === "out" ? "text-error" : state === "low" ? "text-champagne" : "text-emerald-200",
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", state === "out" ? "bg-error" : state === "low" ? "bg-champagne" : "bg-emerald-300")} />
          {state === "out" ? "Out of stock" : state === "low" ? "Low stock" : "Healthy"}
        </span>
      </td>
      <td className="px-lg py-md">
        <div className="flex items-center gap-sm">
          <button
            type="button"
            aria-label={`Remove one ${product.name}`}
            disabled={product.stock <= 0}
            onClick={() => commit(product.stock - 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-ivory/15 text-on-surface-variant hover:text-ivory disabled:opacity-40"
          >
            <Icon name="remove" className="text-[16px]" />
          </button>
          <input
            aria-label={`Stock for ${product.name}`}
            inputMode="numeric"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && dirty) commit(value);
            }}
            className={cn(
              "w-20 border-0 border-b bg-transparent py-xs text-center font-body-md text-body-md text-ivory focus:outline-none",
              valid ? "border-ivory/30 focus:border-secondary" : "border-error",
            )}
          />
          <button
            type="button"
            aria-label={`Add one ${product.name}`}
            onClick={() => commit(product.stock + 1)}
            className="grid h-8 w-8 place-items-center rounded-full border border-ivory/15 text-on-surface-variant hover:text-ivory"
          >
            <Icon name="add" className="text-[16px]" />
          </button>
        </div>
      </td>
      <td className="px-lg py-md text-right">
        {saved ? (
          <span role="status" className="inline-flex items-center gap-xs font-label-md text-label-md text-secondary">
            <Icon name="check_circle" className="text-[16px]" /> Saved
          </span>
        ) : (
          <div className="flex justify-end gap-sm">
            <button
              type="button"
              disabled={!dirty}
              onClick={() => commit(value)}
              className="font-label-md text-label-md uppercase tracking-wider text-secondary hover:text-secondary-fixed disabled:text-muted disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => commit(product.stock + 25)}
              className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-ivory"
            >
              +25
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

/** Stock levels per product with quick adjustments (demo). */
export default function SellerInventoryView() {
  const products = useSellerProducts();
  const [onlyAttention, setOnlyAttention] = useState(false);
  const attention = products.filter((p) => p.stock <= LOW_STOCK && p.status !== "Discontinued");
  const visible = (onlyAttention ? attention : products).filter((p) => p.status !== "Discontinued");
  const units = products.reduce((sum, p) => sum + p.stock, 0);

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader title="Inventory" description="Keep stock accurate so customers never order what you can't ship." />

      <section className="mb-xl grid grid-cols-1 gap-md sm:grid-cols-3">
        {[
          { label: "Units in stock", value: units.toLocaleString("en-US"), icon: "inventory_2" as const, alert: false },
          { label: "Low stock", value: String(attention.filter((p) => p.stock > 0).length), icon: "warning" as const, alert: false },
          { label: "Out of stock", value: String(attention.filter((p) => p.stock <= 0).length), icon: "block" as const, alert: true },
        ].map((metric) => (
          <div key={metric.label} className={cn("rounded border bg-ink p-lg", metric.alert ? "border-error/30" : "border-outline-variant/10")}>
            <div className="mb-md flex items-center justify-between">
              <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">{metric.label}</p>
              <Icon name={metric.icon} className={metric.alert ? "text-error" : "text-on-surface-variant/50"} />
            </div>
            <p className="font-display-md text-display-md text-on-surface">{metric.value}</p>
          </div>
        ))}
      </section>

      <label className="mb-md inline-flex cursor-pointer items-center gap-sm font-body-md text-body-md text-on-surface-variant">
        <input type="checkbox" checked={onlyAttention} onChange={(e) => setOnlyAttention(e.target.checked)} className="h-4 w-4 accent-secondary" />
        Show only items that need attention
      </label>

      <div className="overflow-hidden rounded border border-outline-variant/10 bg-ink">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ivory/10">
                {["Product", "Status", "Units", ""].map((heading) => (
                  <th key={heading} className="px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((product) => (
                <StockRow key={`${product.sku}-${product.stock}`} product={product} />
              ))}
            </tbody>
          </table>
        </div>
        {visible.length === 0 ? (
          <p className="p-xl text-center font-body-md text-body-md text-muted">Nothing needs attention right now.</p>
        ) : null}
      </div>
    </div>
  );
}
