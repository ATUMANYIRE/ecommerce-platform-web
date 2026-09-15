import type { Metadata } from "next";
import OrdersView from "@/components/orders/OrdersView";

export const metadata: Metadata = {
  title: "My Orders - Atlas Marketplace",
};

export default function OrdersPage() {
  return <OrdersView />;
}
