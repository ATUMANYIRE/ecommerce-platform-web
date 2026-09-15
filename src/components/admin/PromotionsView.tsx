"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import { cardClass, inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/forms/styles";
import { addPromotion, promotionState, setPromotionActive, usePromotions } from "@/lib/demo/admin";
import type { Promotion, PromotionState } from "@/lib/demo/admin";
import { formatAmount } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

const stateTone: Record<PromotionState, string> = {
  Active: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Scheduled: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  Expired: "border-muted/30 bg-muted/10 text-muted",
  "Used up": "border-champagne/30 bg-champagne/10 text-champagne",
  Paused: "border-error/30 bg-error/10 text-error",
};

function CreateForm({ existing, onDone }: { existing: Promotion[]; onDone: () => void }) {
  const today = new Date().toISOString().slice(0, 10);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<Promotion["discountType"]>("PERCENT");
  const [discountValue, setDiscountValue] = useState("10");
  const [minOrder, setMinOrder] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startsAt, setStartsAt] = useState(today);
  const [expiresAt, setExpiresAt] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = code.trim().toUpperCase();
    const value = Number(discountValue);
    if (!/^[A-Z0-9]{3,32}$/.test(normalized)) return setError("Code must be 3–32 letters or numbers.");
    if (existing.some((p) => p.code === normalized)) return setError("That code already exists.");
    if (!Number.isFinite(value) || value <= 0 || (discountType === "PERCENT" && value > 100)) {
      return setError(discountType === "PERCENT" ? "Percentage must be between 1 and 100." : "Enter an amount above zero.");
    }
    if (!expiresAt || expiresAt <= startsAt) return setError("The end date must be after the start date.");
    setError(null);
    addPromotion({
      code: normalized,
      discountType,
      discountValue: value,
      minOrderAmount: minOrder ? Number(minOrder) : undefined,
      usageLimit: usageLimit ? Math.floor(Number(usageLimit)) : undefined,
      usageCount: 0,
      startsAt,
      expiresAt,
      active: true,
    });
    onDone();
  }

  return (
    <form onSubmit={handleSubmit} className={cn(cardClass, "mb-xl")}>
      <div className="mb-lg flex items-center justify-between">
        <h2 className="font-title-lg text-title-lg text-ivory">New promotion</h2>
        <button type="button" aria-label="Close" onClick={onDone} className="text-on-surface-variant hover:text-ivory">
          <Icon name="close" />
        </button>
      </div>
      {error ? (
        <p role="alert" className="mb-lg flex items-center gap-sm rounded border border-error/20 bg-error-container/10 p-md font-body-md text-body-md text-error">
          <Icon name="error" className="text-[18px]" /> {error}
        </p>
      ) : null}
      <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
        <div>
          <label htmlFor="pr-code" className={labelClass}>Code</label>
          <input id="pr-code" required value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={32} className={inputClass} placeholder="SPRING20" />
        </div>
        <div>
          <label htmlFor="pr-type" className={labelClass}>Discount type</label>
          <select id="pr-type" value={discountType} onChange={(e) => setDiscountType(e.target.value as Promotion["discountType"])} className={cn(inputClass, "cursor-pointer")}>
            <option value="PERCENT" className="bg-ink">Percentage</option>
            <option value="FIXED" className="bg-ink">Fixed amount (USD)</option>
          </select>
        </div>
        <div>
          <label htmlFor="pr-value" className={labelClass}>{discountType === "PERCENT" ? "Percent off" : "Amount off"}</label>
          <input id="pr-value" inputMode="decimal" required value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="pr-min" className={labelClass}>Minimum order (optional)</label>
          <input id="pr-min" inputMode="decimal" value={minOrder} onChange={(e) => setMinOrder(e.target.value)} className={inputClass} placeholder="0" />
        </div>
        <div>
          <label htmlFor="pr-start" className={labelClass}>Starts</label>
          <input id="pr-start" type="date" required value={startsAt} onChange={(e) => setStartsAt(e.target.value)} className={cn(inputClass, "[color-scheme:dark]")} />
        </div>
        <div>
          <label htmlFor="pr-end" className={labelClass}>Ends</label>
          <input id="pr-end" type="date" required value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} className={cn(inputClass, "[color-scheme:dark]")} />
        </div>
        <div>
          <label htmlFor="pr-limit" className={labelClass}>Usage limit (optional)</label>
          <input id="pr-limit" inputMode="numeric" value={usageLimit} onChange={(e) => setUsageLimit(e.target.value)} className={inputClass} placeholder="Unlimited" />
        </div>
      </div>
      <div className="mt-xl flex gap-sm">
        <button type="submit" className={primaryButtonClass}>Create promotion</button>
        <button type="button" onClick={onDone} className={secondaryButtonClass}>Cancel</button>
      </div>
    </form>
  );
}

/** Promotion codes: create, pause and resume (demo). */
export default function PromotionsView({ startCreating = false }: { startCreating?: boolean }) {
  const promotions = usePromotions();
  const [creating, setCreating] = useState(startCreating);

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader
        title="Promotions"
        description="Discount codes customers can apply at checkout."
        actions={
          creating ? null : (
            <button type="button" onClick={() => setCreating(true)} className={primaryButtonClass}>
              <Icon name="add" className="text-[18px]" /> New promotion
            </button>
          )
        }
      />

      {creating ? <CreateForm existing={promotions} onDone={() => setCreating(false)} /> : null}

      <div className="overflow-hidden rounded border border-outline-variant/10 bg-ink">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ivory/10">
                {["Code", "Discount", "Conditions", "Usage", "Window", "Status", ""].map((heading) => (
                  <th key={heading} className="px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {promotions.map((promotion) => {
                const state = promotionState(promotion);
                const usagePercent = promotion.usageLimit ? Math.min(100, (promotion.usageCount / promotion.usageLimit) * 100) : null;
                return (
                  <tr key={promotion.code} className="border-b border-ivory/5 last:border-0">
                    <td className="px-lg py-md font-body-md text-body-md font-semibold tracking-wider text-ivory">{promotion.code}</td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface">
                      {promotion.discountType === "PERCENT" ? `${promotion.discountValue}% off` : `${formatAmount(promotion.discountValue, "USD")} off`}
                    </td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">
                      {promotion.minOrderAmount ? `Orders over ${formatAmount(promotion.minOrderAmount, "USD")}` : "Any order"}
                    </td>
                    <td className="px-lg py-md">
                      <p className="font-body-md text-body-md text-on-surface">
                        {promotion.usageCount}{promotion.usageLimit ? ` / ${promotion.usageLimit}` : ""}
                      </p>
                      {usagePercent !== null ? (
                        <div className="mt-xs h-1 w-24 rounded-full bg-surface-container-highest">
                          <div className="h-1 rounded-full bg-secondary" style={{ width: `${usagePercent}%` }} />
                        </div>
                      ) : null}
                    </td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">
                      {promotion.startsAt} → {promotion.expiresAt}
                    </td>
                    <td className="px-lg py-md">
                      <span className={cn("inline-block rounded-sm border px-sm py-xs text-[10px] font-bold uppercase tracking-wider", stateTone[state])}>{state}</span>
                    </td>
                    <td className="px-lg py-md text-right">
                      <button
                        type="button"
                        onClick={() => setPromotionActive(promotion.code, !promotion.active)}
                        className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-ivory"
                      >
                        {promotion.active ? "Pause" : "Resume"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
