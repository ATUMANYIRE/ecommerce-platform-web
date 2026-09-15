"use client";

import { useState } from "react";
import DashboardPageHeader from "@/components/seller/DashboardPageHeader";
import Icon from "@/components/ui/Icon";
import { inputClass, primaryButtonClass, secondaryButtonClass } from "@/components/forms/styles";
import { replyToReview, useSellerReviews } from "@/lib/demo/seller";
import type { SellerReview } from "@/lib/demo/seller";
import { cn } from "@/lib/utils/cn";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex text-secondary" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((value) => (
        <Icon key={value} name="star" fill={value <= rating ? 1 : 0} className={cn("text-[18px]", value > rating && "text-on-surface-variant")} />
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: SellerReview }) {
  const [replying, setReplying] = useState(false);
  const [text, setText] = useState(review.reply ?? "");

  return (
    <article className="rounded-lg border border-ivory/10 bg-ink p-lg">
      <div className="mb-sm flex flex-wrap items-center justify-between gap-sm">
        <div className="flex items-center gap-md">
          <Stars rating={review.rating} />
          {review.verified ? (
            <span className="inline-flex items-center gap-xs rounded border border-secondary/20 bg-secondary/10 px-2 py-0.5 font-label-sm text-label-sm uppercase text-secondary">
              <Icon name="verified" className="text-[12px]" /> Verified
            </span>
          ) : null}
        </div>
        <span className="font-label-sm text-label-sm text-muted">{review.date}</span>
      </div>
      <p className="mb-xs font-label-sm text-label-sm uppercase tracking-widest text-muted">{review.product}</p>
      <h3 className="mb-xs font-title-lg text-title-lg text-ivory">{review.title}</h3>
      <p className="mb-md font-body-md text-body-md text-on-surface-variant">{review.body}</p>
      <p className="font-label-md text-label-md uppercase tracking-wider text-on-surface">— {review.author}</p>

      {review.reply && !replying ? (
        <div className="mt-md rounded border-l-2 border-secondary bg-surface-container-low p-md">
          <p className="mb-xs font-label-sm text-label-sm uppercase tracking-widest text-secondary">Your reply</p>
          <p className="font-body-md text-body-md text-on-surface-variant">{review.reply}</p>
          <button type="button" onClick={() => setReplying(true)} className="mt-sm font-label-md text-label-md uppercase tracking-wider text-on-surface-variant hover:text-ivory">
            Edit reply
          </button>
        </div>
      ) : replying ? (
        <form
          className="mt-md flex flex-col gap-sm"
          onSubmit={(event) => {
            event.preventDefault();
            if (!text.trim()) return;
            replyToReview(review.id, text.trim());
            setReplying(false);
          }}
        >
          <label htmlFor={`reply-${review.id}`} className="sr-only">Reply</label>
          <textarea
            id={`reply-${review.id}`}
            rows={3}
            maxLength={1000}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Thank the customer or address their concern publicly…"
            className={cn(inputClass, "resize-y")}
          />
          <div className="flex gap-sm">
            <button type="submit" className={primaryButtonClass}>Post reply</button>
            <button type="button" onClick={() => setReplying(false)} className={secondaryButtonClass}>Cancel</button>
          </div>
        </form>
      ) : (
        <button type="button" onClick={() => setReplying(true)} className="mt-md inline-flex items-center gap-xs font-label-md text-label-md uppercase tracking-wider text-secondary hover:text-secondary-fixed">
          <Icon name="chat" className="text-[16px]" /> Reply
        </button>
      )}
    </article>
  );
}

/** Customer reviews of this seller's products, with public replies (demo). */
export default function SellerReviewsView() {
  const reviews = useSellerReviews();
  const [filter, setFilter] = useState<"all" | "unanswered" | "critical">("all");
  const average = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0;
  const visible = reviews.filter((r) =>
    filter === "all" ? true : filter === "unanswered" ? !r.reply : r.rating <= 3,
  );

  return (
    <div className="p-margin-mobile md:p-margin-desktop">
      <DashboardPageHeader title="Reviews" description="Respond to feedback — replies are shown publicly under the review." />

      <section className="mb-xl grid grid-cols-1 gap-md sm:grid-cols-3">
        <div className="rounded border border-outline-variant/10 bg-ink p-lg">
          <p className="mb-md font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Average rating</p>
          <div className="flex items-end gap-sm">
            <p className="font-display-md text-display-md leading-none text-on-surface">{average.toFixed(1)}</p>
            <Stars rating={Math.round(average)} />
          </div>
        </div>
        <div className="rounded border border-outline-variant/10 bg-ink p-lg">
          <p className="mb-md font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Reviews</p>
          <p className="font-display-md text-display-md leading-none text-on-surface">{reviews.length}</p>
        </div>
        <div className="rounded border border-outline-variant/10 bg-ink p-lg">
          <p className="mb-md font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Awaiting reply</p>
          <p className="font-display-md text-display-md leading-none text-on-surface">{reviews.filter((r) => !r.reply).length}</p>
        </div>
      </section>

      <div className="mb-lg flex gap-sm" role="tablist" aria-label="Filter reviews">
        {([
          ["all", "All"],
          ["unanswered", "Awaiting reply"],
          ["critical", "3 stars or less"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={filter === id}
            onClick={() => setFilter(id)}
            className={cn(
              "rounded-full border px-md py-xs font-label-md text-label-md uppercase tracking-wider transition-colors",
              filter === id ? "border-secondary bg-secondary/10 text-secondary" : "border-ivory/15 text-on-surface-variant hover:text-ivory",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-md xl:grid-cols-2">
        {visible.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="rounded-lg border border-dashed border-ivory/20 bg-ink p-xxl text-center font-body-md text-body-md text-muted">
          No reviews match this filter.
        </p>
      ) : null}
    </div>
  );
}
