"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { cardClass, inputClass, labelClass, primaryButtonClass } from "@/components/forms/styles";
import { isUnoptimizedImage } from "@/lib/utils/image";
import { cn } from "@/lib/utils/cn";

const ratingLabels = ["", "Poor", "Fair", "Good", "Very good", "Excellent"];
const TITLE_MAX = 255;
const BODY_MAX = 5000;

/** Review form (demo): validates like review-service (rating 1–5, title ≤ 255, body ≤ 5000). */
export default function WriteReviewView({ sku, name, image }: { sku: string; name: string; image: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [recommend, setRecommend] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");
  const productHref = `/products/${encodeURIComponent(sku)}`;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (rating < 1) {
      setError("Choose a star rating.");
      return;
    }
    if (body.trim().length < 20) {
      setError("Tell us a little more — at least 20 characters.");
      return;
    }
    setError(null);
    setPhase("sending");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPhase("sent");
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-margin-mobile py-xl md:px-margin-desktop md:py-xxl">
      <nav
        aria-label="Breadcrumb"
        className="mb-lg flex items-center gap-xs font-label-sm text-label-sm uppercase tracking-wider text-muted"
      >
        <Link href={productHref} className="inline-flex items-center gap-xs transition-colors hover:text-ivory">
          <Icon name="arrow_back" className="text-[16px]" />
          Back to product
        </Link>
      </nav>

      <div className="mb-xl flex items-center gap-md">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface-container-high">
          <Image src={image} alt={name} fill sizes="80px" unoptimized={isUnoptimizedImage(image)} className="object-cover" />
        </div>
        <div>
          <p className="font-label-sm text-label-sm uppercase tracking-widest text-muted">Write a review</p>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:text-headline-lg">{name}</h1>
        </div>
      </div>

      {phase === "sent" ? (
        <section className={cn(cardClass, "flex flex-col items-center py-xxl text-center")}>
          <Icon name="rate_review" className="mb-md text-[48px] text-secondary" />
          <h2 className="mb-sm font-headline-lg-mobile text-headline-lg-mobile text-ivory">Thank you for your review</h2>
          <p className="mb-xl max-w-md font-body-md text-body-md text-muted">
            Reviews are checked by our moderators before they appear on the product page, usually within a day.
            (Demo store: the review is not stored.)
          </p>
          <Link href={productHref} className={primaryButtonClass}>
            Back to product
          </Link>
        </section>
      ) : (
        <form onSubmit={handleSubmit} className={cn(cardClass, "flex flex-col gap-xl")}>
          {error ? (
            <p role="alert" className="flex items-center gap-sm rounded border border-error/20 bg-error-container/10 p-md font-body-md text-body-md text-error">
              <Icon name="error" className="text-[18px]" />
              {error}
            </p>
          ) : null}

          <fieldset>
            <legend className={labelClass}>Overall rating</legend>
            <div className="flex items-center gap-md">
              <div className="flex" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    aria-label={`${value} star${value === 1 ? "" : "s"}`}
                    aria-pressed={rating === value}
                    onMouseEnter={() => setHover(value)}
                    onClick={() => setRating(value)}
                    className="p-1 text-secondary transition-transform hover:scale-110"
                  >
                    <Icon name="star" fill={(hover || rating) >= value ? 1 : 0} className="text-[32px]" />
                  </button>
                ))}
              </div>
              <span className="font-body-md text-body-md text-muted">{ratingLabels[hover || rating]}</span>
            </div>
          </fieldset>

          <div>
            <label htmlFor="review-title" className={labelClass}>Title</label>
            <input
              id="review-title"
              required
              maxLength={TITLE_MAX}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Sum it up in a few words"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="review-body" className={labelClass}>Your review</label>
            <textarea
              id="review-body"
              required
              rows={6}
              maxLength={BODY_MAX}
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="What did you like or dislike? How are you using it?"
              className={cn(inputClass, "resize-y")}
            />
            <p className="mt-xs text-right font-label-sm text-label-sm text-muted">
              {body.length}/{BODY_MAX}
            </p>
          </div>

          <label className="flex cursor-pointer items-center gap-md">
            <input
              type="checkbox"
              checked={recommend}
              onChange={(event) => setRecommend(event.target.checked)}
              className="h-4 w-4 accent-secondary"
            />
            <span className="font-body-md text-body-md text-ivory">I would recommend this product</span>
          </label>

          <div className="flex flex-wrap items-center gap-md border-t border-ivory/10 pt-lg">
            <button type="submit" disabled={phase === "sending"} className={primaryButtonClass}>
              {phase === "sending" ? "Submitting…" : "Submit review"}
            </button>
            <p className="font-body-md text-body-md text-muted">Reviews from verified buyers are marked as such.</p>
          </div>
        </form>
      )}
    </div>
  );
}
