"use client";

import Image from "next/image";
import { useState } from "react";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import { inputClass, labelClass, primaryButtonClass, secondaryButtonClass } from "@/components/forms/styles";
import { sellerOrderTotal, updateSellerOrder, useSellerOrders } from "@/lib/demo/seller";
import type { SellerOrder, SellerOrderStatus } from "@/lib/demo/seller";
import { formatAmount } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

const tabs = ["All", "New", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

const tone: Record<SellerOrderStatus, string> = {
  New: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  Processing: "border-champagne/30 bg-champagne/10 text-champagne",
  Shipped: "border-violet-300/30 bg-violet-300/10 text-violet-200",
  Delivered: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Cancelled: "border-error/30 bg-error/10 text-error",
};

function Chip({ status }: { status: SellerOrderStatus }) {
  return (
    <span className={cn("inline-block rounded-sm border px-sm py-xs text-[10px] font-bold uppercase tracking-wider", tone[status])}>
      {status}
    </span>
  );
}

function OrderPanel({ order, onClose }: { order: SellerOrder; onClose: () => void }) {
  const [carrier, setCarrier] = useState(order.carrier ?? "UPS");
  const [tracking, setTracking] = useState(order.tracking ?? "");

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={`Order ${order.id}`}>
      <button type="button" aria-label="Close" onClick={onClose} className="absolute inset-0 bg-obsidian/60 backdrop-blur-sm" />
      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-outline-variant/20 bg-surface-container p-lg">
        <div className="mb-lg flex items-start justify-between">
          <div>
            <p className="font-label-sm text-label-sm uppercase tracking-widest text-muted">{order.date}</p>
            <h2 className="font-headline-lg-mobile text-headline-lg-mobile text-ivory">{order.id}</h2>
            <div className="mt-xs"><Chip status={order.status} /></div>
          </div>
          <button type="button" aria-label="Close" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full border border-outline/20 text-on-surface hover:border-secondary hover:text-secondary">
            <Icon name="close" className="text-[20px]" />
          </button>
        </div>

        <section className="mb-lg rounded border border-ivory/10 bg-ink p-md">
          <p className="mb-xs font-label-sm text-label-sm uppercase tracking-widest text-muted">Customer</p>
          <p className="font-body-lg text-body-lg text-ivory">{order.customer}</p>
          <p className="font-body-md text-body-md text-muted">{order.city}</p>
        </section>

        <section className="mb-lg flex flex-col gap-md">
          {order.items.map((item) => (
            <div key={item.sku} className="flex items-center gap-md">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded bg-surface">
                <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body-md text-body-md text-ivory">{item.name}</p>
                <p className="font-label-sm text-label-sm text-muted">Qty {item.quantity} · SKU {item.sku}</p>
              </div>
              <p className="font-body-md text-body-md text-ivory">{formatAmount(item.price * item.quantity, "USD")}</p>
            </div>
          ))}
          <div className="flex justify-between border-t border-ivory/10 pt-md">
            <span className="font-title-lg text-title-lg text-ivory">Total</span>
            <span className="font-title-lg text-title-lg text-ivory">{formatAmount(sellerOrderTotal(order), "USD")}</span>
          </div>
        </section>

        {order.status === "New" ? (
          <div className="mt-auto flex flex-col gap-sm">
            <button type="button" onClick={() => updateSellerOrder(order.id, { status: "Processing" })} className={primaryButtonClass}>
              Accept & start packing
            </button>
            <button type="button" onClick={() => updateSellerOrder(order.id, { status: "Cancelled" })} className={secondaryButtonClass}>
              Decline order
            </button>
          </div>
        ) : order.status === "Processing" ? (
          <form
            className="mt-auto flex flex-col gap-md rounded border border-ivory/10 bg-ink p-md"
            onSubmit={(event) => {
              event.preventDefault();
              updateSellerOrder(order.id, { status: "Shipped", carrier, tracking: tracking.trim() });
            }}
          >
            <p className="font-title-lg text-title-lg text-ivory">Mark as shipped</p>
            <div>
              <label htmlFor="ship-carrier" className={labelClass}>Carrier</label>
              <select id="ship-carrier" value={carrier} onChange={(e) => setCarrier(e.target.value)} className={cn(inputClass, "cursor-pointer")}>
                {["UPS", "FedEx", "DHL", "USPS"].map((option) => <option key={option} className="bg-ink">{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="ship-tracking" className={labelClass}>Tracking number</label>
              <input id="ship-tracking" required maxLength={40} value={tracking} onChange={(e) => setTracking(e.target.value)} className={inputClass} placeholder="1Z999AA1…" />
            </div>
            <button type="submit" className={primaryButtonClass}>
              <Icon name="local_shipping" className="text-[18px]" />
              Confirm shipment
            </button>
          </form>
        ) : order.carrier ? (
          <section className="mt-auto rounded border border-ivory/10 bg-ink p-md">
            <p className="mb-xs font-label-sm text-label-sm uppercase tracking-widest text-muted">Shipment</p>
            <p className="font-body-md text-body-md text-ivory">{order.carrier} · {order.tracking}</p>
            {order.status === "Shipped" ? (
              <button type="button" onClick={() => updateSellerOrder(order.id, { status: "Delivered" })} className={cn(secondaryButtonClass, "mt-md w-full")}>
                Mark as delivered
              </button>
            ) : null}
          </section>
        ) : null}
      </aside>
    </div>
  );
}

/** Orders containing this seller's products, with a fulfilment side panel (demo). */
export default function SellerOrdersView() {
  const orders = useSellerOrders();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = orders.find((order) => order.id === openId) ?? null;
  const visible = orders.filter((order) => tab === "All" || order.status === tab);
  const newCount = orders.filter((order) => order.status === "New").length;

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader
        title="Orders"
        description={newCount > 0 ? `${newCount} new order${newCount === 1 ? "" : "s"} waiting for you` : "All caught up."}
      />

      <div className="hide-scrollbar mb-lg flex gap-sm overflow-x-auto border-b border-ivory/10" role="tablist" aria-label="Filter by status">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={cn(
              "-mb-px shrink-0 border-b-2 px-md py-sm font-label-md text-label-md uppercase tracking-wider transition-colors",
              tab === item ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant hover:text-ivory",
            )}
          >
            {item} <span className="text-muted">({item === "All" ? orders.length : orders.filter((o) => o.status === item).length})</span>
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-ivory/20 bg-ink p-xxl text-center">
          <Icon name="local_mall" className="mb-md text-[40px] text-muted" />
          <p className="font-title-lg text-title-lg text-ivory">No orders here</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded border border-outline-variant/10 bg-ink">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-ivory/10">
                  {["Order", "Date", "Customer", "Items", "Status", "Total"].map((heading) => (
                    <th key={heading} className={cn("px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant", heading === "Total" && "text-right")}>
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => setOpenId(order.id)}
                    className="cursor-pointer border-b border-ivory/5 transition-colors last:border-0 hover:bg-surface-variant/30"
                  >
                    <td className="px-lg py-md">
                      <button type="button" onClick={() => setOpenId(order.id)} className="font-body-md text-body-md text-on-surface underline-offset-4 hover:underline">
                        {order.id}
                      </button>
                    </td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{order.date}</td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface">{order.customer}</td>
                    <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">
                      {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                    </td>
                    <td className="px-lg py-md"><Chip status={order.status} /></td>
                    <td className="px-lg py-md text-right font-body-md text-body-md font-medium text-on-surface">
                      {formatAmount(sellerOrderTotal(order), "USD")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {open ? <OrderPanel key={`${open.id}-${open.status}`} order={open} onClose={() => setOpenId(null)} /> : null}
    </div>
  );
}
