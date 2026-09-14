import SellerDashboardView, {
  type SellerDashboardState,
} from "@/components/seller/SellerDashboardView";

type SellerRouteProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const demoStates: SellerDashboardState[] = [
  "empty",
  "noorders",
  "denied",
  "loading",
];

export default async function SellerRoute({
  searchParams,
}: SellerRouteProps) {
  const params = await searchParams;
  const state = typeof params.state === "string" ? params.state : undefined;
  const demoState = demoStates.includes(state as SellerDashboardState)
    ? (state as SellerDashboardState)
    : undefined;

  return (
    <SellerDashboardView
      key={demoState ?? "default"}
      demoState={demoState}
    />
  );
}