import AddressesView from "@/components/account/AddressesView";
import type { AddressesDemoState } from "@/components/account/AddressesView";
import { pickDemoState } from "@/lib/demo-mode";

const demoStates: AddressesDemoState[] = [
  "empty",
  "error",
  "auth",
  "loading",
  "add",
];

export default async function AccountAddressesPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const demoState = pickDemoState(state, demoStates);

  return (
    <AddressesView key={demoState ?? "default"} demoState={demoState} />
  );
}
