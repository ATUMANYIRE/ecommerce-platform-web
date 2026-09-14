import CartView from "@/components/cart/CartView";
import { pickDemoState } from "@/lib/demo-mode";

type CartRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CartRoute({ searchParams }: CartRouteProps) {
  const params = await searchParams;

  return <CartView demoState={pickDemoState(params.state, ["error"])} />;
}
