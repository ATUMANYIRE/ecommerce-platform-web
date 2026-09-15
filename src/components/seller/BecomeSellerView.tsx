"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { cardClass, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/forms/styles";
import { sellerCategories, storeProfileStore } from "@/lib/demo/seller";
import { cn } from "@/lib/utils/cn";

const perks: { icon: IconName; title: string; copy: string }[] = [
  { icon: "group", title: "A discerning audience", copy: "Customers who come to Atlas for quality, not the lowest price." },
  { icon: "payments", title: "Weekly payouts", copy: "Earnings paid every Friday with clear, flat commission." },
  { icon: "dashboard", title: "A real Seller Hub", copy: "Products, stock, orders and reviews in one dashboard." },
];

const steps = ["Store", "Business", "Review"];

/** Seller onboarding wizard (demo): collects store details and opens the Seller Hub. */
export default function BecomeSellerView() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [storeName, setStoreName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(sellerCategories[0]);
  const [businessName, setBusinessName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [country, setCountry] = useState("United States");
  const [agreed, setAgreed] = useState(false);

  function next(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    storeProfileStore.set((previous) => ({
      ...previous,
      storeName: storeName.trim(),
      businessName: businessName.trim(),
      contactEmail: contactEmail.trim(),
      description: description.trim(),
    }));
    setDone(true);
  }

  return (
    <div className="flex flex-col">
      <section className="relative flex min-h-[380px] items-end overflow-hidden">
        <Image src="/images/lifestyle-screen.png" alt="" fill priority sizes="100vw" className="object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        <div className="relative mx-auto w-full max-w-max-width px-margin-mobile pb-xl md:px-margin-desktop">
          <p className="mb-sm font-label-md text-label-md uppercase tracking-widest text-secondary">Sell on Atlas</p>
          <h1 className="max-w-3xl font-display-md text-headline-lg-mobile text-on-surface md:text-display-lg">
            Your craft deserves the right audience.
          </h1>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-max-width grid-cols-1 gap-gutter px-margin-mobile py-xxl md:px-margin-desktop lg:grid-cols-12">
        <aside className="flex flex-col gap-lg lg:col-span-5">
          {perks.map((perk) => (
            <div key={perk.title} className="flex gap-md">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-surface-container-highest">
                <Icon name={perk.icon} className="text-[22px] text-secondary" />
              </span>
              <div>
                <h2 className="font-title-lg text-title-lg text-ivory">{perk.title}</h2>
                <p className="font-body-md text-body-md text-muted">{perk.copy}</p>
              </div>
            </div>
          ))}
        </aside>

        <div className="lg:col-span-7">
          {done ? (
            <section className={cn(cardClass, "flex flex-col items-center py-xxl text-center")}>
              <Icon name="storefront" className="mb-md text-[56px] text-secondary" />
              <h2 className="mb-sm font-headline-lg-mobile text-headline-lg-mobile text-ivory">
                Welcome aboard, {storeName || "new seller"}
              </h2>
              <p className="mb-xl max-w-md font-body-md text-body-md text-muted">
                Your store is set up. Add your first product to start selling. (Demo store: no application was submitted.)
              </p>
              <div className="flex flex-col gap-sm sm:flex-row">
                <Link href="/seller/products/new" className={primaryButtonClass}>Add your first product</Link>
                <Link href="/seller" className={secondaryButtonClass}>Open Seller Hub</Link>
              </div>
            </section>
          ) : (
            <form onSubmit={next} className={cardClass}>
              <ol className="mb-xl flex items-center gap-sm" aria-label="Progress">
                {steps.map((label, index) => (
                  <li key={label} className="flex flex-1 items-center gap-sm">
                    <span
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 font-label-md text-label-md",
                        index < step ? "border-secondary bg-secondary text-obsidian" : index === step ? "border-secondary text-secondary" : "border-outline/30 text-muted",
                      )}
                      aria-current={index === step ? "step" : undefined}
                    >
                      {index < step ? <Icon name="check" className="text-[14px]" /> : index + 1}
                    </span>
                    <span className={cn("hidden font-label-md text-label-md uppercase tracking-wider sm:inline", index === step ? "text-ivory" : "text-muted")}>
                      {label}
                    </span>
                    {index < steps.length - 1 ? <span className="h-px flex-1 bg-outline/20" /> : null}
                  </li>
                ))}
              </ol>

              {step === 0 ? (
                <div className="flex flex-col gap-lg">
                  <h2 className="font-title-lg text-title-lg text-ivory">Tell us about your store</h2>
                  <div>
                    <label htmlFor="bs-store" className={labelClass}>Store name</label>
                    <input id="bs-store" required maxLength={80} value={storeName} onChange={(e) => setStoreName(e.target.value)} className={inputClass} placeholder="Maison Vance" />
                  </div>
                  <div>
                    <label htmlFor="bs-category" className={labelClass}>Main category</label>
                    <select id="bs-category" value={category} onChange={(e) => setCategory(e.target.value)} className={cn(inputClass, "cursor-pointer")}>
                      {sellerCategories.map((option) => <option key={option} className="bg-ink">{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bs-description" className={labelClass}>What do you make or sell?</label>
                    <textarea id="bs-description" required rows={4} maxLength={1000} value={description} onChange={(e) => setDescription(e.target.value)} className={cn(inputClass, "resize-y")} />
                  </div>
                </div>
              ) : step === 1 ? (
                <div className="flex flex-col gap-lg">
                  <h2 className="font-title-lg text-title-lg text-ivory">Business details</h2>
                  <div>
                    <label htmlFor="bs-business" className={labelClass}>Registered business name</label>
                    <input id="bs-business" required maxLength={120} value={businessName} onChange={(e) => setBusinessName(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="bs-email" className={labelClass}>Contact e-mail</label>
                    <input id="bs-email" type="email" required maxLength={254} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} className={inputClass} />
                  </div>
                  <div>
                    <label htmlFor="bs-country" className={labelClass}>Country</label>
                    <select id="bs-country" value={country} onChange={(e) => setCountry(e.target.value)} className={cn(inputClass, "cursor-pointer")}>
                      {["United States", "Canada", "United Kingdom", "Australia"].map((option) => <option key={option} className="bg-ink">{option}</option>)}
                    </select>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-lg">
                  <h2 className="font-title-lg text-title-lg text-ivory">Review & submit</h2>
                  <dl className="grid grid-cols-1 gap-md rounded border border-ivory/10 bg-surface-container-low p-md sm:grid-cols-2">
                    {[
                      ["Store", storeName],
                      ["Category", category],
                      ["Business", businessName],
                      ["Contact", contactEmail],
                      ["Country", country],
                    ].map(([term, detail]) => (
                      <div key={term}>
                        <dt className="font-label-sm text-label-sm uppercase tracking-widest text-muted">{term}</dt>
                        <dd className="font-body-md text-body-md text-ivory">{detail}</dd>
                      </div>
                    ))}
                  </dl>
                  <label className="flex cursor-pointer items-start gap-md">
                    <input type="checkbox" required checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 accent-secondary" />
                    <span className="font-body-md text-body-md text-on-surface-variant">
                      I agree to the <Link href="/terms" className="text-secondary underline underline-offset-4">seller terms</Link> and confirm the details are accurate.
                    </span>
                  </label>
                </div>
              )}

              <div className="mt-xl flex items-center justify-between border-t border-ivory/10 pt-lg">
                {step > 0 ? (
                  <button type="button" onClick={() => setStep(step - 1)} className={secondaryButtonClass}>Back</button>
                ) : (
                  <span />
                )}
                <button type="submit" className={primaryButtonClass}>
                  {step < steps.length - 1 ? "Continue" : "Open my store"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
