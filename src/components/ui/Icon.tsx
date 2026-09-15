import { cn } from "@/lib/utils/cn";

export type IconName =
  | "search"
  | "favorite"
  | "favorite_border"
  | "person"
  | "shopping_bag"
  | "shopping_cart"
  | "menu"
  | "arrow_forward"
  | "remove"
  | "add"
  | "inventory_2"
  | "local_shipping"
  | "assignment_return"
  | "verified"
  | "info"
  | "chevron_right"
  | "lock"
  | "check_circle"
  | "error_outline"
  | "close"
  | "shopping_cart_off"
  | "location_on"
  | "location_off"
  | "remove_shopping_cart"
  | "credit_card"
  | "expand_more"
  | "check"
  | "error"
  | "arrow_back"
  | "inventory"
  | "receipt_long"
  | "search_off"
  | "sync"
  | "dashboard"
  | "settings"
  | "logout"
  | "home_pin"
  | "visibility"
  | "visibility_off"
  | "progress_activity"
  | "add_shopping_cart"
  | "account_circle"
  | "star"
  | "call"
  | "warning"
  | "delete"
  | "work"
  | "edit"
  | "notifications"
  | "payments"
  | "trending_up"
  | "trending_down"
  | "storefront"
  | "local_mall"
  | "store"
  | "reviews"
  | "calendar_today"
  | "refresh"
  | "arrow_upward"
  | "arrow_downward"
  | "filter_list"
  | "category"
  | "sort"
  | "image"
  | "cloud_off"
  | "help"
  | "mail"
  | "schedule"
  | "public"
  | "shield"
  | "description"
  | "undo"
  | "local_offer"
  | "rate_review"
  | "mark_email_read"
  | "key"
  | "badge"
  | "add_photo_alternate"
  | "print"
  | "thumb_up"
  | "flag"
  | "block"
  | "campaign"
  | "admin_panel_settings"
  | "chat"
  | "percent"
  | "event"
  | "done_all"
  | "account_balance_wallet"
  | "login"
  | "person_add"
  | "lock_reset"
  | "sell"
  | "group"
  | "handshake"
  | "eco"
  | "support_agent"
  | "open_in_new";

type IconProps = {
  name: IconName;
  className?: string;
  fill?: 0 | 1;
};

/**
 * Renders a Material Symbols Outlined glyph. The stylesheet is loaded in the
 * root layout via Google Fonts.
 */
export default function Icon({ name, className, fill = 0 }: IconProps) {
  return (
    <span
      className={cn("material-symbols-outlined text-lg", className)}
      style={{ fontVariationSettings: `'FILL' ${fill}, 'wght' 400` }}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}
