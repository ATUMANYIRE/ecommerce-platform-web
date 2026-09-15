"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Icon from "@/components/ui/Icon";
import OrderStatusChip from "@/components/orders/OrderStatusChip";
import { orderItemCount, orderTotal } from "@/lib/orders/demo-order";
import { useAllOrders } from "@/lib/orders/placed-orders";
import { formatAmount } from "@/lib/utils/currency";
import { isUnoptimizedImage } from "@/lib/utils/image";
import { cn } from "@/lib/utils/cn";

const tabs = ["All", "Processing", "Shipped", "Delivered", "Cancelled"] as const;

/** Order history: orders placed through the demo checkout plus sample history. */
export default function OrdersView() {
  const orders = useAllOrders();
  const [tab, setTab] = useState<(typeof tabs)[number]>("All");
  const [query, setQuery] = useState("");

  const needle = query.trim().toLowerCase();
  const visible = orders.filter(
    (order) =>
      (tab === "All" || order.status === tab) &&
      (!needle ||
        order.id.toLowerCase().includes(needle) ||
        order.items.some((item) => item.name.toLowerCase().includes(needle))),
  );

  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xl md:px-margin-desktop">
      <nav
        aria-label="Breadcrumb"
        className="mb-lg flex items-center gap-xs font-label-sm text-label-sm uppercase tracking-wider text-muted"
      >
        <Link href="/" className="transition-colors hover:text-ivory">
          Home
        </Link>
        <span>/</span>
        <Link href="/account" className="transition-colors hover:text-ivory">
          Account
        </Link>
        <span>/</span>
        <span className="text-ivory">My Orders</span>
      </nav>

      <div className="mb-xl flex flex-col gap-md md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
            My Orders
          </h1>
          <p className="font-body-md text-body-md text-muted">
            Review the status of your recent orders and track shipments.
          </p>
        </div>
        <label className="relative w-full md:w-72">
          <span className="sr-only">Search orders</span>
          <Icon name="search" className="absolute left-0 top-1/2 -translate-y-1/2 text-[18px] text-muted" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Order number or product"
            maxLength={80}
            className="w-full border-0 border-b border-ivory/30 bg-transparent py-sm pl-lg font-body-md text-body-md text-ivory placeholder:text-muted/60 focus:border-secondary focus:outline-none"
          />
        </label>
      </div>

      <div className="hide-scrollbar mb-lg flex gap-sm overflow-x-auto border-b border-ivory/10" role="tablist" aria-label="Filter by status">
        {tabs.map((item) => {
          const count = item === "All" ? orders.length : orders.filter((o) => o.status === item).length;
          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={cn(
                "-mb-px shrink-0 border-b-2 px-md py-sm font-label-md text-label-md uppercase tracking-wider transition-colors",
                tab === item
                  ? "border-secondary text-secondary"
                  : "border-transparent text-on-surface-variant hover:text-ivory",
              )}
            >
              {item} <span className="text-muted">({count})</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed border-ivory/20 bg-ink p-xxl text-center">
          <Icon name="receipt_long" className="mb-md text-[48px] text-muted" />
          <h2 className="mb-xs font-title-lg text-title-lg text-ivory">No orders found</h2>
          <p className="mb-lg max-w-sm font-body-md text-body-md text-muted">
            {orders.length === 0
              ? "When you place an order it will appear here."
              : "Try another status or search term."}
          </p>
          <Link
            href="/search?q=*"
            className="rounded bg-secondary px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary-fixed"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <ul className="flex flex-col gap-md">
          {visible.map((order) => {
            const currency = order.currency ?? "USD";
            const count = orderItemCount(order);
            return (
              <li key={order.id}>
                <Link
                  href={`/orders/${encodeURIComponent(order.id)}`}
                  className="group flex flex-col gap-md rounded-lg border border-ivory/10 bg-ink p-lg transition-colors hover:border-champagne/40 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-md">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item) => (
                        <div
                          key={item.sku}
                          className="relative h-14 w-14 overflow-hidden rounded border-2 border-ink bg-surface-container-high"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="56px"
                            unoptimized={isUnoptimizedImage(item.image)}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex min-w-0 flex-col gap-xs">
                      <span className="font-label-md text-label-md uppercase tracking-wider text-ivory">
                        Order #{order.id}
                      </span>
                      <span className="font-body-md text-body-md text-muted">
                        {order.placedLabel} · {count} {count === 1 ? "item" : "items"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-lg md:justify-end">
                    <OrderStatusChip status={order.status} />
                    <span className="font-title-lg text-title-lg text-ivory">
                      {formatAmount(orderTotal(order), currency)}
                    </span>
                    <Icon
                      name="chevron_right"
                      className="text-muted transition-transform group-hover:translate-x-1 group-hover:text-champagne"
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
