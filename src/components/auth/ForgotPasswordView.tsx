"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import AuthShell, { authButtonClass, authInputClass, authLabelClass } from "@/components/auth/AuthShell";
import Icon from "@/components/ui/Icon";

/**
 * Demo password recovery. The platform has no reset endpoint yet, so the
 * screen confirms without sending anything and links to the reset step.
 */
export default function ForgotPasswordView() {
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<"idle" | "sending" | "sent">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPhase("sending");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setPhase("sent");
  }

  return (
    <AuthShell
      heading="Let's get you back in."
      copy="Enter the e-mail address on your account and we'll send you a link to choose a new password."
    >
      {phase === "sent" ? (
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-full bg-champagne/10">
            <Icon name="mark_email_read" className="text-[36px] text-champagne" />
          </div>
          <h2 className="mb-sm font-headline-lg text-headline-lg text-on-surface">
            Check your inbox
          </h2>
          <p className="mb-lg font-body-md text-body-md text-on-surface-variant">
            If an account exists for <span className="text-on-surface">{email}</span>,
            a reset link is on its way. The link expires in 30 minutes.
          </p>
          <p className="mb-xl rounded border border-outline-variant/30 bg-surface-container-low p-md font-body-md text-body-md text-on-surface-variant">
            Demo store: no e-mail is sent.{" "}
            <Link
              href="/reset-password?token=demo"
              className="text-secondary underline underline-offset-4"
            >
              Open the reset link
            </Link>
          </p>
          <button
            type="button"
            onClick={() => setPhase("idle")}
            className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-on-surface"
          >
            Use a different e-mail
          </button>
        </div>
      ) : (
        <>
          <div className="mb-xl text-center md:text-left">
            <h2 className="mb-xs font-headline-lg text-headline-lg text-on-surface">
              Forgot password?
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We&apos;ll e-mail you a reset link.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="space-y-xs">
              <label htmlFor="forgot-email" className={authLabelClass}>
                Email
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={phase === "sending"}
                placeholder="Enter your email"
                className={authInputClass}
              />
            </div>
            <div className="pt-md">
              <button type="submit" disabled={phase === "sending"} className={authButtonClass}>
                {phase === "sending" ? (
                  <>
                    Sending link
                    <Icon name="progress_activity" className="animate-spin text-[18px]" />
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </div>
          </form>
        </>
      )}
      <p className="mt-xl text-center font-body-md text-body-md text-on-surface-variant">
        Remembered it?{" "}
        <Link
          href="/login"
          className="text-on-surface underline decoration-1 underline-offset-4 transition-colors hover:text-secondary"
        >
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
