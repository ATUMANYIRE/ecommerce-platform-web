"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { useAddresses } from "@/context/AddressContext";
import { useCart } from "@/context/CartContext";
import SummaryItems from "@/components/checkout/SummaryItems";
import Icon from "@/components/ui/Icon";
import { formatAmount } from "@/lib/utils/currency";

const inputClass =
  "w-full border-0 border-b border-on-surface-variant/30 bg-surface px-0 py-sm font-body-lg text-body-lg text-on-surface transition-colors focus:border-on-surface focus:outline-none";
const labelClass =
  "mb-xs font-label-md text-label-md uppercase text-on-surface-variant";

export default function AddAddressPage() {
  const router = useRouter();
  const { addAddress } = useAddresses();
  const { items, subtotal } = useCart();
  const currency = items[0]?.currency ?? "USD";
  const [form, setForm] = useState({
    fullName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "US",
  });

  const countries: Record<string, string> = {
    US: "United States",
    UK: "United Kingdom",
    CA: "Canada",
    AU: "Australia",
  };

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addAddress({
      name: form.fullName.trim(),
      line1: form.addressLine1.trim(),
      line2: form.addressLine2.trim() || undefined,
      city: form.city.trim(),
      postalCode: form.postalCode.trim(),
      country: countries[form.country] ?? form.country,
    });
    router.push("/checkout");
  }

  return (
    <div className="mx-auto grid w-full max-w-max-width flex-grow grid-cols-1 gap-gutter px-margin-mobile py-xxl md:grid-cols-12 md:px-margin-desktop">
      <section className="flex flex-col gap-lg md:col-span-7">
        <div className="mb-md">
          <nav
            aria-label="Breadcrumb"
            className="mb-lg flex items-center font-label-md text-label-md"
          >
            <ol className="inline-flex items-center space-x-2">
              <li>
                <Link
                  href="/checkout"
                  className="uppercase text-on-surface-variant transition-colors hover:text-secondary"
                >
                  Checkout
                </Link>
              </li>
              <li aria-hidden="true">
                <span className="mx-2 text-on-surface-variant">/</span>
              </li>
              <li aria-current="page">
                <span className="uppercase text-on-surface">Add Address</span>
              </li>
            </ol>
          </nav>
          <h1 className="mb-sm font-headline-lg-mobile text-headline-lg-mobile text-on-background md:text-headline-lg">
            Add New Address
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Please enter the details for your delivery destination.
          </p>
        </div>

        <div className="rounded-lg border border-on-surface/5 bg-surface-container-low p-lg">
          <form className="flex flex-col gap-lg" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <label className={labelClass} htmlFor="fullName">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={(e) => update("fullName", e.target.value)}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClass} htmlFor="addressLine1">
                Street Address
              </label>
              <input
                id="addressLine1"
                type="text"
                required
                value={form.addressLine1}
                onChange={(e) => update("addressLine1", e.target.value)}
                placeholder="123 Luxury Lane"
                className={inputClass}
              />
            </div>
            <div className="flex flex-col">
              <label className={labelClass} htmlFor="addressLine2">
                Apartment, suite, etc. (Optional)
              </label>
              <input
                id="addressLine2"
                type="text"
                value={form.addressLine2}
                onChange={(e) => update("addressLine2", e.target.value)}
                placeholder="Apt 4B"
                className={inputClass}
              />
            </div>
            <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="city">
                  City
                </label>
                <input
                  id="city"
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => update("city", e.target.value)}
                  placeholder="New York"
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col">
                <label className={labelClass} htmlFor="postalCode">
                  Postal / Zip Code
                </label>
                <input
                  id="postalCode"
                  type="text"
                  required
                  value={form.postalCode}
                  onChange={(e) => update("postalCode", e.target.value)}
                  placeholder="10001"
                  className={inputClass}
                />
              </div>
            </div>
            <div className="relative flex flex-col">
              <label className={labelClass} htmlFor="country">
                Country
              </label>
              <select
                id="country"
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                className="w-full cursor-pointer appearance-none border-0 border-b border-on-surface-variant/30 bg-surface px-0 py-sm font-body-lg text-body-lg text-on-surface transition-colors focus:border-on-surface focus:outline-none"
              >
                {Object.entries(countries).map(([code, name]) => (
                  <option key={code} value={code} className="bg-surface text-on-surface">
                    {name}
                  </option>
                ))}
              </select>
              <Icon
                name="expand_more"
                className="pointer-events-none absolute right-0 top-1/2 mt-sm -translate-y-1/2 text-on-surface-variant"
              />
            </div>

            <div className="mt-lg flex flex-col-reverse items-center justify-end gap-md md:flex-row">
              <Link
                href="/checkout"
                className="w-full px-lg py-sm font-label-md text-label-md uppercase text-on-surface-variant transition-colors hover:text-on-surface md:w-auto"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="w-full rounded bg-secondary px-xl py-md text-center font-label-md text-label-md uppercase text-surface transition-colors hover:bg-secondary-fixed md:w-auto"
              >
                Save Address
              </button>
            </div>
          </form>
        </div>
      </section>

      <aside className="hidden md:col-span-5 md:block">
        <div className="sticky top-xxl">
          <h2 className="mb-lg border-b border-on-surface/10 pb-sm font-title-lg text-title-lg text-on-background">
            Order Summary
          </h2>
          <div className="mb-xl">
            <SummaryItems items={items} />
          </div>
          <div className="flex flex-col gap-sm border-t border-on-surface/10 pt-lg font-body-md text-body-md">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="text-on-surface">
                {formatAmount(subtotal, currency)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Shipping</span>
              <span className="text-on-surface-variant italic">
                Calculated at next step
              </span>
            </div>
            <div className="mt-sm flex justify-between border-t border-on-surface/10 pt-sm">
              <span className="font-title-lg text-title-lg text-on-surface">
                Total
              </span>
              <span className="font-headline-lg text-headline-lg text-on-surface">
                {formatAmount(subtotal, currency)}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}