"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import { isApiError } from "@/lib/api/client";
import {
  authErrorMessage,
  EMAIL_MAX_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  register,
} from "@/lib/auth/session";
import { cn } from "@/lib/utils/cn";

/** Local-part@domain.tld; auth-service performs the authoritative check. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_LENGTH_MESSAGE = `Password must be ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters.`;

export type RegisterDemoState =
  | "error-validation"
  | "error-registered"
  | "loading"
  | "success";

const panelImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC1MkD1w7Qi8pRaMgtOHRebOaYiTDWu8vIDPZbvEA_vHZqhAUqiuzwNhnDoybUkfuxriB1MsGiLiCqwv4EhVRz7wDJan9EAzv-bYjA9TbI9gl1H-JGyUjNrM8UgAfgFr_D12Yoe0drHNul4xH1QF7lU2SERSuZIL_K2zKBFT1Jq_9czSq-R_7NX5oYwf0-SHq6_JuRqj61mOWt5pyrFPwqAquAjqJIoYBJLDQWamvn3BnxfWu32dHr9xw";

type RegisterPhase =
  | "idle"
  | "error-validation"
  | "error-registered"
  | "loading"
  | "success";

function fieldBox(hasError: boolean) {
  return cn(
    "flex flex-col bg-surface px-md pb-xs pt-sm border-b",
    hasError ? "border-b-error" : "border-b-ivory/30",
  );
}

function fieldInput(hasError: boolean) {
  return cn(
    "h-10 w-full border-none bg-transparent p-0 font-body-lg text-body-lg outline-none focus:ring-0 disabled:opacity-60 placeholder:text-outline-variant",
    hasError ? "text-error" : "text-on-surface",
  );
}

function fieldLabel(hasError: boolean) {
  return cn(
    "mb-xs font-label-md text-label-md uppercase",
    hasError ? "text-error" : "text-on-surface-variant",
  );
}

function SuccessCard() {
  return (
    <div className="flex flex-col items-center rounded-xl border border-muted/20 bg-ink p-xxl text-center shadow-[0px_32px_32px_rgba(11,14,18,0.15)]">
      <div className="mb-lg flex h-16 w-16 items-center justify-center rounded-full bg-champagne/10">
        <Icon name="check_circle" className="text-[40px] text-champagne" />
      </div>
      <h2 className="mb-md font-headline-lg-mobile text-headline-lg-mobile text-on-surface">
        Account created
      </h2>
      <p className="mb-xl font-body-md text-body-md text-on-surface-variant">
        Welcome to Atlas. Your premium shopping experience awaits.
      </p>
      <Link
        href="/"
        className="w-full rounded bg-champagne px-lg py-md text-center font-title-lg text-title-lg text-obsidian transition-all duration-200 hover:bg-champagne/90 active:scale-[0.98]"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

/**
 * Standalone registration screen (no store chrome). Desktop uses the branded
 * editorial split; on mobile the brand logo shifts above the form. Demo states
 * (validation/email-taken/loading/success) are reachable via ?state=.
 */
export default function RegisterView({
  demoState,
}: {
  demoState: RegisterDemoState | undefined;
}) {
  const [phase, setPhase] = useState<RegisterPhase>(demoState ?? "idle");
  const [email, setEmail] = useState(
    demoState === "error-validation"
      ? "invalid-email-format"
      : demoState === "error-registered"
        ? "existing.user@example.com"
        : demoState === "loading"
          ? "new.user@example.com"
          : "",
  );
  const [password, setPassword] = useState(
    demoState === "error-validation" || demoState === "loading"
      ? "securePass123"
      : "",
  );
  const [confirmPassword, setConfirmPassword] = useState(
    demoState === "error-validation"
      ? "differentPass456"
      : demoState === "loading"
        ? "securePass123"
        : "",
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [emailError, setEmailError] = useState(
    demoState === "error-validation",
  );
  const [pwdMessage, setPwdMessage] = useState<string | null>(
    demoState === "error-validation" ? "Passwords do not match." : null,
  );
  const pwdError = pwdMessage !== null;
  const [registeredError, setRegisteredError] = useState(
    demoState === "error-registered",
  );
  const [formMessage, setFormMessage] = useState<string | null>(null);

  // The demo "email taken" preview locks the form; a real 409 only asks for another email.
  const isDisabled = phase === "loading" || demoState === "error-registered";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phase === "loading" || phase === "success") return;

    const trimmedEmail = email.trim();
    const badEmail = !EMAIL_PATTERN.test(trimmedEmail);
    const badLength =
      password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH;
    const badMatch = password !== confirmPassword;
    setEmailError(badEmail);
    setPwdMessage(
      badLength ? PASSWORD_LENGTH_MESSAGE : badMatch ? "Passwords do not match." : null,
    );
    setRegisteredError(false);
    setFormMessage(null);
    if (badEmail || badLength || badMatch) return;

    setPhase("loading");
    try {
      await register(trimmedEmail, password);
      setPhase("success");
    } catch (error) {
      setPhase("idle");
      if (isApiError(error) && error.status === 409) {
        setRegisteredError(true);
      } else if (isApiError(error) && error.status === 400) {
        setFormMessage(
          error.errors?.length
            ? "Please check your email and password and try again."
            : error.detail ?? "Please check your email and password and try again.",
        );
      } else {
        setFormMessage(
          authErrorMessage(error, "We couldn't create your account. Please try again."),
        );
      }
    }
  };

  return (
    <main className="flex w-full min-h-dvh flex-col bg-background md:flex-row">
      <section className="relative hidden min-h-dvh flex-col justify-between overflow-hidden bg-surface p-margin-desktop md:flex md:w-1/2 lg:w-[45%]">
        <div aria-hidden="true" className="absolute inset-0">
          <Image
            src={panelImage}
            alt=""
            fill
            sizes="45vw"
            priority
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest via-surface/80 to-transparent" />
        </div>

        <Link
          href="/"
          className="relative z-10 inline-block transition-opacity hover:opacity-80"
        >
          <span className="block font-display-md text-display-md tracking-tighter text-on-surface">
            Atlas
          </span>
        </Link>

        <div className="relative z-10 mb-margin-desktop mt-auto w-full max-w-md">
          <h1 className="mb-lg font-display-lg text-display-lg text-on-surface">
            Start your
            <br />
            shopping journey
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Create an account to save products, manage orders, and enjoy a
            faster checkout.
          </p>
        </div>
      </section>

      <section className="relative flex w-full flex-col items-center justify-center bg-background p-margin-mobile md:w-1/2 md:p-margin-desktop lg:w-[55%]">
        <div className="mb-xxl w-full max-w-md text-left md:hidden">
          <Link href="/" className="inline-block">
            <span className="font-display-md text-display-md tracking-tighter text-on-surface">
              Atlas
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          {phase === "success" ? (
            <SuccessCard />
          ) : (
            <>
              <div className="mb-xl">
                <h2 className="mb-sm font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
                  Create your account
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Join us and start shopping.
                </p>
              </div>

              {registeredError ? (
                <div className="mb-lg flex items-start gap-md rounded-lg border border-error/20 bg-error-container/10 p-md">
                  <Icon name="error" className="mt-xs text-[20px] text-error" />
                  <div>
                    <p className="font-body-md text-body-md text-error">
                      This email is already registered.
                    </p>
                    <Link
                      href="/login"
                      className="mt-xs inline-block font-label-sm text-label-sm uppercase tracking-wider text-secondary underline transition-colors hover:text-secondary/80"
                    >
                      Sign in instead
                    </Link>
                  </div>
                </div>
              ) : null}

              {formMessage ? (
                <div className="mb-lg flex items-start gap-md rounded-lg border border-error/20 bg-error-container/10 p-md">
                  <Icon name="error" className="mt-xs text-[20px] text-error" />
                  <p role="alert" className="font-body-md text-body-md text-error">
                    {formMessage}
                  </p>
                </div>
              ) : null}

              <form
                onSubmit={handleSubmit}
                className={cn(
                  "flex flex-col space-y-lg",
                  phase === "loading" && "pointer-events-none opacity-70",
                )}
              >
                <div className={fieldBox(emailError)}>
                  <label
                    htmlFor="register-email"
                    className={fieldLabel(emailError)}
                  >
                    Email
                  </label>
                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={EMAIL_MAX_LENGTH}
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                      if (registeredError && demoState !== "error-registered") {
                        setRegisteredError(false);
                      }
                    }}
                    disabled={isDisabled}
                    placeholder="Enter your email"
                    className={fieldInput(emailError)}
                  />
                </div>
                {emailError ? (
                  <p className="-mt-md px-md font-label-sm text-label-sm text-error">
                    Please enter a valid email address.
                  </p>
                ) : null}

                <div className={fieldBox(pwdError)}>
                  <label
                    htmlFor="register-password"
                    className={fieldLabel(pwdError)}
                  >
                    Password
                  </label>
                  <div className="relative flex w-full items-center">
                    <input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={PASSWORD_MIN_LENGTH}
                      maxLength={PASSWORD_MAX_LENGTH}
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      disabled={isDisabled}
                      placeholder="Create a password"
                      className={cn(fieldInput(pwdError), "pr-10")}
                    />
                    <button
                      type="button"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      onClick={() => setShowPassword((visible) => !visible)}
                      className="absolute bottom-xs right-md flex h-10 items-center justify-center text-outline-variant transition-colors hover:text-on-surface disabled:opacity-60"
                    >
                      <Icon
                        name={showPassword ? "visibility_off" : "visibility"}
                        className="text-[20px]"
                      />
                    </button>
                  </div>
                </div>

                <div className={fieldBox(pwdError)}>
                  <label
                    htmlFor="register-confirm"
                    className={fieldLabel(pwdError)}
                  >
                    Confirm Password
                  </label>
                  <div className="relative flex w-full items-center">
                    <input
                      id="register-confirm"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      minLength={PASSWORD_MIN_LENGTH}
                      maxLength={PASSWORD_MAX_LENGTH}
                      required
                      value={confirmPassword}
                      onChange={(event) => setConfirmPassword(event.target.value)}
                      disabled={isDisabled}
                      placeholder="Confirm your password"
                      className={cn(fieldInput(pwdError), "pr-10")}
                    />
                    <button
                      type="button"
                      aria-label={showConfirm ? "Hide password" : "Show password"}
                      onClick={() => setShowConfirm((visible) => !visible)}
                      className="absolute bottom-xs right-md flex h-10 items-center justify-center text-outline-variant transition-colors hover:text-on-surface disabled:opacity-60"
                    >
                      <Icon
                        name={showConfirm ? "visibility_off" : "visibility"}
                        className="text-[20px]"
                      />
                    </button>
                  </div>
                </div>
                {pwdError ? (
                  <p className="-mt-md px-md font-label-sm text-label-sm text-error">
                    {pwdMessage}
                  </p>
                ) : null}

                <div className="mt-sm pt-md">
                  <button
                    type="submit"
                    disabled={isDisabled}
                    className={cn(
                      "flex w-full items-center justify-center rounded-lg bg-secondary px-lg py-md font-title-lg text-title-lg text-obsidian shadow-[0_4px_14px_0_rgba(201,168,106,0.15)] transition-colors duration-300 hover:bg-secondary/90",
                      isDisabled && "cursor-not-allowed opacity-80",
                    )}
                  >
                    {phase === "loading" ? (
                      <>
                        <span className="mr-sm inline-block h-4 w-4 animate-spin rounded-full border-2 border-obsidian/30 border-t-obsidian" />
                        Creating account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </form>

              <p className="mt-xl text-center font-body-md text-body-md text-on-surface-variant">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="ml-xs font-semibold text-secondary transition-colors hover:text-secondary/80"
                >
                  Sign In
                </Link>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  );
}