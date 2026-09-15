import type { Metadata } from "next";
import NotificationsView from "@/components/account/NotificationsView";

export const metadata: Metadata = {
  title: "Notifications - Atlas Marketplace",
};

export default function NotificationsPage() {
  return <NotificationsView />;
}
