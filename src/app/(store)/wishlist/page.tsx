import WishlistView from "@/components/wishlist/WishlistView";
import { pickDemoState } from "@/lib/demo-mode";

type WishlistRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WishlistRoute({
  searchParams,
}: WishlistRouteProps) {
  const params = await searchParams;

  return <WishlistView demoState={pickDemoState(params.state, ["auth", "error"])} />;
}
