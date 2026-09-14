import CheckoutView from "@/components/checkout/CheckoutView";

type CheckoutRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutRoute({
  searchParams,
}: CheckoutRouteProps) {
  const params = await searchParams;
  const state = typeof params.state === "string" ? params.state : undefined;

  const demoState =
    state === "noaddress" || state === "empty" || state === "expiredpromo"
      ? state
      : undefined;

  return <CheckoutView demoState={demoState} />;
}