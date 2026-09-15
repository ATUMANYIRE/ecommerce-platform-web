"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import AuthShell, { authButtonClass } from "@/components/auth/AuthShell";
import Icon from "@/components/ui/Icon";

/**
 * Demo e-mail verification. With a token it simulates confirming the address;
 * without one it shows the "check your inbox" step with a resend cooldown.
 */
export default function VerifyEmailView({ hasToken }: { hasToken: boolean }) {
  const [verified, setVerified] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (!hasToken) return;
    const timer = setTimeout(() => setVerified(true), 1400);
    return () => clearTimeout(timer);
  }, [hasToken]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  return (
    <AuthShell
      heading="One last step."
      copy="Confirming your e-mail keeps your account secure and makes sure order updates reach you."
    >
      <div className="text-center md:text-left">
        {hasToken ? (
          verified ? (
            <>
              <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-full bg-champagne/10">
                <Icon name="check_circle" className="text-[36px] text-champagne" />
              </div>
              <h2 className="mb-sm font-headline-lg text-headline-lg text-on-surface">
                E-mail verified
              </h2>
              <p className="mb-xl font-body-md text-body-md text-on-surface-variant">
                Thanks for confirming. Your account is fully active.
              </p>
              <Link href="/account" className={authButtonClass}>
                Go to my account
              </Link>
            </>
          ) : (
            <>
              <Icon name="progress_activity" className="mb-lg animate-spin text-[40px] text-secondary" />
              <h2 className="mb-sm font-headline-lg text-headline-lg text-on-surface">
                Verifying…
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Hold on while we confirm your e-mail address.
              </p>
            </>
          )
        ) : (
          <>
            <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-highest">
              <Icon name="mail" className="text-[36px] text-secondary" />
            </div>
            <h2 className="mb-sm font-headline-lg text-headline-lg text-on-surface">
              Verify your e-mail
            </h2>
            <p className="mb-lg font-body-md text-body-md text-on-surface-variant">
              We sent a confirmation link to your inbox. Open it to activate your account.
            </p>
            <p className="mb-xl rounded border border-outline-variant/30 bg-surface-container-low p-md font-body-md text-body-md text-on-surface-variant">
              Demo store: no e-mail is sent.{" "}
              <Link href="/verify-email?token=demo" className="text-secondary underline underline-offset-4">
                Open the confirmation link
              </Link>
            </p>
            <button
              type="button"
              disabled={cooldown > 0}
              onClick={() => setCooldown(30)}
              className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-50"
            >
              {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend e-mail"}
            </button>
          </>
        )}
      </div>
    </AuthShell>
  );
}
