export type OrderProduct = {
  sku: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  currency: string;
  variant?: string;
};

export type TrackingEvent = {
  title: string;
  detail: string;
  state: "done" | "active";
};

export type TimelineStep = {
  label: string;
  state: "done" | "active" | "pending";
  date?: string;
};

export type DemoOrder = {
  id: string;
  placedLabel: string;
  status: string;
  estDelivery?: string;
  timeline: TimelineStep[];
  items: OrderProduct[];
  carrier: string;
  trackingNumber: string;
  trackingEvents: TrackingEvent[];
  subtotal: number;
  shipping: number;
  tax: number;
  addressLines: string[];
  /** ISO 4217 code for every amount on the order (demo orders are USD). */
  currency?: string;
  discount?: number;
  promoCode?: string;
  /** Epoch ms, used to sort orders newest first. */
  placedAt?: number;
};

const headphonesImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCaBzdXnVEisaODwt1DvSI67zoYiu-ekRlLfwq5-pnIH9G9HuhniH1-wEvDVKv_QsLQb7Sd9gUlU3DqXjs9EIhgSLJ1PuUNWRO-xcGI0oQH-N3fmJ4PSS7nQR81YQt4MatRQgP51ltQ5qQqiz01PsJRLM14VkjqR5xn6Po55bNlEOWK1DkGM9UMUhoK1Jnj5jKDIEYUNaSMtn8nc7MjcpSWuJYwER4ctlpBgTi6ql56rejZ0zSpcWTHIw";

const toteImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCx0xIX1g8bkRybBn8Ao541cku10JUimIfWKxAPBju1FRf2pKRX5F0R1zzv9IVzXMJaUmeK7IElc08r3-P1iP8FmbqppLTPTaizTm_UJxDc6kP0lbTnuImx0FubadaKZv0-cZd5aX-JbchyfYOOikBiqthhpBve95Fy7Ms1lM6n_Td6BLmM5mIZXtricjDH8GggH2lOvm3LJFCzSlAe3NeI4GG7LtQbMgNfa6vtry6VNzw31PjbVs0QvA";

export const demoOrder: DemoOrder = {
  id: "ATLAS-77291-B",
  placedLabel: "Placed on October 24, 2023",
  status: "Shipped",
  estDelivery: "Est. Delivery: Oct 28",
  timeline: [
    { label: "Received", state: "done" },
    { label: "Processing", state: "done" },
    { label: "Confirmed", state: "done" },
    { label: "Shipped", state: "active" },
    { label: "Delivered", state: "pending" },
  ],
  items: [
    {
      sku: "AUR-PRO-BLK",
      name: "Aura Pro Wireless Headphones",
      image: headphonesImage,
      quantity: 1,
      price: 350,
      currency: "USD",
    },
    {
      sku: "LTH-TOT-BRN",
      name: "Heritage Leather Tote",
      image: toteImage,
      quantity: 1,
      price: 399,
      currency: "USD",
    },
  ],
  carrier: "FedEx",
  trackingNumber: "#7734109284",
  trackingEvents: [
    {
      title: "In Transit - Memphis, TN",
      detail: "Oct 26, 2023 • 08:42 AM",
      state: "active",
    },
    {
      title: "Departed Facility - Austin, TX",
      detail: "Oct 25, 2023 • 11:15 PM",
      state: "done",
    },
    {
      title: "Shipment Created",
      detail: "Oct 24, 2023 • 03:30 PM",
      state: "done",
    },
  ],
  subtotal: 749,
  shipping: 15,
  tax: 62,
  addressLines: [
    "Eleanor Vance",
    "1042 Hillside Manor Drive",
    "Suite 200",
    "Los Angeles, CA 90012",
    "United States",
  ],
};

export const deliveredOrder: DemoOrder = {
  ...demoOrder,
  id: "AT-9942",
  placedLabel: "Placed Oct 24, 2023",
  status: "Delivered",
  timeline: [
    { label: "Placed", state: "done", date: "Oct 24" },
    { label: "Processed", state: "done", date: "Oct 25" },
    { label: "Shipped", state: "done", date: "Oct 26" },
    { label: "Delivered", state: "done", date: "Oct 28" },
  ],
  trackingEvents: [
    {
      title: "Delivered - Front Door",
      detail: "Oct 28, 2023 • 02:14 PM",
      state: "done",
    },
    {
      title: "Out for Delivery - Los Angeles, CA",
      detail: "Oct 28, 2023 • 08:05 AM",
      state: "done",
    },
    {
      title: "In Transit - Memphis, TN",
      detail: "Oct 26, 2023 • 08:42 AM",
      state: "done",
    },
  ],
};
export const processingOrder: DemoOrder = {
  id: "ATLAS-80417-C",
  placedLabel: "Placed on November 2, 2023",
  placedAt: Date.UTC(2023, 10, 2),
  status: "Processing",
  estDelivery: "Est. Delivery: Nov 8",
  timeline: [
    { label: "Received", state: "done" },
    { label: "Processing", state: "active" },
    { label: "Confirmed", state: "pending" },
    { label: "Shipped", state: "pending" },
    { label: "Delivered", state: "pending" },
  ],
  items: [
    {
      sku: "MK-140",
      name: "Mechanical Keyboard",
      image: "/images/keyboard.png",
      quantity: 1,
      price: 140,
      currency: "USD",
    },
    {
      sku: "RS-045",
      name: "Rejuvenating Serum",
      image: "/images/serum.png",
      quantity: 2,
      price: 45,
      currency: "USD",
    },
  ],
  carrier: "Pending",
  trackingNumber: "Assigned when shipped",
  trackingEvents: [
    { title: "Order received", detail: "Nov 2, 2023 • 10:05 AM", state: "active" },
  ],
  subtotal: 230,
  shipping: 0,
  tax: 19.55,
  addressLines: [
    "Eleanor Vance",
    "555 Market Street",
    "34th Floor",
    "San Francisco, CA 94104",
    "United States",
  ],
};

export const cancelledOrder: DemoOrder = {
  id: "ATLAS-69903-A",
  placedLabel: "Placed on September 12, 2023",
  placedAt: Date.UTC(2023, 8, 12),
  status: "Cancelled",
  timeline: [
    { label: "Received", state: "done", date: "Sep 12" },
    { label: "Cancelled", state: "done", date: "Sep 13" },
  ],
  items: [
    {
      sku: "PR-120",
      name: "Performance Runner",
      image: "/images/runner.png",
      quantity: 1,
      price: 120,
      currency: "USD",
    },
  ],
  carrier: "—",
  trackingNumber: "Not shipped",
  trackingEvents: [
    { title: "Order cancelled at your request", detail: "Sep 13, 2023 • 09:12 AM", state: "done" },
  ],
  subtotal: 120,
  shipping: 15,
  tax: 10.2,
  addressLines: ["Eleanor Vance", "12 Aspen Retreat Road", "Aspen, CO 81611", "United States"],
};

/** Sample order history shown to every visitor alongside orders placed in this browser. */
export const demoOrders: DemoOrder[] = [
  processingOrder,
  { ...demoOrder, placedAt: Date.UTC(2023, 9, 24, 15) },
  { ...deliveredOrder, placedAt: Date.UTC(2023, 9, 24, 9) },
  cancelledOrder,
];

export function orderTotal(order: DemoOrder): number {
  return order.subtotal - (order.discount ?? 0) + order.shipping + order.tax;
}

export function orderItemCount(order: DemoOrder): number {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}
