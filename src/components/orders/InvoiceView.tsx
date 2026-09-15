"use client";

import Link from "next/link";
import Icon from "@/components/ui/Icon";
import OrderStatusChip from "@/components/orders/OrderStatusChip";
import { orderTotal } from "@/lib/orders/demo-order";
import { useOrder } from "@/lib/orders/placed-orders";
import { formatAmount } from "@/lib/utils/currency";
import { useHydrated } from "@/lib/utils/localStorageStore";

/** Printable invoice for an order (demo data; not a tax document). */
export default function InvoiceView({ orderId }: { orderId: string }) {
  const order = useOrder(orderId);
  const hydrated = useHydrated();

  if (!order) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-max-width flex-col items-center justify-center px-margin-mobile py-xxl text-center md:px-margin-desktop">
        {hydrated ? (
          <>
            <Icon name="receipt_long" className="mb-md text-[48px] text-muted" />
            <h1 className="mb-sm font-headline-lg-mobile text-headline-lg-mobile text-ivory">Invoice not found</h1>
            <p className="mb-lg font-body-md text-body-md text-muted">We couldn&apos;t find an order with that number.</p>
            <Link href="/orders" className="rounded bg-secondary px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-obsidian">
              View My Orders
            </Link>
          </>
        ) : (
          <div className="shimmer h-96 w-full max-w-3xl rounded-lg" aria-busy="true" />
        )}
      </div>
    );
  }

  const currency = order.currency ?? "USD";
  const invoiceNumber = `INV-${order.id.replace(/[^A-Z0-9]/gi, "").slice(-8).toUpperCase()}`;
  const rows: [string, number, boolean?][] = [
    ["Subtotal", order.subtotal],
    ...(order.discount ? [[`Promo${order.promoCode ? ` (${order.promoCode})` : ""}`, -order.discount, true] as [string, number, boolean]] : []),
    ["Shipping", order.shipping],
    ["Tax", order.tax],
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-margin-mobile py-xl md:px-margin-desktop print:max-w-none print:p-0">
      <div className="mb-lg flex flex-wrap items-center justify-between gap-md print:hidden">
        <Link
          href={`/orders/${encodeURIComponent(order.id)}`}
          className="inline-flex items-center gap-xs font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-ivory"
        >
          <Icon name="arrow_back" className="text-[18px]" />
          Back to order
        </Link>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-xs rounded bg-secondary px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary-fixed"
        >
          <Icon name="print" className="text-[18px]" />
          Print / Save PDF
        </button>
      </div>

      <article className="rounded-lg border border-ivory/10 bg-ink p-lg md:p-xl print:border-0 print:bg-white print:text-black">
        <header className="mb-xl flex flex-col justify-between gap-lg border-b border-ivory/10 pb-lg sm:flex-row print:border-black/20">
          <div>
            <p className="font-display-md text-display-md leading-none tracking-tighter text-ivory print:text-black">ATLAS</p>
            <p className="mt-xs font-body-md text-body-md text-muted">Atlas Marketplace · Demo store</p>
          </div>
          <div className="sm:text-right">
            <p className="font-label-md text-label-md uppercase tracking-widest text-secondary print:text-black">Invoice</p>
            <p className="font-title-lg text-title-lg text-ivory print:text-black">{invoiceNumber}</p>
            <p className="font-body-md text-body-md text-muted">Order #{order.id}</p>
            <p className="font-body-md text-body-md text-muted">{order.placedLabel.replace("Placed on ", "Issued ")}</p>
          </div>
        </header>

        <section className="mb-xl grid grid-cols-1 gap-lg sm:grid-cols-2">
          <div>
            <p className="mb-xs font-label-sm text-label-sm uppercase tracking-widest text-muted">Bill & ship to</p>
            {order.addressLines.map((line, index) => (
              <p key={index} className={index === 0 ? "font-body-lg text-body-lg text-ivory print:text-black" : "font-body-md text-body-md text-on-surface-variant print:text-black"}>
                {line}
              </p>
            ))}
          </div>
          <div className="sm:text-right">
            <p className="mb-xs font-label-sm text-label-sm uppercase tracking-widest text-muted">Status</p>
            <OrderStatusChip status={order.status} />
          </div>
        </section>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-left">
            <thead>
              <tr className="border-b border-ivory/10 print:border-black/20">
                <th className="py-sm font-label-sm text-label-sm uppercase tracking-widest text-muted">Item</th>
                <th className="py-sm text-right font-label-sm text-label-sm uppercase tracking-widest text-muted">Qty</th>
                <th className="py-sm text-right font-label-sm text-label-sm uppercase tracking-widest text-muted">Unit price</th>
                <th className="py-sm text-right font-label-sm text-label-sm uppercase tracking-widest text-muted">Amount</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.sku} className="border-b border-ivory/5 print:border-black/10">
                  <td className="py-md">
                    <p className="font-body-md text-body-md text-ivory print:text-black">{item.name}</p>
                    <p className="font-label-sm text-label-sm text-muted">SKU {item.sku}</p>
                  </td>
                  <td className="py-md text-right font-body-md text-body-md text-on-surface-variant print:text-black">{item.quantity}</td>
                  <td className="py-md text-right font-body-md text-body-md text-on-surface-variant print:text-black">{formatAmount(item.price, currency)}</td>
                  <td className="py-md text-right font-body-md text-body-md text-ivory print:text-black">{formatAmount(item.price * item.quantity, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="ml-auto mt-lg flex w-full max-w-xs flex-col gap-sm">
          {rows.map(([label, amount, highlight]) => (
            <div key={label} className="flex justify-between font-body-md text-body-md text-on-surface-variant print:text-black">
              <span>{label}</span>
              <span className={highlight ? "text-secondary" : "text-ivory print:text-black"}>
                {amount < 0 ? `−${formatAmount(-amount, currency)}` : formatAmount(amount, currency)}
              </span>
            </div>
          ))}
          <div className="mt-sm flex items-end justify-between border-t border-ivory/10 pt-sm print:border-black/20">
            <span className="font-title-lg text-title-lg text-ivory print:text-black">Total</span>
            <span className="font-headline-lg-mobile text-headline-lg-mobile text-ivory print:text-black">{formatAmount(orderTotal(order), currency)}</span>
          </div>
        </section>

        <footer className="mt-xl border-t border-ivory/10 pt-lg font-body-md text-body-md text-muted print:border-black/20">
          Thank you for shopping with Atlas. This invoice was generated by a demo store and is not a tax document.
        </footer>
      </article>
    </div>
  );
}
