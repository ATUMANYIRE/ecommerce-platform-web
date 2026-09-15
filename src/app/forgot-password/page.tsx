import type { Metadata } from "next";
import ForgotPasswordView from "@/components/auth/ForgotPasswordView";

export const metadata: Metadata = {
  title: "Forgot Password - Atlas Marketplace",
  description: "Request a link to reset your Atlas password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordView />;
}
