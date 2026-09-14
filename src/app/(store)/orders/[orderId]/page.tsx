import OrderDetailsView from "@/components/orders/OrderDetailsView";

type OrderDetailsRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrderDetailsRoute({
  searchParams,
}: OrderDetailsRouteProps) {
  const params = await searchParams;
  const state = typeof params.state === "string" ? params.state : undefined;

  const demoState =
    state === "loading" ||
    state === "notfound" ||
    state === "tracking" ||
    state === "delivered"
      ? state
      : undefined;

  return (
    <OrderDetailsView key={demoState ?? "default"} demoState={demoState} />
  );
}