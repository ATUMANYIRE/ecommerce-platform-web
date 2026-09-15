import type { Metadata } from "next";
import ResetPasswordView from "@/components/auth/ResetPasswordView";

export const metadata: Metadata = {
  title: "Reset Password - Atlas Marketplace",
  description: "Choose a new password for your Atlas account.",
};

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <ResetPasswordView hasToken={typeof token === "string" && token.length > 0} />;
}
