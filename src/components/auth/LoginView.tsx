"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import { AUTH_PANEL_IMAGE } from "@/components/auth/AuthShell";
import Icon from "@/components/ui/Icon";
import { isApiError } from "@/lib/api/client";
import { authErrorMessage, EMAIL_MAX_LENGTH, login, PASSWORD_MAX_LENGTH } from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

export type LoginDemoState = "error" | "loading" | "success";

const CREDENTIALS_ERROR = "Unable to sign in. Please check your credentials.";

// The previous hot-linked Google image URL returns 403, leaving the panel blank.
const marketingImage = AUTH_PANEL_IMAGE;

type AuthPhase = "idle" | "error" | "loading" | "success";

function underlineClass(hasError: boolean) {
  return cn(
    "w-full rounded-none border-0 border-b bg-ink px-0 pb-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-0 transition-colors disabled:opacity-60",
    hasError ? "border-b-error" : "border-b-ivory/30 focus:border-b-ivory",
  );
}

/**
 * Standalone sign-in screen (no store chrome). Full-viewport marketing split on
 * md+ and a centered form on mobile, mirroring the auth-onboarding design.
 * Demo states (error/loading/success) are reachable via ?state=.
 */
export default function LoginView({
  demoState,
  next = "/account",
}: {
  demoState: LoginDemoState | undefined;
  /** Same-site path to open after signing in. */
  next?: string;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<AuthPhase>(demoState ?? "idle");
  const [errorMessage, setErrorMessage] = useState(CREDENTIALS_ERROR);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase === "loading" || phase === "success") return;
    setPhase("loading");
    try {
      await login(email.trim(), password);
      setPhase("success");
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push(next);
    } catch (error) {
      // 401 covers wrong password and unknown account alike; auth-service does not say which.
      setErrorMessage(
        isApiError(error) && (error.status === 401 || error.status === 400)
          ? CREDENTIALS_ERROR
          : authErrorMessage(error, CREDENTIALS_ERROR),
      );
      setPhase("error");
    }
  };

  return (
    <main className="flex min-h-dvh w-full flex-col overflow-hidden bg-background md:flex-row">
      <aside className="relative hidden h-full min-h-dvh w-1/2 flex-col justify-between bg-surface-container-lowest p-margin-desktop md:flex">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={marketingImage}
            alt=""
            fill
            sizes="50vw"
            priority
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-lowest/50 to-transparent" />
        </div>

        <Link
          href="/"
          className="relative z-10 font-headline-lg text-headline-lg tracking-tighter text-on-surface"
        >
          Atlas
        </Link>

        <div className="relative z-10 mb-margin-desktop max-w-md">
          <h1 className="mb-lg font-display-md text-display-md text-on-surface">
            Everything you need, all in one place.
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Curated collections from independent designers and premier brands,
            exclusively for you.
          </p>
        </div>
      </aside>

      <section className="relative z-20 flex min-h-dvh w-full items-center justify-center overflow-y-auto bg-background p-margin-mobile md:w-1/2 md:p-margin-desktop">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-xl block text-center font-headline-lg text-headline-lg tracking-tighter text-on-surface md:hidden"
          >
            Atlas
          </Link>

          <div
            className={cn(
              "mb-xl text-center transition-opacity duration-300 md:text-left",
              phase === "loading" && "opacity-60",
            )}
          >
            <h2 className="mb-xs font-headline-lg text-headline-lg text-on-surface">
              Welcome back
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Sign in to continue shopping.
            </p>
          </div>

          {phase === "error" ? (
            <div className="mb-lg flex items-center gap-sm rounded border border-error/20 bg-error-container/10 p-md">
              <Icon name="error" className="text-[18px] text-error" />
              <p role="alert" className="font-body-md text-body-md text-error">
                {errorMessage}
              </p>
            </div>
          ) : null}

          <form
            onSubmit={handleSubmit}
            className={cn(
              "space-y-lg transition-opacity duration-300",
              phase === "loading" && "pointer-events-none opacity-70",
            )}
          >
            <div className="group space-y-xs">
              <label
                htmlFor="login-email"
                className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant transition-colors group-focus-within:text-on-surface"
              >
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                maxLength={EMAIL_MAX_LENGTH}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={phase === "loading"}
                placeholder="Enter your email"
                className={cn(underlineClass(phase === "error"), "pr-0")}
              />
            </div>

            <div className="group relative space-y-xs">
              <label
                htmlFor="login-password"
                className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant transition-colors group-focus-within:text-on-surface"
              >
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={PASSWORD_MAX_LENGTH}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={phase === "loading"}
                  placeholder="Enter your password"
                  className={cn(underlineClass(phase === "error"), "pr-10")}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute bottom-sm right-0 text-on-surface-variant transition-colors hover:text-on-surface focus:outline-none disabled:opacity-60"
                >
                  <Icon
                    name={showPassword ? "visibility_off" : "visibility"}
                    className="text-[20px]"
                  />
                </button>
              </div>
              <div className="flex justify-end pt-xs">
                <Link
                  href="/forgot-password"
                  className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant transition-colors hover:text-secondary"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div className="relative pt-md">
              <button
                type="submit"
                disabled={phase === "loading" || phase === "success"}
                className="flex h-[48px] w-full items-center justify-center rounded bg-secondary font-label-md text-label-md uppercase tracking-wider text-obsidian transition-all duration-300 hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {phase === "loading" ? (
                  <>
                    <span>Signing in...</span>
                    <Icon
                      name="progress_activity"
                      className="ml-sm animate-spin text-[18px]"
                    />
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>

              <div
                aria-hidden={phase !== "success"}
                className={cn(
                  "pointer-events-none absolute inset-0 flex items-center justify-center rounded border border-outline-variant/30 bg-surface-container-high font-label-md text-label-md uppercase tracking-wider text-on-surface transition-opacity duration-300",
                  phase === "success" ? "opacity-100" : "opacity-0",
                )}
              >
                <Icon
                  name="check_circle"
                  className="mr-sm text-[20px] text-secondary"
                />
                Authentication successful
              </div>
            </div>
          </form>

          <p className="mt-xl text-center font-body-md text-body-md text-on-surface-variant">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-on-surface underline decoration-1 underline-offset-4 transition-colors hover:text-secondary"
            >
              Create Account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
