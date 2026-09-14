"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import Icon from "@/components/ui/Icon";
import { formatAmount } from "@/lib/utils/currency";
import { deliveredOrder, demoOrder } from "@/lib/orders/demo-order";
import type { DemoOrder } from "@/lib/orders/demo-order";

export type OrderDetailsDemoState =
  | "loading"
  | "notfound"
  | "tracking"
  | "delivered";

type OrderDetailsProps = {
  demoState?: OrderDetailsDemoState;
};

const cardClass =
  "relative overflow-hidden rounded bg-ink p-lg shadow-[0_4px_32px_rgba(11,13,15,0.15)] border border-ivory/10";

function HorizontalTimeline({ order }: { order: DemoOrder }) {
  return (
    <div className="relative timeline-line mb-md hidden px-md sm:block">
      <div className="relative z-10 flex justify-between">
        {order.timeline.map((step) => {
          if (step.state === "done") {
            return (
              <div
                key={step.label}
                className="flex flex-col items-center gap-sm"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-champagne text-obsidian shadow-[0_0_15px_rgba(201,168,106,0.2)]">
                  <Icon name="check" className="text-[14px]" />
                </div>
                <span className="font-label-md text-label-md uppercase tracking-wider text-muted">
                  {step.label}
                </span>
                {step.date ? (
                  <span className="font-label-sm text-label-sm text-outline">
                    {step.date}
                  </span>
                ) : null}
              </div>
            );
          }
          if (step.state === "active") {
            return (
              <div
                key={step.label}
                className="flex flex-col items-center gap-sm"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-champagne bg-ink shadow-[0_0_10px_rgba(201,168,106,0.5)]">
                  <div className="h-2 w-2 rounded-full bg-champagne" />
                </div>
                <span className="max-w-[80px] text-center font-label-sm uppercase tracking-wider text-champagne">
                  {step.label}
                </span>
                {step.date ? (
                  <span className="font-label-sm text-label-sm text-outline">
                    {step.date}
                  </span>
                ) : null}
              </div>
            );
          }
          return (
            <div
              key={step.label}
              className="flex flex-col items-center gap-sm opacity-50"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full border border-ivory/30 bg-obsidian">
                <div className="h-2 w-2 rounded-full bg-muted opacity-30" />
              </div>
              <span className="max-w-[80px] text-center font-label-sm uppercase tracking-wider text-muted">
                {step.label}
              </span>
              {step.date ? (
                <span className="font-label-sm text-label-sm text-outline">
                  {step.date}
                </span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MobileTimeline({ order }: { order: DemoOrder }) {
  return (
    <div className="relative mt-sm flex flex-col gap-xl pl-6 sm:hidden">
      <div className="absolute bottom-2 left-[11px] top-2 h-1/2 w-px bg-secondary" />
      <div className="absolute bottom-2 left-[11px] top-2 w-px bg-outline/20" />
      {order.timeline.map((step) => (
        <div key={step.label} className="relative">
          {step.state === "active" ? (
            <div className="absolute -left-7 top-0 flex h-4 w-4 items-center justify-center rounded-full border border-secondary bg-surface shadow-[0_0_12px_rgba(201,168,106,0.3)] ring-4 ring-surface">
              <div className="pulse-dot h-1.5 w-1.5 rounded-full bg-secondary" />
            </div>
          ) : (
            <div className="absolute -left-6 top-1 h-2 w-2 rounded-full bg-secondary ring-4 ring-surface" />
          )}
          <div className={step.state === "done" ? "" : "opacity-50"}>
            <span
              className={`font-label-md text-label-md uppercase ${
                step.state === "active" ? "text-on-surface" : "text-secondary"
              }`}
            >
              {step.label}
            </span>
            {step.date ? (
              <span className="block font-body-md text-body-md text-on-surface-variant">
                {step.date}
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Order details & tracking for a single demo order. Runs under the store
 * chrome (header/footer come from the (store) layout). `?state=` params drive
 * the loading skeleton, order-not-found, tracking-loading overlay, and the
 * delivered order variant.
 */
export default function OrderDetailsView({
  demoState,
}: OrderDetailsProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const order = demoState === "delivered" ? deliveredOrder : demoOrder;
  const [trackingLoading, setTrackingLoading] = useState(
    () => demoState === "tracking",
  );

  function handleTrackShipment() {
    setTrackingLoading(true);
    window.setTimeout(() => setTrackingLoading(false), 2000);
  }

  function handleReorder() {
    for (const item of order.items) {
      addItem(item.sku, item.quantity, {
        name: item.name,
        price: item.price,
        currency: item.currency,
        image: item.image,
      });
    }
    router.push("/cart");
  }

  if (demoState === "loading") {
    return (
      <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xl md:px-margin-desktop">
        <div className="mb-lg flex items-center gap-2">
          <div className="shimmer h-4 w-16 rounded" />
          <span className="font-label-sm text-label-sm text-outline/50">/</span>
          <div className="shimmer h-4 w-24 rounded" />
          <span className="font-label-sm text-label-sm text-outline/50">/</span>
          <div className="shimmer h-4 w-20 rounded" />
        </div>
        <div className="mb-xl flex flex-col justify-between gap-md md:flex-row md:items-end">
          <div>
            <div className="shimmer mb-4 h-10 w-64 rounded" />
            <div className="flex items-center gap-md">
              <div className="shimmer h-4 w-32 rounded" />
              <div className="shimmer h-4 w-4 rounded-full" />
              <div className="shimmer h-4 w-40 rounded" />
            </div>
          </div>
          <div className="shimmer h-10 w-32 rounded" />
        </div>
        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
          <div className="flex flex-col gap-lg lg:col-span-8">
            <div className="rounded-lg border border-outline/10 bg-ink p-lg">
              <div className="shimmer mb-lg h-6 w-48 rounded" />
              <div className="relative mt-xl flex justify-between">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="flex flex-col items-center gap-sm">
                    <div className="shimmer h-6 w-6 rounded-full" />
                    <div className="shimmer mt-2 h-4 w-20 rounded" />
                    <div className="shimmer h-3 w-16 rounded" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-outline/10 bg-ink p-lg">
              <div className="shimmer mb-lg h-6 w-32 rounded" />
              <div className="flex flex-col gap-lg">
                {[0, 1].map((index) => (
                  <div key={index} className="flex gap-md">
                    <div className="shimmer h-24 w-24 rounded" />
                    <div className="flex flex-grow flex-col justify-center gap-sm">
                      <div className="shimmer h-5 w-48 rounded" />
                      <div className="shimmer h-4 w-32 rounded" />
                      <div className="shimmer mt-2 h-4 w-24 rounded" />
                    </div>
                    <div className="flex flex-col items-end justify-center gap-sm">
                      <div className="shimmer h-5 w-20 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-lg lg:col-span-4">
            <div className="flex flex-col gap-md rounded-lg border border-outline/10 bg-ink p-lg">
              <div className="shimmer mb-sm h-6 w-32 rounded" />
              <div className="flex justify-between">
                <div className="shimmer h-4 w-20 rounded" />
                <div className="shimmer h-4 w-16 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="shimmer h-4 w-24 rounded" />
                <div className="shimmer h-4 w-16 rounded" />
              </div>
              <div className="flex justify-between">
                <div className="shimmer h-4 w-16 rounded" />
                <div className="shimmer h-4 w-12 rounded" />
              </div>
              <div className="my-sm h-px bg-outline/10" />
              <div className="flex items-end justify-between">
                <div className="shimmer h-6 w-16 rounded" />
                <div className="shimmer h-8 w-24 rounded" />
              </div>
            </div>
            <div className="flex flex-col gap-sm rounded-lg border border-outline/10 bg-ink p-lg">
              <div className="shimmer mb-sm h-6 w-40 rounded" />
              <div className="shimmer h-4 w-32 rounded" />
              <div className="shimmer h-4 w-48 rounded" />
              <div className="shimmer h-4 w-24 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (demoState === "notfound") {
    return (
      <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xl md:px-margin-desktop">
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-outline/10 bg-ink p-xxl text-center">
          <Icon name="search_off" className="mb-lg text-6xl text-outline opacity-50" />
          <h3 className="mb-md font-display-md text-display-md text-on-surface">
            Order Not Found
          </h3>
          <p className="mb-xl max-w-md font-body-lg text-body-lg text-on-surface-variant">
            We couldn&apos;t locate the order you&apos;re looking for. It may
            have been typed incorrectly or doesn&apos;t exist.
          </p>
          <div className="flex flex-col gap-md sm:flex-row">
            <Link
              href="/orders"
              className="rounded bg-secondary px-lg py-3 font-label-md text-label-md uppercase text-obsidian transition-colors hover:bg-secondary-fixed"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="rounded border border-surface-tint bg-transparent px-lg py-3 font-label-md text-label-md uppercase text-surface-tint transition-colors hover:bg-surface-tint/10"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xl md:px-margin-desktop">
      {/* Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="mb-lg flex items-center gap-xs font-label-sm text-label-sm uppercase tracking-wider text-muted"
      >
        <Link href="/" className="transition-colors hover:text-ivory">
          Home
        </Link>
        <span>/</span>
        <Link href="/orders" className="transition-colors hover:text-ivory">
          My Orders
        </Link>
        <span>/</span>
        <span className="text-ivory">Order #{order.id}</span>
      </nav>

      {/* Page header */}
      <div className="mb-xxl flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
            {demoState === "delivered" ? `Order #${order.id}` : "Order Details"}
          </h1>
          <div className="flex flex-wrap items-center gap-md">
            <p className="font-body-md text-body-md text-muted">
              {order.placedLabel}
            </p>
            {demoState === "delivered" && (
              <div className="flex items-center gap-xs rounded border border-secondary/20 bg-secondary/10 px-2 py-1">
                <Icon name="check_circle" className="text-[14px] text-secondary" />
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Delivered
                </span>
              </div>
            )}
          </div>
        </div>
        {demoState === "delivered" ? (
          <div className="flex flex-wrap gap-sm">
            <button
              type="button"
              className="flex items-center gap-xs rounded border border-surface-tint bg-transparent px-lg py-3 font-label-md text-label-md uppercase text-surface-tint transition-colors hover:bg-surface-tint/10"
            >
              <Icon name="receipt_long" className="text-[18px]" />
              Invoice
            </button>
            <button
              type="button"
              onClick={handleReorder}
              className="rounded bg-secondary px-lg py-3 font-label-md text-label-md uppercase text-obsidian transition-colors hover:bg-secondary-fixed"
            >
              Reorder
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleTrackShipment}
            className="rounded bg-champagne px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-obsidian transition-opacity hover:opacity-90"
          >
            Track Shipment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        {/* Left column */}
        <div className="flex flex-col gap-xl lg:col-span-8">
          {/* Order status + horizontal timeline */}
          <section className={cardClass}>
            <div className="mb-xl flex items-center justify-between">
              <h2 className="font-title-lg text-title-lg text-ivory">
                Status: <span className="text-champagne">{order.status}</span>
              </h2>
              {order.estDelivery && (
                <span className="font-label-sm uppercase tracking-wider text-muted">
                  {order.estDelivery}
                </span>
              )}
            </div>
            <HorizontalTimeline order={order} />
            <MobileTimeline order={order} />
          </section>

          {/* Items in order */}
          <section className={cardClass}>
            <h2 className="mb-lg font-title-lg text-title-lg text-ivory">
              Items in your order
            </h2>
            <div className="flex flex-col gap-md">
              {order.items.map((item, index) => (
                <div
                  key={item.sku}
                  className={`flex items-start gap-md pb-md md:items-center ${
                    index === order.items.length - 1
                      ? "border-0 pb-0"
                      : "border-b border-ivory/10"
                  }`}
                >
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded bg-obsidian shadow-[inset_0_0_20px_rgba(247,245,240,0.05)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover opacity-90 mix-blend-lighten"
                    />
                  </div>
                  <div className="flex flex-grow flex-col gap-md md:flex-row md:justify-between">
                    <div>
                      <h3 className="mb-xs font-body-lg text-body-lg text-ivory">
                        {item.name}
                      </h3>
                      <p className="mb-xs font-label-sm uppercase tracking-wider text-muted">
                        SKU: {item.sku}
                      </p>
                      <p className="font-label-sm uppercase tracking-wider text-muted">
                        QTY: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-title-lg text-title-lg text-ivory">
                        {formatAmount(item.price * item.quantity, item.currency)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Shipment tracking */}
          <section className={cardClass}>
            <div className="relative">
              {trackingLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded bg-surface-container-lowest/50 backdrop-blur-sm">
                  <Icon
                    name="sync"
                    className="mb-sm animate-spin text-4xl text-secondary"
                  />
                  <span className="font-label-md text-label-md uppercase tracking-widest text-secondary">
                    Updating Tracking...
                  </span>
                </div>
              )}
              <div className={trackingLoading ? "pointer-events-none opacity-30" : ""}>
                <div className="mb-lg flex items-start justify-between">
                  <h2 className="font-title-lg text-title-lg text-ivory">
                    Shipment Tracking
                  </h2>
                  <div className="text-right">
                    <p className="mb-xs font-label-sm uppercase tracking-wider text-muted">
                      Carrier: {order.carrier}
                    </p>
                    <p className="font-body-md text-body-md text-ivory">
                      {order.trackingNumber}
                    </p>
                  </div>
                </div>
                <div className="timeline-line-vertical relative py-xs pl-xl">
                  {order.trackingEvents.map((event) => (
                    <div key={event.title} className="relative mb-lg last:mb-0">
                      <div
                        className={`absolute -left-[32px] top-[4px] z-10 flex h-6 w-6 items-center justify-center rounded-full ${
                          event.state === "active"
                            ? "border-2 border-champagne bg-ink shadow-[0_0_10px_rgba(201,168,106,0.3)]"
                            : "border border-ivory/30 bg-obsidian"
                        }`}
                      >
                        <div
                          className={`h-2 w-2 rounded-full ${
                            event.state === "active"
                              ? "bg-champagne"
                              : "bg-muted opacity-50"
                          }`}
                        />
                      </div>
                      <h4
                        className={`mb-xs font-body-md font-medium ${
                          event.state === "active"
                            ? "text-ivory"
                            : "text-muted"
                        }`}
                      >
                        {event.title}
                      </h4>
                      <p
                        className={`font-label-sm uppercase tracking-wider ${
                          event.state === "active"
                            ? "text-muted"
                            : "text-muted opacity-70"
                        }`}
                      >
                        {event.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-xl lg:col-span-4">
          <section className={cardClass}>
            <h2 className="mb-lg border-b border-ivory/10 pb-md font-title-lg text-title-lg text-ivory">
              Order Summary
            </h2>
            <div className="mb-lg flex flex-col gap-sm border-b border-ivory/10 pb-md">
              <div className="flex items-center justify-between text-muted">
                <span className="font-body-md text-body-md">Subtotal</span>
                <span className="font-body-md text-body-md text-ivory">
                  {formatAmount(order.subtotal, "USD")}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span className="font-body-md text-body-md">Shipping</span>
                <span className="font-body-md text-body-md text-ivory">
                  {formatAmount(order.shipping, "USD")}
                </span>
              </div>
              <div className="flex items-center justify-between text-muted">
                <span className="font-body-md text-body-md">Tax</span>
                <span className="font-body-md text-body-md text-ivory">
                  {formatAmount(order.tax, "USD")}
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between">
              <span className="font-title-lg text-title-lg text-ivory">Total</span>
              <span className="font-display-md text-display-md leading-none text-ivory">
                {formatAmount(order.subtotal + order.shipping + order.tax, "USD")}
              </span>
            </div>
          </section>

          {/* Delivery address */}
          <section className={cardClass}>
            <div className="mb-md flex items-center gap-sm">
              <Icon name="location_on" className="text-muted" />
              <h2 className="font-title-lg text-title-lg text-ivory">
                Delivery Address
              </h2>
            </div>
            <div className="font-body-md text-body-md leading-relaxed text-muted">
              {order.addressLines.map((line, index) => (
                <p key={index} className={index === 0 ? "mb-xs font-medium text-ivory" : ""}>
                  {line}
                </p>
              ))}
            </div>
          </section>

          {/* Actions */}
          <section className="mt-md flex flex-col gap-md">
            <button
              type="button"
              className="flex items-center justify-center gap-sm rounded border border-ivory/30 px-lg py-md font-label-md text-label-md uppercase tracking-wider text-ivory transition-colors hover:bg-surface-container-low"
            >
              <Icon name="receipt_long" className="text-[18px]" />
              View Invoice
            </button>
            <Link
              href="/"
              className="rounded px-lg py-md text-center font-label-md text-label-md uppercase tracking-wider text-ivory transition-colors hover:text-champagne"
            >
              Continue Shopping
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}