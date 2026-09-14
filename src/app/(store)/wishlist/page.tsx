import WishlistView from "@/components/wishlist/WishlistView";

type WishlistRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function WishlistRoute({
  searchParams,
}: WishlistRouteProps) {
  const params = await searchParams;
  const state = typeof params.state === "string" ? params.state : undefined;

  return (
    <WishlistView
      demoState={state === "auth" || state === "error" ? state : undefined}
    />
  );
}