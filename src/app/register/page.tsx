import type { Metadata } from "next";
import RegisterView from "@/components/auth/RegisterView";
import type { RegisterDemoState } from "@/components/auth/RegisterView";
import { pickDemoState } from "@/lib/demo-mode";

export const metadata: Metadata = {
  title: "Register - Atlas Marketplace",
  description: "Create an account and start shopping at Atlas Marketplace.",
};

const demoStates: RegisterDemoState[] = [
  "error-validation",
  "error-registered",
  "loading",
  "success",
];

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const demoState = pickDemoState(state, demoStates);

  return <RegisterView key={demoState ?? "default"} demoState={demoState} />;
}
