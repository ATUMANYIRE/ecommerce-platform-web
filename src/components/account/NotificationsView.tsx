"use client";

import Link from "next/link";
import { useState } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";
import Icon from "@/components/ui/Icon";
import { demoNotifications, notificationIcons, useReadNotifications } from "@/lib/demo/profile";
import type { DemoNotification } from "@/lib/demo/profile";
import { cn } from "@/lib/utils/cn";

const filters: { id: "all" | "unread" | DemoNotification["kind"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "unread", label: "Unread" },
  { id: "order", label: "Orders" },
  { id: "price", label: "Price drops" },
  { id: "promo", label: "Offers" },
  { id: "account", label: "Security" },
];

/** Inbox of demo notifications with unread state kept in this browser. */
export default function NotificationsView() {
  const { read, markRead, markAllRead } = useReadNotifications();
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");

  const unreadCount = demoNotifications.filter((n) => !read.includes(n.id)).length;
  const visible = demoNotifications.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !read.includes(n.id) : n.kind === filter,
  );

  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-gutter px-margin-mobile py-xxl md:flex-row md:px-margin-desktop">
      <AccountSidebar active="notifications" />
      <div className="flex w-full min-w-0 flex-grow flex-col gap-lg">
        <header className="flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
              Notifications
            </h1>
            <p className="font-body-md text-body-md text-muted">
              {unreadCount > 0 ? `${unreadCount} unread` : "You're all caught up."}
            </p>
          </div>
          <button
            type="button"
            onClick={markAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-xs self-start font-label-md text-label-md uppercase tracking-wider text-secondary transition-colors hover:text-secondary-fixed disabled:text-muted disabled:opacity-60"
          >
            <Icon name="done_all" className="text-[18px]" />
            Mark all as read
          </button>
        </header>

        <div className="hide-scrollbar flex gap-sm overflow-x-auto pb-xs" role="tablist" aria-label="Filter notifications">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              className={cn(
                "shrink-0 rounded-full border px-md py-xs font-label-md text-label-md uppercase tracking-wider transition-colors",
                filter === item.id
                  ? "border-secondary bg-secondary/10 text-secondary"
                  : "border-ivory/15 text-on-surface-variant hover:border-ivory/40 hover:text-ivory",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        {visible.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-ivory/20 bg-ink p-xxl text-center">
            <Icon name="notifications" className="mb-md text-[40px] text-muted" />
            <p className="font-title-lg text-title-lg text-ivory">Nothing here</p>
            <p className="font-body-md text-body-md text-muted">No notifications match this filter.</p>
          </div>
        ) : (
          <ul className="divide-y divide-ivory/10 overflow-hidden rounded-lg border border-ivory/10 bg-ink">
            {visible.map((notification) => {
              const unread = !read.includes(notification.id);
              const content = (
                <>
                  <span
                    className={cn(
                      "mt-xs flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                      unread ? "bg-secondary/15 text-secondary" : "bg-surface-container-high text-muted",
                    )}
                  >
                    <Icon name={notificationIcons[notification.kind]} className="text-[20px]" />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-xs">
                    <span className="flex items-start justify-between gap-md">
                      <span className={cn("font-body-lg text-body-lg", unread ? "font-semibold text-ivory" : "text-on-surface")}>
                        {notification.title}
                      </span>
                      <span className="shrink-0 font-label-sm text-label-sm text-muted">{notification.time}</span>
                    </span>
                    <span className="font-body-md text-body-md text-muted">{notification.body}</span>
                  </span>
                  {unread ? <span className="mt-sm h-2 w-2 shrink-0 rounded-full bg-secondary" aria-label="Unread" /> : null}
                </>
              );
              return (
                <li key={notification.id}>
                  {notification.href ? (
                    <Link
                      href={notification.href}
                      onClick={() => markRead(notification.id)}
                      className="flex items-start gap-md p-lg transition-colors hover:bg-surface-container-low"
                    >
                      {content}
                    </Link>
                  ) : (
                    <div className="flex items-start gap-md p-lg">{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
