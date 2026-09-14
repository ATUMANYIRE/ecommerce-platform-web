"use client";

import Image from "next/image";
import Link from "next/link";
import Icon, { type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils/cn";

export type SellerDashboardState =
  | "default"
  | "empty"
  | "noorders"
  | "denied"
  | "loading";

const mugImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAG0wAv_TkHVExwumvw1Msx5u33Wv5od8uZ3yz19nRRioJsgMlMPxWE-WDmNvhDHyUmaGSSr3TtGIm_mwllinsk-hZBI2-f5R1JFwpdyn4Q6f702r5mgdiE_dvdiM7B7i-pR2kW1RpqygCoaKxvKGHF_6EMXysVSxmfX0PZbzktpoVIdEKdVSTdsoz5cpCNQ-llUVIh6R-wwi21f4pHOg5JQPlM99VZpAKK6d-XXyxBykZFGIC-wUlNXQ";
const journalImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDnv_iRImr4A3D89Vxl_3k2OglJCp0xgwdniSE1J6pYbWLOntCBDUOQu7YaO5R3kwpekj5H1CCb29jz0_UwEdt-6qah2DWygvaj-NgYF2YCkS6A7FnDFpoO4OiG17j-x6oDhYCzliZzsfEhDGXtrIKCGSW_CE7IB2S-mWZAZ2R9IUCSg-ROary8wBm9v9rRvfI4MzFcgrK9eBdnbu1kNRXu2IES5MH2bZhVtXdBQ-DHRI6BbEY826iCJw";
const candleImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAjS6_XQ7Flk7n1yyZdoEuh8nScryk99J4Db4FItI-KyqvWKz7a0J9cR6JDUHEuxszGPGDIDu2hmqMCyWcaBXST1S4U1DXB_SfiZ4BVD75KL4q2lVoPuQ87AskFbJErRHaPhXqTQhDykhC9yL9dg4osWP4sQaacCURuwcqFVH43DS7vH8zBIqY2wuBsS0Rr99Rm05JfZ1iTedAEIs97y-_sbAi84hWwG9ee0c0Kw1yTEuX3_flV8lDJ2g";
const penImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAHSEiOlZCmJ4TzapxbJ4j8rzZBc8NM05A88A0MFMIpBX2pHgOCzsI_tIf9KF7fjxC1MYtHtOmcVtfcx2uIYP0ztSoXW-yjRgscKQICBQvl2T25G054I96UzJmrC_vALq8ilw7Zf9sAdpUW7_mbWCSGS4qRfpEEg4BIXTK5jS5nxRpZpzCNd8A4EduUq7vwYu67Bg9Pan24R6t7_SKlJIctKdfg3VfSZPSqyKlnqBRmN1JXStSLTLAo7g";
const organizerImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDqGUeRuGTn8jJd5-G_pGzF73sPjCJQtq_WaR_xx0cXLfYqK1lpQtdyU5lqCFzZw4MSxM2yXaYFp6LnntovDkYJDjyhK_LFPSZTn-hRzc4JKCs90Aumegy5xcTrC2z6svgXLHUYJnrRfBdy70McBWvkcOvqI5dQU2mv7x7wm5EbywwJjeAygYXDVIRWT6v1W7CjfMR1eGes1McYOQ_o4xMuO80xu2DOEygiobUJYcAqnzQrk8_9GSr5fw";

type OrderRow = {
  id: string;
  date: string;
  product: string;
  image: string;
  status: "Processing" | "Shipped" | "Delivered";
  total: string;
};

const recentOrders: OrderRow[] = [
  {
    id: "#ORD-9021",
    date: "Oct 24, 2023",
    product: "Minimalist Ceramic Mug",
    image: mugImage,
    status: "Processing",
    total: "$45.00",
  },
  {
    id: "#ORD-9020",
    date: "Oct 23, 2023",
    product: "Leather Bound Journal",
    image: journalImage,
    status: "Shipped",
    total: "$120.00",
  },
  {
    id: "#ORD-9019",
    date: "Oct 22, 2023",
    product: "Brass Candle Holder",
    image: candleImage,
    status: "Delivered",
    total: "$85.00",
  },
];

type AlertRow = {
  name: string;
  stock: string;
  image: string;
  error: boolean;
};

const inventoryAlerts: AlertRow[] = [
  { name: "Matte Black Fountain Pen", stock: "2 in stock", image: penImage, error: true },
  { name: "Concrete Desk Organizer", stock: "Out of stock", image: organizerImage, error: true },
];

function StatusChip({ status }: { status: OrderRow["status"] }) {
  const tone =
    status === "Processing"
      ? "text-champagne bg-champagne/10 border-champagne/20"
      : "text-muted bg-muted/10 border-muted/20";
  return (
    <span
      className={cn(
        "inline-block rounded-sm border px-sm py-xs text-[10px] font-bold uppercase tracking-wider",
        tone,
      )}
    >
      {status}
    </span>
  );
}

function MobileStatusChip({ status }: { status: OrderRow["status"] }) {
  const classes =
    status === "Shipped"
      ? "text-emerald-400 bg-emerald-400/10"
      : "text-on-surface bg-surface-container";
  return (
    <span
      className={cn(
        "rounded px-2 py-1 font-label-sm text-label-sm",
        classes,
      )}
    >
      {status}
    </span>
  );
}

function MetricCard({
  label,
  icon,
  value,
  detail,
  alert = false,
}: {
  label: string;
  icon: IconName;
  value: string;
  detail: { text: string; up?: boolean } | null;
  alert?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded border bg-ink p-lg shadow-[0_32px_64px_-12px_rgba(11,13,15,0.15)] transition-colors",
        alert ? "border-error/30" : "border-outline-variant/10 hover:border-outline-variant/30",
      )}
    >
      <div className="mb-lg flex items-start justify-between">
        <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">
          {label}
        </p>
        <Icon
          name={icon}
          className={alert ? "text-error" : "text-on-surface-variant/50"}
        />
      </div>
      <p className="mb-sm font-display-md text-title-lg md:text-display-md text-on-surface">
        {value}
      </p>
      {detail ? (
        <p
          className={cn(
            "flex items-center gap-xs font-body-md text-body-md",
            alert ? "text-error" : "text-secondary",
          )}
        >
          {detail.up && (
            <Icon name="trending_up" className="text-[16px]" />
          )}
          {detail.text}
        </p>
      ) : (
        <p
          className={cn(
            "flex items-center gap-xs font-body-md text-body-md",
            alert ? "text-error" : "text-on-surface-variant",
          )}
        >
          {alert ? "Items low in stock" : "2 draft, 84 active"}
        </p>
      )}
    </div>
  );
}

function ProductThumb({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded bg-surface",
        className ?? "h-8 w-8",
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="48px"
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function RecentOrdersSection() {
  return (
    <section className="space-y-md">
      <div className="flex items-end justify-between border-b border-outline-variant/20 pb-sm">
        <h3 className="font-headline-lg text-headline-lg text-on-surface">
          Recent Orders
        </h3>
        <Link
          href="#"
          className="font-label-md text-label-md uppercase text-secondary transition-opacity hover:opacity-80"
        >
          View All
        </Link>
      </div>

      <div className="overflow-hidden rounded border border-outline-variant/10 bg-ink">
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-ivory/10">
                <th className="px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">
                  Order ID
                </th>
                <th className="px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">
                  Date
                </th>
                <th className="px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">
                  Product
                </th>
                <th className="px-lg py-md font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">
                  Status
                </th>
                <th className="px-lg py-md text-right font-label-md text-label-md font-normal uppercase tracking-wider text-on-surface-variant">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, i) => (
                <tr
                  key={order.id}
                  className={cn(
                    "transition-colors hover:bg-surface-variant/30",
                    i < recentOrders.length - 1 && "border-b border-ivory/5",
                  )}
                >
                  <td className="px-lg py-md font-body-md text-body-md text-on-surface">
                    {order.id}
                  </td>
                  <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">
                    {order.date}
                  </td>
                  <td className="px-lg py-md">
                    <span className="flex items-center gap-sm">
                      <ProductThumb src={order.image} alt={order.product} />
                      <span className="max-w-[150px] truncate font-body-md text-body-md text-on-surface">
                        {order.product}
                      </span>
                    </span>
                  </td>
                  <td className="px-lg py-md">
                    <StatusChip status={order.status} />
                  </td>
                  <td className="px-lg py-md text-right font-body-md text-body-md font-medium text-on-surface">
                    {order.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-sm p-md md:hidden">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-sm rounded-lg border border-muted/20 bg-ink p-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-label-md text-label-md uppercase text-primary">
                    {order.id}
                  </p>
                  <p className="mt-xs font-label-sm text-label-sm text-on-surface-variant">
                    {order.date}
                  </p>
                </div>
                <MobileStatusChip status={order.status} />
              </div>
              <div className="mt-sm flex items-center gap-md">
                <ProductThumb src={order.image} alt={order.product} className="h-12 w-12 bg-surface-container" />
                <div className="flex-1">
                  <p className="line-clamp-1 font-body-md text-body-md text-on-surface">
                    {order.product}
                  </p>
                  <p className="mt-xs font-label-sm text-label-sm text-on-surface-variant">
                    1 item • {order.total}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ActionRequired() {
  return (
    <div className="space-y-md">
      <div className="flex items-end justify-between border-b border-error/30 pb-sm">
        <h3 className="font-headline-lg text-headline-lg text-on-surface">
          Action Required
        </h3>
      </div>
      <ul className="divide-y divide-ivory/10 rounded border border-outline-variant/10 bg-ink">
        {inventoryAlerts.map((alert) => (
          <li key={alert.name} className="group flex items-center justify-between p-md">
            <div className="flex items-center gap-md">
              <ProductThumb
                src={alert.image}
                alt={alert.name}
                className="h-12 w-12 bg-surface opacity-70 grayscale transition-all group-hover:opacity-100 group-hover:grayscale-0"
              />
              <div>
                <p className="font-body-md text-body-md font-medium text-on-surface">
                  {alert.name}
                </p>
                <p className="mt-xs font-label-sm text-label-sm uppercase tracking-wide text-error">
                  {alert.stock}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="p-sm text-on-surface-variant transition-colors hover:text-secondary"
              aria-label={`Restock ${alert.name}`}
            >
              <Icon name="add_shopping_cart" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopProducts() {
  const products = [
    { rank: 1, name: "Leather Tote Bag", sold: "42 Sold" },
    { rank: 2, name: "Linen Throw Blanket", sold: "28 Sold" },
  ];
  return (
    <div className="space-y-md">
      <div className="flex items-end justify-between border-b border-outline-variant/20 pb-sm">
        <h3 className="font-title-lg text-title-lg text-on-surface">
          Top Products
        </h3>
        <button
          type="button"
          className="font-label-md text-label-md uppercase text-on-surface-variant transition-colors hover:text-secondary"
        >
          View Catalog
        </button>
      </div>
      <div className="space-y-md rounded border border-outline-variant/10 bg-ink p-md">
        {products.map((product, i) => (
          <div key={product.rank}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="w-6 text-center font-display-md text-2xl text-on-surface-variant/30">
                  {product.rank}
                </span>
                <p className="font-body-md text-body-md text-on-surface">
                  {product.name}
                </p>
              </div>
              <p className="font-body-md text-body-md text-secondary">
                {product.sold}
              </p>
            </div>
            {i < products.length - 1 && (
              <div className="my-md h-px w-full bg-ivory/10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewDefault() {
  const metrics = [
    { label: "Revenue", icon: "payments" as const, value: "$24,500", detail: { text: "+12.5% this month", up: true } },
    { label: "Total Orders", icon: "shopping_bag" as const, value: "142", detail: { text: "+5% this month", up: true } },
    { label: "Products", icon: "inventory_2" as const, value: "86", detail: null },
    { label: "Inventory Alerts", icon: "warning" as const, value: "3", detail: null, alert: true },
  ];
  return (
    <div className="space-y-xl">
      <div className="mb-lg">
        <h2 className="mb-xs font-title-lg text-title-lg text-primary">
          Overview
        </h2>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Here is what&apos;s happening with your store today.
        </p>
      </div>

      <section className="grid grid-cols-2 gap-sm md:gap-lg lg:grid-cols-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.label}
            label={metric.label}
            icon={metric.icon}
            value={metric.value}
            detail={metric.detail}
            alert={metric.alert}
          />
        ))}
      </section>

      <div className="grid grid-cols-1 gap-xl xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrdersSection />
        </div>
        <div className="space-y-xl">
          <ActionRequired />
          <TopProducts />
        </div>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="space-y-xl">
      <header className="flex flex-col gap-md border-b border-outline-variant/30 pb-lg sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display-md text-display-md text-on-surface">
            Dashboard Overview
          </h2>
          <p className="mt-xs font-body-md text-body-md text-on-surface-variant">
            Loading latest metrics and activity.
          </p>
        </div>
        <div className="flex gap-md">
          <button
            type="button"
            className="flex items-center gap-sm rounded border border-outline-variant bg-ink px-lg py-sm text-on-surface transition-colors hover:bg-surface-variant"
          >
            <Icon name="calendar_today" className="text-sm" />
            <span className="font-label-sm text-label-sm uppercase">
              Last 30 Days
            </span>
          </button>
        </div>
      </header>

      <section className="grid grid-cols-1 gap-gutter md:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex h-[140px] flex-col gap-md rounded border border-outline-variant/20 bg-ink p-lg shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="shimmer h-4 w-24 rounded" />
              <div className="shimmer h-8 w-8 rounded-full" />
            </div>
            <div className="mt-auto">
              <div className="shimmer mb-sm h-10 w-32 rounded" />
              <div className="shimmer h-3 w-20 rounded" />
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
        <section className="flex min-h-[400px] flex-col overflow-hidden rounded border border-outline-variant/20 bg-ink shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between border-b border-outline-variant/20 p-lg">
            <h3 className="font-title-lg text-title-lg text-on-surface">
              Recent Orders
            </h3>
            <button
              type="button"
              className="font-label-md text-label-md uppercase text-secondary hover:underline"
            >
              View All
            </button>
          </div>
          <div className="flex flex-grow flex-col items-center justify-center bg-surface-container-lowest/50 p-xxl text-center">
            <Icon
              name="warning"
              className="mb-md text-[48px] text-error/60"
            />
            <h4 className="mb-xs font-title-lg text-title-lg text-on-surface">
              Couldn&apos;t load your orders
            </h4>
            <p className="mb-lg max-w-[300px] font-body-md text-body-md text-on-surface-variant">
              We&apos;re having trouble connecting to the order service right
              now. Please try again.
            </p>
            <button
              type="button"
              className="flex items-center gap-sm rounded border border-secondary/30 bg-secondary/10 px-lg py-sm font-label-md text-label-md uppercase text-secondary transition-colors hover:bg-secondary/20"
            >
              <Icon name="refresh" className="text-sm" />
              Retry
            </button>
          </div>
        </section>

        <section className="flex min-h-[400px] flex-col overflow-hidden rounded border border-outline-variant/20 bg-ink shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/20 p-lg">
            <h3 className="font-title-lg text-title-lg text-on-surface">
              Top Products
            </h3>
          </div>
          <div className="flex flex-col gap-lg p-lg">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-md">
                <div className="shimmer h-16 w-16 shrink-0 rounded" />
                <div className="flex-grow">
                  <div className="shimmer mb-sm h-4 w-3/4 rounded" />
                  <div className="shimmer h-3 w-1/2 rounded" />
                </div>
                <div className="shimmer h-4 w-12 rounded" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StateCard({
  icon,
  iconClass,
  title,
  copy,
  children,
}: {
  icon: IconName;
  iconClass?: string;
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <section className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-xl border border-ivory/10 bg-ink p-xxl text-center shadow-[0_32px_64px_-16px_rgba(11,13,15,0.5)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-obsidian/40 to-transparent" />
      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-full border border-muted/20 bg-surface-variant/30">
          <Icon
            name={icon}
            className={cn("text-[32px] text-muted", iconClass)}
            fill={1}
          />
        </div>
        <h2 className="mb-sm font-headline-lg text-headline-lg text-ivory">
          {title}
        </h2>
        <p className="mb-xl max-w-md font-body-lg text-body-lg text-muted">
          {copy}
        </p>
        {children}
      </div>
    </section>
  );
}

function EmptyStoreState() {
  return (
    <StateCard
      icon="storefront"
      title="Your store is empty"
      copy="Add your first product to start selling to the Atlas community."
    >
      <button
        type="button"
        className="flex items-center gap-sm rounded bg-champagne px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-obsidian transition-colors duration-300 hover:bg-[#d6b77c] focus:ring-2 focus:ring-champagne focus:ring-offset-2 focus:ring-offset-ink focus:outline-none"
      >
        <Icon name="add" className="text-[18px]" />
        Add Product
      </button>
    </StateCard>
  );
}

function NoOrdersState() {
  return (
    <StateCard
      icon="local_mall"
      title="No orders yet"
      copy="Orders from your customers will appear here once they are placed."
    >
      <button
        type="button"
        className="rounded border border-ivory bg-transparent px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-ivory transition-colors duration-300 hover:bg-ivory/5 focus:ring-2 focus:ring-ivory focus:ring-offset-2 focus:ring-offset-ink focus:outline-none"
      >
        Manage Products
      </button>
    </StateCard>
  );
}

function DeniedState() {
  return (
    <section className="relative flex min-h-[400px] flex-col items-center justify-center overflow-hidden rounded-xl border border-error-container/30 bg-ink p-xxl text-center shadow-[0_32px_64px_-16px_rgba(11,13,15,0.5)]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-error-container/5 to-transparent" />
      <div className="relative z-10 flex max-w-lg flex-col items-center">
        <div className="relative mb-lg">
          <Icon name="lock" className="text-[48px] text-error/80" fill={1} />
          <div className="absolute -inset-4 -z-10 rounded-full bg-error/5 blur-xl" />
        </div>
        <h2 className="mb-sm font-headline-lg text-headline-lg text-ivory">
          Seller access required
        </h2>
        <p className="mb-xl font-body-lg text-body-lg text-muted">
          You don&apos;t have permission to access the seller dashboard. Ensure
          you are logged into a seller account.
        </p>
        <Link
          href="/"
          className="group flex items-center gap-sm px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-ivory transition-colors duration-300 hover:text-champagne focus:outline-none"
        >
          <Icon
            name="arrow_back"
            className="text-[18px] transition-transform group-hover:-translate-x-1"
          />
          Return to Shop
        </Link>
      </div>
    </section>
  );
}

export default function SellerDashboardView({
  demoState,
}: {
  demoState?: SellerDashboardState;
}) {
  const state = demoState ?? "default";

  return (
    <div className="space-y-xl p-margin-mobile md:p-margin-desktop">
      {state === "empty" && <EmptyStoreState />}
      {state === "noorders" && <NoOrdersState />}
      {state === "denied" && <DeniedState />}
      {state === "loading" && <LoadingState />}
      {state === "default" && <OverviewDefault />}
    </div>
  );
}