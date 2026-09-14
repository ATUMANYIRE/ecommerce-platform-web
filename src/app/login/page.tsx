import type { Metadata } from "next";
import LoginView from "@/components/auth/LoginView";
import type { LoginDemoState } from "@/components/auth/LoginView";

export const metadata: Metadata = {
  title: "Login - Atlas Marketplace",
  description: "Sign in to continue shopping at Atlas Marketplace.",
};

const demoStates: LoginDemoState[] = ["error", "loading", "success"];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state } = await searchParams;
  const demoState = demoStates.includes(state as LoginDemoState)
    ? (state as LoginDemoState)
    : undefined;

  return <LoginView key={demoState ?? "default"} demoState={demoState} />;
}