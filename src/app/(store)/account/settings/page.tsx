import type { Metadata } from "next";
import AccountSettingsView from "@/components/account/AccountSettingsView";

export const metadata: Metadata = {
  title: "Account Settings - Atlas Marketplace",
};

export default function AccountSettingsPage() {
  return <AccountSettingsView />;
}
