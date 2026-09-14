import Link from "next/link";
import Icon from "@/components/ui/Icon";
import { formatAmount } from "@/lib/utils/currency";
import { demoOrder } from "@/lib/orders/demo-order";

export default function OrdersPage() {
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
        <span className="text-ivory">My Orders</span>
      </nav>

      <div className="mb-xl">
        <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
          My Orders
        </h1>
        <p className="font-body-md text-body-md text-muted">
          Review the status of your recent orders and track shipments.
        </p>
      </div>

      <div className="flex flex-col gap-md">
        <Link
          href={`/orders/${demoOrder.id}`}
          className="group flex items-center justify-between gap-md rounded-lg border border-ivory/10 bg-ink p-lg transition-colors hover:border-champagne/40"
        >
          <div className="flex flex-col gap-xs">
            <span className="font-label-md text-label-md uppercase tracking-wider text-ivory">
              Order #{demoOrder.id}
            </span>
            <span className="font-body-md text-body-md text-muted">
              {demoOrder.placedLabel}
            </span>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-champagne">
              {demoOrder.status}
            </span>
          </div>
          <div className="flex flex-col items-end gap-xs">
            <span className="font-title-lg text-title-lg text-ivory">
              {formatAmount(
                demoOrder.subtotal + demoOrder.shipping + demoOrder.tax,
                "USD",
              )}
            </span>
            <span className="flex items-center gap-xs font-label-sm text-label-sm text-muted transition-colors group-hover:text-champagne">
              View order
              <Icon name="chevron_right" className="text-sm" />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}