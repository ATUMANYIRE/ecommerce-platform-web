"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/forms/styles";
import { saveSellerProduct, sellerCategories, useSellerProducts } from "@/lib/demo/seller";
import type { SellerProduct, SellerProductStatus } from "@/lib/demo/seller";
import { useHydrated } from "@/lib/utils/localStorageStore";
import { cn } from "@/lib/utils/cn";

/** catalog-service SKU rule. */
const SKU_PATTERN = /^[A-Z0-9][A-Z0-9-]{1,63}$/;
const sampleImages = ["/images/headphones.png", "/images/tote.png", "/images/keyboard.png", "/images/serum.png", "/images/watch.png", "/images/runner.png"];

function Form({ existing, products }: { existing?: SellerProduct; products: SellerProduct[] }) {
  const router = useRouter();
  const [sku, setSku] = useState(existing?.sku ?? "");
  const [name, setName] = useState(existing?.name ?? "");
  const [description, setDescription] = useState(existing?.description ?? "");
  const [category, setCategory] = useState(existing?.category ?? sellerCategories[0]);
  const [price, setPrice] = useState(existing ? String(existing.price) : "");
  const [stock, setStock] = useState(existing ? String(existing.stock) : "0");
  const [image, setImage] = useState(existing?.image ?? sampleImages[0]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<SellerProductStatus | null>(null);

  async function submit(status: SellerProductStatus) {
    const next: Record<string, string> = {};
    const normalizedSku = sku.trim().toUpperCase();
    if (!SKU_PATTERN.test(normalizedSku)) next.sku = "2–64 characters: letters, numbers and dashes.";
    else if (!existing && products.some((p) => p.sku === normalizedSku)) next.sku = "A product with this SKU already exists.";
    if (!name.trim()) next.name = "Enter a product name.";
    const amount = Number(price);
    if (!Number.isFinite(amount) || amount < 0 || !/^\d+(\.\d{1,2})?$/.test(price.trim())) next.price = "Enter a price such as 49.99.";
    const units = Number(stock);
    if (!Number.isInteger(units) || units < 0) next.stock = "Enter a whole number of units.";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSaving(status);
    await new Promise((resolve) => setTimeout(resolve, 700));
    saveSellerProduct(
      {
        sku: normalizedSku,
        name: name.trim(),
        description: description.trim(),
        category,
        price: amount,
        currency: "USD",
        stock: units,
        status,
        image,
        sold: existing?.sold ?? 0,
        updated: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(Date.now()),
      },
      existing?.sku,
    );
    router.push("/seller/products");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit("Active");
  }

  const fieldError = (key: string) =>
    errors[key] ? <p className="mt-xs font-label-sm text-label-sm text-error">{errors[key]}</p> : null;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-gutter xl:grid-cols-3">
      <div className="flex flex-col gap-gutter xl:col-span-2">
        <section className={cardClass}>
          <h2 className="mb-lg font-title-lg text-title-lg text-ivory">Details</h2>
          <div className="flex flex-col gap-lg">
            <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
              <div>
                <label htmlFor="p-name" className={labelClass}>Product name</label>
                <input id="p-name" maxLength={200} value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="Leather Weekender Bag" />
                {fieldError("name")}
              </div>
              <div>
                <label htmlFor="p-sku" className={labelClass}>SKU</label>
                <input
                  id="p-sku"
                  maxLength={64}
                  value={sku}
                  onChange={(e) => setSku(e.target.value.toUpperCase())}
                  readOnly={Boolean(existing)}
                  className={cn(inputClass, existing && "cursor-not-allowed text-muted")}
                  placeholder="LWB-001"
                />
                {existing ? <p className="mt-xs font-label-sm text-label-sm text-muted">SKUs can&apos;t be changed after creation.</p> : fieldError("sku")}
              </div>
            </div>
            <div>
              <label htmlFor="p-description" className={labelClass}>Description</label>
              <textarea id="p-description" rows={5} maxLength={5000} value={description} onChange={(e) => setDescription(e.target.value)} className={cn(inputClass, "resize-y")} placeholder="Materials, dimensions, care…" />
            </div>
            <div>
              <label htmlFor="p-category" className={labelClass}>Category</label>
              <select id="p-category" value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputClass, "cursor-pointer")}>
                {sellerCategories.map((option) => (
                  <option key={option} className="bg-ink">{option}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className={cardClass}>
          <h2 className="mb-lg font-title-lg text-title-lg text-ivory">Pricing & inventory</h2>
          <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
            <div>
              <label htmlFor="p-price" className={labelClass}>Price (USD)</label>
              <input id="p-price" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass} placeholder="0.00" />
              {fieldError("price")}
            </div>
            <div>
              <label htmlFor="p-stock" className={labelClass}>Units in stock</label>
              <input id="p-stock" inputMode="numeric" value={stock} onChange={(e) => setStock(e.target.value)} className={inputClass} />
              {fieldError("stock")}
            </div>
          </div>
        </section>
      </div>

      <div className="flex flex-col gap-gutter">
        <section className={cardClass}>
          <h2 className="mb-md font-title-lg text-title-lg text-ivory">Image</h2>
          <div className="relative mb-md aspect-square overflow-hidden rounded bg-surface-container-high">
            <Image src={image} alt="Selected product image" fill sizes="320px" className="object-cover" />
          </div>
          <p className="mb-sm font-label-sm text-label-sm uppercase tracking-widest text-muted">Choose a sample image</p>
          <div className="grid grid-cols-6 gap-xs">
            {sampleImages.map((src) => (
              <button
                key={src}
                type="button"
                aria-label={`Use ${src.split("/").pop()}`}
                aria-pressed={image === src}
                onClick={() => setImage(src)}
                className={cn("relative aspect-square overflow-hidden rounded border-2", image === src ? "border-secondary" : "border-transparent opacity-70 hover:opacity-100")}
              >
                <Image src={src} alt="" fill sizes="48px" className="object-cover" />
              </button>
            ))}
          </div>
          <p className="mt-sm flex items-center gap-xs font-body-md text-body-md text-muted">
            <Icon name="add_photo_alternate" className="text-[18px]" />
            Uploads are disabled in the demo.
          </p>
        </section>

        <section className={cn(cardClass, "flex flex-col gap-sm")}>
          <button type="submit" disabled={saving !== null} className={primaryButtonClass}>
            {saving === "Active" ? "Publishing…" : existing?.status === "Active" ? "Save changes" : "Publish product"}
          </button>
          {existing?.status !== "Active" ? (
            <button type="button" disabled={saving !== null} onClick={() => submit("Draft")} className={secondaryButtonClass}>
              {saving === "Draft" ? "Saving…" : "Save as draft"}
            </button>
          ) : (
            <button type="button" disabled={saving !== null} onClick={() => submit("Discontinued")} className={secondaryButtonClass}>
              Discontinue
            </button>
          )}
          <Link href="/seller/products" className="py-sm text-center font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-ivory">
            Cancel
          </Link>
        </section>
      </div>
    </form>
  );
}

/** Create (no sku) or edit a seller product. */
export default function SellerProductForm({ sku }: { sku?: string }) {
  const products = useSellerProducts();
  const hydrated = useHydrated();
  const existing = sku ? products.find((p) => p.sku === sku) : undefined;

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <Link href="/seller/products" className="mb-md inline-flex items-center gap-xs font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-ivory">
        <Icon name="arrow_back" className="text-[18px]" />
        Products
      </Link>
      <DashboardPageHeader
        title={sku ? "Edit product" : "Add product"}
        description={sku ? `SKU ${sku}` : "New products are reviewed before they appear in search."}
      />
      {sku && !existing ? (
        hydrated ? (
          <div className="rounded-lg border border-dashed border-ivory/20 bg-ink p-xxl text-center">
            <p className="mb-md font-title-lg text-title-lg text-ivory">Product not found</p>
            <Link href="/seller/products" className={primaryButtonClass}>Back to products</Link>
          </div>
        ) : null
      ) : (
        <Form key={existing?.sku ?? "new"} existing={existing} products={products} />
      )}
    </div>
  );
}
