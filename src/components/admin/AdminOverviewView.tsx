"use client";

import Link from "next/link";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { promotionState, useModerationQueue, usePromotions, useSellerAccounts } from "@/lib/demo/admin";
import { formatAmount } from "@/lib/utils/currency";
import { cn } from "@/lib/utils/cn";

const weeklyRevenue = [18.2, 21.4, 19.8, 24.6, 23.1, 27.9, 31.2];
const weekLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Marketplace health at a glance (demo figures). */
export default function AdminOverviewView() {
  const queue = useModerationQueue();
  const promotions = usePromotions();
  const sellers = useSellerAccounts();
  const pending = queue.filter((r) => r.status === "PENDING" || r.status === "FLAGGED").length;
  const livePromotions = promotions.filter((p) => promotionState(p) === "Active").length;
  const max = Math.max(...weeklyRevenue);

  const metrics: { label: string; value: string; detail: string; icon: IconName; href?: string; alert?: boolean }[] = [
    { label: "Gross sales (7 days)", value: formatAmount(166_200, "USD"), detail: "+14% vs last week", icon: "payments" },
    { label: "Orders (7 days)", value: "1,284", detail: "Avg. order $129", icon: "shopping_bag" },
    { label: "Reviews to moderate", value: String(pending), detail: "Pending or flagged", icon: "rate_review", href: "/admin/reviews", alert: pending > 0 },
    { label: "Live promotions", value: String(livePromotions), detail: `${promotions.length} total codes`, icon: "local_offer", href: "/admin/promotions" },
  ];

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader title="Overview" description="Marketplace activity across every seller. Figures are demo data." />

      <section className="mb-xl grid grid-cols-1 gap-md sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => {
          const body = (
            <>
              <div className="mb-lg flex items-start justify-between">
                <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">{metric.label}</p>
                <Icon name={metric.icon} className={metric.alert ? "text-error" : "text-on-surface-variant/50"} />
              </div>
              <p className="mb-sm font-display-md text-headline-lg text-on-surface">{metric.value}</p>
              <p className={cn("font-body-md text-body-md", metric.alert ? "text-error" : "text-secondary")}>{metric.detail}</p>
            </>
          );
          const className = cn(
            "flex flex-col rounded border bg-ink p-lg transition-colors",
            metric.alert ? "border-error/30" : "border-outline-variant/10 hover:border-outline-variant/30",
          );
          return metric.href ? (
            <Link key={metric.label} href={metric.href} className={className}>{body}</Link>
          ) : (
            <div key={metric.label} className={className}>{body}</div>
          );
        })}
      </section>

      <div className="grid grid-cols-1 gap-xl xl:grid-cols-3">
        <section className="rounded border border-outline-variant/10 bg-ink p-lg xl:col-span-2">
          <div className="mb-lg flex items-end justify-between">
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Revenue this week</h2>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-muted">$ thousands</span>
          </div>
          <div className="flex h-56 items-end gap-sm" role="img" aria-label={`Daily revenue: ${weeklyRevenue.map((v, i) => `${weekLabels[i]} ${v}k`).join(", ")}`}>
            {weeklyRevenue.map((value, index) => (
              <div key={weekLabels[index]} className="flex flex-1 flex-col items-center gap-xs">
                <span className="font-label-sm text-label-sm text-muted">{value}</span>
                <div
                  className={cn("w-full rounded-t", index === weeklyRevenue.length - 1 ? "bg-secondary" : "bg-secondary/30")}
                  style={{ height: `${(value / max) * 170}px` }}
                />
                <span className="font-label-sm text-label-sm uppercase text-on-surface-variant">{weekLabels[index]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded border border-outline-variant/10 bg-ink p-lg">
          <div className="mb-md flex items-end justify-between border-b border-outline-variant/20 pb-sm">
            <h2 className="font-title-lg text-title-lg text-on-surface">Top sellers</h2>
            <Link href="/admin/sellers" className="font-label-md text-label-md uppercase text-secondary hover:opacity-80">All</Link>
          </div>
          <ol className="flex flex-col gap-md">
            {[...sellers]
              .filter((s) => s.status === "ACTIVE")
              .sort((a, b) => b.sales - a.sales)
              .slice(0, 4)
              .map((seller, index) => (
                <li key={seller.id} className="flex items-center gap-md">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-highest font-label-md text-label-md text-secondary">
                    {index + 1}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-body-md text-body-md text-on-surface">{seller.storeName}</span>
                  <span className="font-body-md text-body-md text-on-surface-variant">{formatAmount(seller.sales, "USD")}</span>
                </li>
              ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
