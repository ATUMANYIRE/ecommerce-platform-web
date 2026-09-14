import OrderDetailsView from "@/components/orders/OrderDetailsView";
import { pickDemoState } from "@/lib/demo-mode";

type OrderDetailsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrderDetailsRoute({
  searchParams,
}: OrderDetailsRouteProps) {
  const params = await searchParams;
  const demoState = pickDemoState(params.state, [
    "loading",
    "notfound",
    "tracking",
    "delivered",
  ] as const);

  return (
    <OrderDetailsView key={demoState ?? "default"} demoState={demoState} />
  );
}
