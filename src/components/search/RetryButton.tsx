"use client";

import { useRouter } from "next/navigation";

export default function RetryButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => router.refresh()}
      className="rounded border border-on-surface px-6 py-3 font-label-md text-label-md uppercase tracking-wider text-on-surface transition-colors hover:bg-on-surface hover:text-background"
    >
      Retry
    </button>
  );
}
