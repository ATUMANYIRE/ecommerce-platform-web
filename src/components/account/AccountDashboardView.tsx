"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Icon from "@/components/ui/Icon";
import AccountSidebar from "@/components/account/AccountSidebar";
import { formatAmount } from "@/lib/utils/currency";
import { findCatalogProduct } from "@/lib/cart/catalog";
import { orderTotal } from "@/lib/orders/demo-order";
import { useAllOrders } from "@/lib/orders/placed-orders";
import type { CatalogProduct } from "@/lib/cart/catalog";

const lampImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCYrLRDKgX1EKJ1pivSf7NN8FV766mBFrZwnV_hC4EE-9r_8_QZ_2ZImKzFkgzp8qspJMhzSrSrqW_8nC7LseUwraDHUrW3eGRl3lIt2LxnFT3YFo87GrftkA8Q6Z6wUWWgWYlpym_409wws13LcCSd0DAVuU1ac12RoIlrF2DniVPIHoePR4Th-TprupZp0HEb1kRzGWw_EWV-62zfBmhEWm7q5iO50NDMh2bD5g9KZ_MnHxoxaSjO2g";

const chairImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBtztbwGPFUN-nIYThg5mrTYjEQrlyC008unB884d5f8LPjqcZK6c0BHk7l7-5eNeMWmJv0SQdF8oFBoDUFSOIwaFEYnZQHP2rBg9vXqpLYRTrIUHsVQH1rEZBnWJwSbgTAFrRXVDoevJ13v6qfH6TMHNjdaUr71sYtdukzOV000zvML_zT5ZoNaN-Oi4Vc7yOFIDWRHwM6dFBI0gNaf2HDmQBXpMHrCAZzZaBEMo4PyaF-ezdtZRDWcQ";

const fallbackPreview: CatalogProduct[] = [
  {
    sku: "LMP-320",
    name: "Lumina Desk Lamp",
    price: 320,
    currency: "USD",
    image: lampImage,
    category: "Lighting",
  },
  {
    sku: "CHR-1450",
    name: "Aura Lounge Chair",
    price: 1450,
    currency: "USD",
    image: chairImage,
    category: "Furniture",
  },
];


type PreviewProduct = {
  catalog: CatalogProduct;
  inWishlist: boolean;
};

function PreviewCard({
  product,
  onRemove,
  onAdd,
}: {
  product: CatalogProduct;
  onRemove: () => void;
  onAdd: () => void;
}) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-muted/20 bg-surface p-lg">
      <div className="relative mb-md aspect-square w-full overflow-hidden rounded bg-surface-container-lowest shadow-[inset_0_0_40px_rgba(247,245,240,0.05)]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 300px"
          className="object-cover opacity-80 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
        />
        <button
          type="button"
          aria-label={`Remove ${product.name} from wishlist`}
          onClick={onRemove}
          className="absolute right-2 top-2 z-10 rounded-full bg-background/50 p-1 text-secondary backdrop-blur-sm transition-colors hover:bg-background"
        >
          <Icon name="favorite" className="text-[18px]" />
        </button>
      </div>
      <div className="flex flex-grow flex-col">
        <p className="mb-xs font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
          {product.category}
        </p>
        <h3 className="mb-sm line-clamp-2 font-title-lg text-body-lg text-on-surface">
          {product.name}
        </h3>
        <div className="mt-auto flex items-center justify-between">
          <span className="font-display-md text-title-lg text-on-surface">
            {formatAmount(product.price, product.currency)}
          </span>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={onAdd}
            className="text-secondary transition-colors hover:text-on-secondary-container"
          >
            <Icon name="add_shopping_cart" />
          </button>
        </div>
      </div>
    </article>
  );
}

/**
 * Account dashboard (Overview). Renders under the store chrome with the left
 * account nav, quick-action bento cards, recent orders table, and a wishlist
 * preview driven by the shared wishlist store.
 */
export default function AccountDashboardView() {
  const { addItem } = useCart();
  const { skus, count, remove } = useWishlist();
  const allOrders = useAllOrders();
  // Same data as My Orders, so every row opens a real order page.
  const recentOrders = allOrders.slice(0, 3).map((order) => ({
    id: order.id,
    date: order.placedLabel.replace("Placed on ", ""),
    status: order.status,
    total: orderTotal(order),
    currency: order.currency ?? "USD",
  }));
  const activeOrders = allOrders.filter((order) => order.status === "Processing" || order.status === "Shipped").length;

  const previewProducts: PreviewProduct[] = skus
    .slice(0, 4)
    .map((sku) => ({ catalog: findCatalogProduct(sku), inWishlist: true }))
    .filter((entry): entry is PreviewProduct & { catalog: CatalogProduct } =>
      Boolean(entry.catalog),
    );

  const cards =
    previewProducts.length > 0
      ? previewProducts.map((entry) => entry.catalog)
      : fallbackPreview;

  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-gutter px-margin-mobile py-xxl md:flex-row md:px-margin-desktop">
      <AccountSidebar active="overview" />

      {/* Content */}
      <div className="flex w-full min-w-0 flex-grow flex-col space-y-xxl">
        {/* Welcome header */}
        <header>
          <h1 className="mb-sm font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
            Welcome back.
          </h1>
          <p className="max-w-2xl font-body-lg text-body-lg text-on-surface-variant">
            Manage your orders, view saved items, and update your personal
            details from your personal dashboard.
          </p>
        </header>

        {/* Quick actions */}
        <section aria-label="Quick Actions" className="grid grid-cols-1 gap-md md:grid-cols-3">
          <div className="group flex h-full flex-col justify-between rounded-lg border border-muted/20 bg-surface p-lg transition-colors hover:bg-surface-container-high">
            <div className="mb-xl flex items-start justify-between">
              <div className="inline-flex rounded-full bg-surface-container-highest p-sm">
                <Icon name="local_shipping" className="text-[24px] text-secondary" />
              </div>
              <span className="rounded bg-surface-container px-2 py-1 font-label-sm text-label-sm text-on-surface-variant">
                {activeOrders} Active
              </span>
            </div>
            <div>
              <h3 className="mb-xs font-title-lg text-title-lg text-on-surface">
                Track Orders
              </h3>
              <p className="mb-md font-body-md text-body-md text-on-surface-variant">
                View status and history of your recent purchases.
              </p>
              <Link
                href="/account/orders"
                className="inline-flex items-center font-label-md text-label-md text-secondary transition-colors hover:text-on-secondary-container"
              >
                View all orders
                <Icon
                  name="arrow_forward"
                  className="ml-xs text-[16px] transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div className="group flex h-full flex-col justify-between rounded-lg border border-muted/20 bg-surface p-lg transition-colors hover:bg-surface-container-high">
            <div className="mb-xl flex items-start justify-between">
              <div className="inline-flex rounded-full bg-surface-container-highest p-sm">
                <Icon name="favorite_border" className="text-[24px] text-secondary" />
              </div>
              <span className="rounded bg-surface-container px-2 py-1 font-label-sm text-label-sm text-on-surface-variant">
                {count} {count === 1 ? "Item" : "Items"}
              </span>
            </div>
            <div>
              <h3 className="mb-xs font-title-lg text-title-lg text-on-surface">
                Wishlist
              </h3>
              <p className="mb-md font-body-md text-body-md text-on-surface-variant">
                Manage the items you&apos;ve saved for later consideration.
              </p>
              <Link
                href="/account/wishlist"
                className="inline-flex items-center font-label-md text-label-md text-secondary transition-colors hover:text-on-secondary-container"
              >
                Explore wishlist
                <Icon
                  name="arrow_forward"
                  className="ml-xs text-[16px] transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>

          <div className="group flex h-full flex-col justify-between rounded-lg border border-muted/20 bg-surface p-lg transition-colors hover:bg-surface-container-high">
            <div className="mb-xl flex items-start justify-between">
              <div className="inline-flex rounded-full bg-surface-container-highest p-sm">
                <Icon name="home_pin" className="text-[24px] text-secondary" />
              </div>
            </div>
            <div>
              <h3 className="mb-xs font-title-lg text-title-lg text-on-surface">
                Addresses
              </h3>
              <p className="mb-md font-body-md text-body-md text-on-surface-variant">
                Update your shipping and billing locations for faster checkout.
              </p>
              <Link
                href="/account/addresses"
                className="inline-flex items-center font-label-md text-label-md text-secondary transition-colors hover:text-on-secondary-container"
              >
                Manage addresses
                <Icon
                  name="arrow_forward"
                  className="ml-xs text-[16px] transition-transform group-hover:translate-x-1"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* Recent orders */}
        <section aria-label="Recent Orders">
          <div className="mb-lg flex items-end justify-between border-b border-muted/20 pb-sm">
            <h2 className="font-display-md text-headline-lg-mobile text-on-surface md:text-headline-lg">
              Recent Orders
            </h2>
            <Link
              href="/account/orders"
              className="font-label-sm text-label-sm text-secondary hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="overflow-hidden rounded-lg border border-muted/20 bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="border-b border-muted/20 bg-surface-container-lowest/50">
                    <th className="p-md font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Order ID
                    </th>
                    <th className="p-md font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Date
                    </th>
                    <th className="p-md font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Status
                    </th>
                    <th className="p-md text-right font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Total
                    </th>
                    <th className="p-md text-right font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-surface-container-low"
                    >
                      <td className="p-md font-body-md text-body-md font-medium text-on-surface">
                        #{order.id}
                      </td>
                      <td className="p-md font-body-md text-body-md text-on-surface-variant">
                        {order.date}
                      </td>
                      <td className="p-md">
                        <span
                          className={
                            order.status === "Processing"
                              ? "inline-flex items-center rounded bg-secondary/10 px-2 py-1 font-label-sm text-label-sm text-secondary"
                              : "inline-flex items-center rounded bg-surface-variant px-2 py-1 font-label-sm text-label-sm text-on-surface-variant"
                          }
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="p-md text-right font-body-lg text-body-lg text-on-surface">
                        {formatAmount(order.total, order.currency)}
                      </td>
                      <td className="p-md text-right">
                        <Link
                          href={`/orders/${encodeURIComponent(order.id)}`}
                          aria-label={`View Order ${order.id} Details`}
                          className="text-on-surface-variant transition-colors hover:text-on-surface"
                        >
                          <Icon name="visibility" className="text-[20px]" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Saved for later */}
        <section aria-label="Saved for Later Preview">
          <div className="mb-lg flex items-end justify-between border-b border-muted/20 pb-sm">
            <h2 className="font-display-md text-headline-lg-mobile text-on-surface md:text-headline-lg">
              Saved for Later
            </h2>
            <Link
              href="/account/wishlist"
              className="font-label-sm text-label-sm text-secondary hover:underline"
            >
              Manage Wishlist
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-md md:grid-cols-4">
            {cards.map((product) => (
              <PreviewCard
                key={product.sku}
                product={product}
                onRemove={() => remove(product.sku)}
                onAdd={() =>
                  addItem(product.sku, 1, {
                    name: product.name,
                    price: product.price,
                    currency: product.currency,
                    image: product.image,
                    category: product.category,
                  })
                }
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}