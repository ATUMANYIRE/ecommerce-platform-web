import SellerDashboardView, {
  type SellerDashboardState,
} from "@/components/seller/SellerDashboardView";
import { pickDemoState } from "@/lib/demo-mode";

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
  const demoState = pickDemoState(params.state, demoStates);

  return (
    <SellerDashboardView
      key={demoState ?? "default"}
      demoState={demoState}
    />
  );
}
