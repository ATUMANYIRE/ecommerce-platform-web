import AddressesView from "@/components/account/AddressesView";
import type { AddressesDemoState } from "@/components/account/AddressesView";

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
  const demoState = demoStates.includes(state as AddressesDemoState)
    ? (state as AddressesDemoState)
    : undefined;

  return (
    <AddressesView key={demoState ?? "default"} demoState={demoState} />
  );
}