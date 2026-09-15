"use client";

import { useState } from "react";
import type { FormEvent } from "react";

/** Footer newsletter sign-up. Demo only: confirms locally and sends nothing. */
export default function NewsletterForm() {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  if (subscribed) {
    return (
      <p role="status" className="font-body-md text-body-md text-secondary">
        You&apos;re on the list. Watch your inbox for new arrivals.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        required
        maxLength={254}
        placeholder="Enter your email"
        className="rounded border border-white/10 bg-surface-container px-3 py-2 text-sm text-on-surface transition-colors placeholder:text-on-surface-variant focus:border-white focus:outline-none"
      />
      <button
        type="submit"
        className="rounded bg-surface-container-highest py-2 text-sm text-on-surface transition-colors hover:bg-surface-variant"
      >
        Subscribe
      </button>
    </form>
  );
}
