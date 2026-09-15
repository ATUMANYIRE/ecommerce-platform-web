"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import AuthShell, { authButtonClass, authInputClass, authLabelClass } from "@/components/auth/AuthShell";
import Icon from "@/components/ui/Icon";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

function strength(password: string): { label: string; score: number } {
  let score = 0;
  if (password.length >= PASSWORD_MIN_LENGTH) score++;
  if (password.length >= 16) score++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
  if (/\d/.test(password) || /[^A-Za-z0-9]/.test(password)) score++;
  return { score, label: ["Too short", "Weak", "Fair", "Good", "Strong"][score] };
}

/** Demo reset step reached from the forgot-password link. */
export default function ResetPasswordView({ hasToken }: { hasToken: boolean }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "saving" | "done">("idle");
  const meter = strength(password);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
      setError(`Password must be ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setPhase("saving");
    await new Promise((resolve) => setTimeout(resolve, 1100));
    setPhase("done");
  }

  return (
    <AuthShell
      heading="A fresh start."
      copy="Choose a strong password you don't use anywhere else."
    >
      {!hasToken ? (
        <div className="text-center md:text-left">
          <Icon name="lock_reset" className="mb-md text-[40px] text-error" />
          <h2 className="mb-sm font-headline-lg text-headline-lg text-on-surface">
            Link expired
          </h2>
          <p className="mb-xl font-body-md text-body-md text-on-surface-variant">
            This reset link is invalid or has expired. Request a new one to continue.
          </p>
          <Link href="/forgot-password" className={authButtonClass}>
            Request a new link
          </Link>
        </div>
      ) : phase === "done" ? (
        <div className="text-center md:text-left">
          <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-full bg-champagne/10">
            <Icon name="check_circle" className="text-[36px] text-champagne" />
          </div>
          <h2 className="mb-sm font-headline-lg text-headline-lg text-on-surface">
            Password updated
          </h2>
          <p className="mb-xl font-body-md text-body-md text-on-surface-variant">
            You can now sign in with your new password. (Demo store: nothing was changed.)
          </p>
          <Link href="/login" className={authButtonClass}>
            Continue to sign in
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-xl text-center md:text-left">
            <h2 className="mb-xs font-headline-lg text-headline-lg text-on-surface">
              Set a new password
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              At least {PASSWORD_MIN_LENGTH} characters.
            </p>
          </div>
          {error ? (
            <div className="mb-lg flex items-center gap-sm rounded border border-error/20 bg-error-container/10 p-md">
              <Icon name="error" className="text-[18px] text-error" />
              <p role="alert" className="font-body-md text-body-md text-error">{error}</p>
            </div>
          ) : null}
          <form onSubmit={handleSubmit} className="space-y-lg">
            <div className="space-y-xs">
              <label htmlFor="reset-password" className={authLabelClass}>New password</label>
              <div className="relative flex items-center">
                <input
                  id="reset-password"
                  type={show ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  maxLength={PASSWORD_MAX_LENGTH}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a password"
                  className={cn(authInputClass, "pr-10")}
                />
                <button
                  type="button"
                  aria-label={show ? "Hide password" : "Show password"}
                  onClick={() => setShow((visible) => !visible)}
                  className="absolute bottom-sm right-0 text-on-surface-variant transition-colors hover:text-on-surface"
                >
                  <Icon name={show ? "visibility_off" : "visibility"} className="text-[20px]" />
                </button>
              </div>
              <div className="flex items-center gap-sm pt-xs" aria-live="polite">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        meter.score >= step ? "bg-secondary" : "bg-surface-container-highest",
                      )}
                    />
                  ))}
                </div>
                <span className="w-16 text-right font-label-sm text-label-sm text-muted">
                  {password ? meter.label : ""}
                </span>
              </div>
            </div>
            <div className="space-y-xs">
              <label htmlFor="reset-confirm" className={authLabelClass}>Confirm password</label>
              <input
                id="reset-confirm"
                type={show ? "text" : "password"}
                autoComplete="new-password"
                required
                maxLength={PASSWORD_MAX_LENGTH}
                value={confirm}
                onChange={(event) => setConfirm(event.target.value)}
                placeholder="Repeat the password"
                className={authInputClass}
              />
            </div>
            <div className="pt-md">
              <button type="submit" disabled={phase === "saving"} className={authButtonClass}>
                {phase === "saving" ? (
                  <>
                    Updating
                    <Icon name="progress_activity" className="animate-spin text-[18px]" />
                  </>
                ) : (
                  "Update password"
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </AuthShell>
  );
}
