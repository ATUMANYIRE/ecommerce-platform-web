import { LocalStorageStore, useStore } from "@/lib/utils/localStorageStore";
import type { IconName } from "@/components/ui/Icon";

/** Demo profile and preferences, kept in this browser. */
export type Profile = {
  fullName: string;
  phone: string;
  birthday: string;
  preferences: {
    orderUpdates: boolean;
    newArrivals: boolean;
    priceDrops: boolean;
    newsletter: boolean;
  };
};

const defaultProfile: Profile = {
  fullName: "Eleanor Vance",
  phone: "+1 (555) 019-2834",
  birthday: "",
  preferences: {
    orderUpdates: true,
    newArrivals: true,
    priceDrops: false,
    newsletter: false,
  },
};

export const profileStore = new LocalStorageStore<Profile>(
  "atlas-profile",
  defaultProfile,
  (value) =>
    value !== null && typeof value === "object" && typeof (value as Profile).fullName === "string"
      ? { ...defaultProfile, ...(value as Profile), preferences: { ...defaultProfile.preferences, ...(value as Profile).preferences } }
      : defaultProfile,
);

export function useProfile(): Profile {
  return useStore(profileStore);
}

export type DemoNotification = {
  id: string;
  kind: "order" | "price" | "account" | "promo";
  title: string;
  body: string;
  time: string;
  href?: string;
};

export const notificationIcons: Record<DemoNotification["kind"], IconName> = {
  order: "local_shipping",
  price: "local_offer",
  account: "shield",
  promo: "campaign",
};

/** Sample notifications, newest first (the platform's notification-service feeds these in a live store). */
export const demoNotifications: DemoNotification[] = [
  {
    id: "n-1042",
    kind: "order",
    title: "Your order has shipped",
    body: "Order #ATLAS-77291-B is on its way with FedEx. Estimated delivery Oct 28.",
    time: "2 hours ago",
    href: "/orders/ATLAS-77291-B",
  },
  {
    id: "n-1041",
    kind: "price",
    title: "Price drop on a saved item",
    body: "Momentum Wireless Headphones in your wishlist is now 10% off.",
    time: "Yesterday",
    href: "/products/WH-300",
  },
  {
    id: "n-1039",
    kind: "order",
    title: "Order delivered",
    body: "Order #AT-9942 was delivered to your front door. Tell us what you think.",
    time: "Oct 28",
    href: "/orders/AT-9942",
  },
  {
    id: "n-1035",
    kind: "promo",
    title: "New arrivals are in",
    body: "This week's edit: ceramics, leather goods and considered audio.",
    time: "Oct 25",
    href: "/search?q=*",
  },
  {
    id: "n-1030",
    kind: "account",
    title: "New sign-in to your account",
    body: "A new sign-in from Chrome on Windows. If this wasn't you, change your password.",
    time: "Oct 20",
    href: "/account/settings",
  },
];

const readStore = new LocalStorageStore<string[]>("atlas-notifications-read", ["n-1035", "n-1030"], (value) =>
  Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [],
);

export function useReadNotifications(): {
  read: string[];
  markRead: (id: string) => void;
  markAllRead: () => void;
} {
  const read = useStore(readStore);
  return {
    read,
    markRead: (id) => readStore.set((previous) => (previous.includes(id) ? previous : [...previous, id])),
    markAllRead: () => readStore.set(demoNotifications.map((notification) => notification.id)),
  };
}
