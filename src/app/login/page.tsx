import type { Metadata } from "next";
import LoginView from "@/components/auth/LoginView";
import type { LoginDemoState } from "@/components/auth/LoginView";
import { pickDemoState } from "@/lib/demo-mode";
import { safeRedirectPath } from "@/lib/safe-redirect";

export const metadata: Metadata = {
  title: "Login - Atlas Marketplace",
  description: "Sign in to continue shopping at Atlas Marketplace.",
};

const demoStates: LoginDemoState[] = ["error", "loading", "success"];

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; next?: string }>;
}) {
  const { state, next } = await searchParams;
  const demoState = pickDemoState(state, demoStates);

  return (
    <LoginView
      key={demoState ?? "default"}
      demoState={demoState}
      next={safeRedirectPath(next, "/account")}
    />
  );
}
