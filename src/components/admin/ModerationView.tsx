"use client";

import { useState } from "react";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import { moderateReview, useModerationQueue } from "@/lib/demo/admin";
import type { ModerationStatus } from "@/lib/demo/admin";
import { cn } from "@/lib/utils/cn";

const tabs: { id: "queue" | ModerationStatus; label: string }[] = [
  { id: "queue", label: "Needs review" },
  { id: "APPROVED", label: "Approved" },
  { id: "REJECTED", label: "Rejected" },
];

const tone: Record<ModerationStatus, string> = {
  PENDING: "border-champagne/30 bg-champagne/10 text-champagne",
  FLAGGED: "border-error/30 bg-error/10 text-error",
  APPROVED: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  REJECTED: "border-muted/30 bg-muted/10 text-muted",
};

/** Review moderation queue: approve, reject or flag (demo). Mirrors review-service statuses. */
export default function ModerationView() {
  const reviews = useModerationQueue();
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("queue");
  const visible = reviews.filter((review) =>
    tab === "queue" ? review.status === "PENDING" || review.status === "FLAGGED" : review.status === tab,
  );

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader
        title="Review moderation"
        description="Only approved reviews are shown on product pages."
      />

      <div className="hide-scrollbar mb-lg flex gap-sm overflow-x-auto border-b border-ivory/10" role="tablist" aria-label="Moderation status">
        {tabs.map((item) => {
          const count = reviews.filter((r) => (item.id === "queue" ? r.status === "PENDING" || r.status === "FLAGGED" : r.status === item.id)).length;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              onClick={() => setTab(item.id)}
              className={cn(
                "-mb-px shrink-0 border-b-2 px-md py-sm font-label-md text-label-md uppercase tracking-wider transition-colors",
                tab === item.id ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant hover:text-ivory",
              )}
            >
              {item.label} <span className="text-muted">({count})</span>
            </button>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-ivory/20 bg-ink p-xxl text-center">
          <Icon name="done_all" className="mb-md text-[40px] text-secondary" />
          <p className="font-title-lg text-title-lg text-ivory">Queue is clear</p>
          <p className="font-body-md text-body-md text-muted">New reviews will appear here for approval.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-md">
          {visible.map((review) => (
            <article key={review.id} className={cn("rounded-lg border bg-ink p-lg", review.status === "FLAGGED" ? "border-error/30" : "border-ivory/10")}>
              <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
                <div className="flex flex-wrap items-center gap-md">
                  <span className={cn("inline-block rounded-sm border px-sm py-xs text-[10px] font-bold uppercase tracking-wider", tone[review.status])}>{review.status}</span>
                  <span className="flex text-secondary" aria-label={`${review.rating} out of 5 stars`}>
                    {[1, 2, 3, 4, 5].map((value) => (
                      <Icon key={value} name="star" fill={value <= review.rating ? 1 : 0} className={cn("text-[16px]", value > review.rating && "text-on-surface-variant")} />
                    ))}
                  </span>
                </div>
                <span className="font-label-sm text-label-sm text-muted">{review.date} · {review.author}</span>
              </div>
              <p className="mb-xs font-label-sm text-label-sm uppercase tracking-widest text-muted">{review.product}</p>
              <h3 className="mb-xs font-title-lg text-title-lg text-ivory">{review.title}</h3>
              <p className="mb-md font-body-md text-body-md text-on-surface-variant">{review.body}</p>
              {review.reason ? (
                <p className="mb-md flex items-center gap-xs font-body-md text-body-md text-error">
                  <Icon name="flag" className="text-[16px]" /> {review.reason}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-sm border-t border-ivory/10 pt-md">
                {review.status !== "APPROVED" ? (
                  <button type="button" onClick={() => moderateReview(review.id, "APPROVED")} className="inline-flex items-center gap-xs rounded bg-secondary px-md py-xs font-label-md text-label-md uppercase tracking-wider text-obsidian hover:bg-secondary/90">
                    <Icon name="check" className="text-[16px]" /> Approve
                  </button>
                ) : null}
                {review.status !== "REJECTED" ? (
                  <button type="button" onClick={() => moderateReview(review.id, "REJECTED")} className="inline-flex items-center gap-xs rounded border border-error/40 px-md py-xs font-label-md text-label-md uppercase tracking-wider text-error hover:bg-error/10">
                    <Icon name="block" className="text-[16px]" /> Reject
                  </button>
                ) : null}
                {review.status === "PENDING" ? (
                  <button type="button" onClick={() => moderateReview(review.id, "FLAGGED")} className="inline-flex items-center gap-xs rounded border border-muted/40 px-md py-xs font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-ivory">
                    <Icon name="flag" className="text-[16px]" /> Flag
                  </button>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
