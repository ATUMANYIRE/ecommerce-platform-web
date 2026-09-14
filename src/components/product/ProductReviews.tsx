import type { ProductReview } from "@/lib/demo-data";
import { cn } from "@/lib/utils/cn";

function Stars({ rating }: { rating: ProductReview["rating"] }) {
  return (
    <div className="flex text-sm text-secondary" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < rating;
        return (
          <span
            key={i}
            aria-hidden="true"
            className={cn(
              "material-symbols-outlined",
              filled
                ? "[font-variation-settings:'FILL'_1]"
                : "text-on-surface-variant",
            )}
          >
            {filled ? "star" : "star_border"}
          </span>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }: { review: ProductReview }) {
  return (
    <article className="flex flex-col gap-md rounded-lg bg-surface p-lg shadow-[0_32px_32px_rgba(11,14,18,0.15)]">
      <div className="flex items-start justify-between">
        <Stars rating={review.rating} />
        {review.verified && (
          <span className="flex items-center gap-1 rounded border border-secondary/20 bg-secondary/10 px-2 py-1 font-label-sm text-label-sm uppercase text-secondary">
            <span className="material-symbols-outlined text-[12px]">verified</span>
            Verified
          </span>
        )}
      </div>

      <div>
        <h4 className="mb-2 font-title-lg text-title-lg text-on-surface">
          {review.title}
        </h4>
        <p className="font-body-md text-body-md text-on-surface-variant">
          {review.body}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-3 pt-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high font-label-md text-label-md uppercase text-on-surface">
          {review.initials}
        </span>
        <span className="font-label-md text-label-md uppercase tracking-widest text-on-surface">
          {review.author}
        </span>
      </div>
    </article>
  );
}

export default function ProductReviews({ reviews }: { reviews: ProductReview[] }) {
  return (
    <section className="flex flex-col gap-xl">
      <div className="flex items-end justify-between border-b border-outline-variant/30 pb-md">
        <h2 className="font-display-md text-headline-lg text-on-surface">
          Client Feedback
        </h2>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded border border-outline/10 bg-[#15181C] p-xl py-xxl text-center shadow-[0_32px_32px_rgba(11,14,18,0.15)]">
          <span className="material-symbols-outlined mb-md text-[48px] text-surface-variant">
            rate_review
          </span>
          <h3 className="mb-sm font-title-lg text-title-lg text-on-surface">
            Be the first to share your thoughts
          </h3>
          <p className="mb-lg max-w-md font-body-md text-body-md text-on-surface-variant">
            We value your expertise. Your review helps maintain the high
            standards of the Atlas community and guides others in their
            curation.
          </p>
          <button
            type="button"
            className="rounded border border-on-surface bg-transparent px-xl py-sm font-label-md text-label-md uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-variant"
          >
            Write a Review
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2">
          {reviews.map((review) => (
            <ReviewCard key={review.author} review={review} />
          ))}
        </div>
      )}
    </section>
  );
}