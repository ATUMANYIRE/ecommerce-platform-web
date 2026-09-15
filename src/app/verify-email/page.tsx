import type { Metadata } from "next";
import VerifyEmailView from "@/components/auth/VerifyEmailView";

export const metadata: Metadata = {
  title: "Verify E-mail - Atlas Marketplace",
  description: "Confirm the e-mail address on your Atlas account.",
};

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  return <VerifyEmailView hasToken={typeof token === "string" && token.length > 0} />;
}
