import { LocalStorageStore, useStore } from "@/lib/utils/localStorageStore";
import { demoOrders } from "@/lib/orders/demo-order";
import type { DemoOrder, OrderProduct } from "@/lib/orders/demo-order";

/**
 * Orders placed through the demo checkout, kept in this browser so a visitor
 * can follow a purchase from payment to "My Orders" and its invoice. No order
 * is sent to a backend and no payment is taken.
 */
const placedOrdersStore = new LocalStorageStore<DemoOrder[]>(
  "atlas-orders",
  [],
  (value) =>
    Array.isArray(value)
      ? value.filter(
          (order): order is DemoOrder =>
            order !== null &&
            typeof order === "object" &&
            typeof order.id === "string" &&
            Array.isArray(order.items),
        )
      : [],
);

export type PlaceOrderInput = {
  items: OrderProduct[];
  addressLines: string[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  shipping: number;
  tax: number;
  currency: string;
  paymentLabel: string;
};

function formatDate(time: number, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-US", options).format(time);
}

function newOrderId(): string {
  const digits = Math.floor(10_000 + Math.random() * 89_999);
  const letter = String.fromCharCode(65 + Math.floor(Math.random() * 26));
  return `ATLAS-${digits}-${letter}`;
}

export function placeDemoOrder(input: PlaceOrderInput): DemoOrder {
  const now = Date.now();
  const time = formatDate(now, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
  const eta = formatDate(now + 5 * 24 * 60 * 60 * 1000, { month: "short", day: "numeric" });
  const order: DemoOrder = {
    id: newOrderId(),
    placedAt: now,
    placedLabel: `Placed on ${formatDate(now, { month: "long", day: "numeric", year: "numeric" })}`,
    status: "Processing",
    estDelivery: `Est. Delivery: ${eta}`,
    timeline: [
      { label: "Received", state: "done" },
      { label: "Processing", state: "active" },
      { label: "Confirmed", state: "pending" },
      { label: "Shipped", state: "pending" },
      { label: "Delivered", state: "pending" },
    ],
    items: input.items,
    carrier: "Pending",
    trackingNumber: "Assigned when shipped",
    trackingEvents: [
      { title: `Payment confirmed — ${input.paymentLabel}`, detail: time, state: "active" },
    ],
    subtotal: input.subtotal,
    discount: input.discount,
    promoCode: input.promoCode,
    shipping: input.shipping,
    tax: input.tax,
    currency: input.currency,
    addressLines: input.addressLines,
  };
  placedOrdersStore.set((previous) => [order, ...previous]);
  return order;
}

/** Orders placed in this browser followed by the sample history, newest first. */
export function useAllOrders(): DemoOrder[] {
  const placed = useStore(placedOrdersStore);
  return [...placed, ...demoOrders].sort((a, b) => (b.placedAt ?? 0) - (a.placedAt ?? 0));
}

export function useOrder(orderId: string): DemoOrder | null {
  const orders = useAllOrders();
  return orders.find((order) => order.id === orderId) ?? null;
}
