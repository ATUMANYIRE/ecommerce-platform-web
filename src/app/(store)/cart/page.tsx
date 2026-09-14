import CartView from "@/components/cart/CartView";

type CartRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CartRoute({ searchParams }: CartRouteProps) {
  const params = await searchParams;
  const state = typeof params.state === "string" ? params.state : undefined;

  return <CartView demoState={state === "error" ? "error" : undefined} />;
}