"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import { cardClass, inputClass, labelClass, primaryButtonClass } from "@/components/forms/styles";
import { storeProfileStore, useStoreProfile } from "@/lib/demo/seller";
import type { StoreProfile } from "@/lib/demo/seller";
import { useHydrated } from "@/lib/utils/localStorageStore";
import { cn } from "@/lib/utils/cn";

function SettingsForm({ profile }: { profile: StoreProfile }) {
  const [form, setForm] = useState(profile);
  const [saved, setSaved] = useState(false);

  function update<K extends keyof StoreProfile>(key: K, value: StoreProfile[K]) {
    setForm((previous) => ({ ...previous, [key]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    storeProfileStore.set({ ...form, storeName: form.storeName.trim(), businessName: form.businessName.trim() });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-4xl flex-col gap-gutter">
      <section className={cardClass}>
        <h2 className="mb-lg font-title-lg text-title-lg text-ivory">Store profile</h2>
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <div>
            <label htmlFor="s-name" className={labelClass}>Store name</label>
            <input id="s-name" required maxLength={80} value={form.storeName} onChange={(e) => update("storeName", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="s-business" className={labelClass}>Registered business name</label>
            <input id="s-business" maxLength={120} value={form.businessName} onChange={(e) => update("businessName", e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="s-email" className={labelClass}>Customer contact e-mail</label>
            <input id="s-email" type="email" required maxLength={254} value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className={inputClass} />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="s-description" className={labelClass}>Store description</label>
            <textarea id="s-description" rows={4} maxLength={1000} value={form.description} onChange={(e) => update("description", e.target.value)} className={cn(inputClass, "resize-y")} />
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="mb-lg font-title-lg text-title-lg text-ivory">Fulfilment & policies</h2>
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <div>
            <label htmlFor="s-processing" className={labelClass}>Handling time (business days)</label>
            <select id="s-processing" value={form.processingDays} onChange={(e) => update("processingDays", Number(e.target.value))} className={cn(inputClass, "cursor-pointer")}>
              {[1, 2, 3, 5].map((days) => <option key={days} value={days} className="bg-ink">{days}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="s-returns" className={labelClass}>Return window (days)</label>
            <select id="s-returns" value={form.returnDays} onChange={(e) => update("returnDays", Number(e.target.value))} className={cn(inputClass, "cursor-pointer")}>
              {[14, 30, 60].map((days) => <option key={days} value={days} className="bg-ink">{days}</option>)}
            </select>
          </div>
        </div>
      </section>

      <section className={cardClass}>
        <h2 className="mb-xs font-title-lg text-title-lg text-ivory">Payouts</h2>
        <p className="mb-lg font-body-md text-body-md text-muted">Earnings are paid every Friday for orders delivered the previous week.</p>
        <div className="grid grid-cols-1 gap-md sm:grid-cols-2" role="radiogroup" aria-label="Payout method">
          {(["Bank transfer", "PayPal"] as const).map((method) => (
            <button
              key={method}
              type="button"
              role="radio"
              aria-checked={form.payoutMethod === method}
              onClick={() => update("payoutMethod", method)}
              className={cn(
                "flex items-center gap-md rounded-lg border p-md text-left transition-colors",
                form.payoutMethod === method ? "border-secondary bg-surface-container-low" : "border-outline/20 hover:border-outline/50",
              )}
            >
              <Icon name={method === "PayPal" ? "account_balance_wallet" : "payments"} className="text-[24px] text-on-surface-variant" />
              <span className="font-body-lg text-body-lg text-on-surface">{method}</span>
            </button>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-md">
        <button type="submit" className={primaryButtonClass}>Save settings</button>
        {saved ? (
          <span role="status" className="inline-flex items-center gap-xs font-label-md text-label-md text-secondary">
            <Icon name="check_circle" className="text-[16px]" /> Settings saved
          </span>
        ) : null}
      </div>
    </form>
  );
}

export default function SellerSettingsView() {
  const profile = useStoreProfile();
  const hydrated = useHydrated();
  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader title="Settings" description="How your store appears to customers and how you get paid." />
      <SettingsForm key={hydrated ? "stored" : "default"} profile={profile} />
    </div>
  );
}
