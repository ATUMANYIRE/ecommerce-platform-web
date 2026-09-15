import OrderDetailsView from "@/components/orders/OrderDetailsView";
import { pickDemoState } from "@/lib/demo-mode";

type OrderDetailsRouteProps = {
  params: Promise<{ orderId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrderDetailsRoute({
  params,
  searchParams,
}: OrderDetailsRouteProps) {
  const { orderId } = await params;
  const query = await searchParams;
  const demoState = pickDemoState(query.state, [
    "loading",
    "notfound",
    "tracking",
    "delivered",
  ] as const);

  return (
    <OrderDetailsView
      key={`${orderId}-${demoState ?? "default"}`}
      orderId={decodeURIComponent(orderId)}
      demoState={demoState}
    />
  );
}
