import CheckoutView from "@/components/checkout/CheckoutView";
import { pickDemoState } from "@/lib/demo-mode";

type CheckoutRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CheckoutRoute({
  searchParams,
}: CheckoutRouteProps) {
  const params = await searchParams;
  const demoState = pickDemoState(params.state, [
    "noaddress",
    "empty",
    "expiredpromo",
  ] as const);

  return <CheckoutView demoState={demoState} />;
}
