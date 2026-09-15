import OrderProcessingView from "@/components/checkout/OrderProcessingView";

type ConfirmationRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ConfirmationRoute({
  searchParams,
}: ConfirmationRouteProps) {
  const params = await searchParams;
  const state = typeof params.state === "string" ? params.state : undefined;
  const order = typeof params.order === "string" && /^[A-Z0-9-]{1,40}$/.test(params.order)
    ? params.order
    : undefined;

  const demoState =
    state === "success" || state === "failure" || state === "loading"
      ? state
      : undefined;

  return <OrderProcessingView demoState={demoState} placedOrderId={order} />;
}