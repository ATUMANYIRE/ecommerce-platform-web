"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import AccountSidebar from "@/components/account/AccountSidebar";
import Icon from "@/components/ui/Icon";
import {
  cardClass,
  inputClass,
  labelClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "@/components/forms/styles";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, useSession } from "@/lib/auth/session";
import { profileStore, useProfile } from "@/lib/demo/profile";
import type { Profile } from "@/lib/demo/profile";
import { useHydrated } from "@/lib/utils/localStorageStore";
import { cn } from "@/lib/utils/cn";

const preferenceLabels: { key: keyof Profile["preferences"]; label: string; hint: string }[] = [
  { key: "orderUpdates", label: "Order updates", hint: "Shipping, delivery and return status." },
  { key: "newArrivals", label: "New arrivals", hint: "A weekly edit of new products." },
  { key: "priceDrops", label: "Price drops", hint: "When an item in your wishlist gets cheaper." },
  { key: "newsletter", label: "Newsletter", hint: "Stories from our designers and sellers." },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-5 w-10 shrink-0 rounded-full transition-colors",
        checked ? "bg-secondary" : "bg-surface-container-highest",
      )}
    >
      <span
        className={cn(
          "absolute left-[2px] top-[2px] h-4 w-4 rounded-full bg-ivory transition-transform",
          checked && "translate-x-5",
        )}
      />
    </button>
  );
}

function SavedNote({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <span role="status" className="inline-flex items-center gap-xs font-label-md text-label-md text-secondary">
      <Icon name="check_circle" className="text-[16px]" />
      {text}
    </span>
  );
}

function ProfileForm({ profile }: { profile: Profile }) {
  const session = useSession();
  const [fullName, setFullName] = useState(profile.fullName);
  const [phone, setPhone] = useState(profile.phone);
  const [birthday, setBirthday] = useState(profile.birthday);
  const [saved, setSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    profileStore.set((previous) => ({ ...previous, fullName: fullName.trim(), phone: phone.trim(), birthday }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  return (
    <section className={cardClass} aria-labelledby="profile-heading">
      <h2 id="profile-heading" className="mb-xs font-title-lg text-title-lg text-ivory">Personal details</h2>
      <p className="mb-lg font-body-md text-body-md text-muted">How we address you and reach you about orders.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
          <div>
            <label htmlFor="settings-name" className={labelClass}>Full name</label>
            <input id="settings-name" required maxLength={100} value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="settings-email" className={labelClass}>Email</label>
            <input
              id="settings-email"
              type="email"
              value={session?.email ?? "eleanor.vance@example.com"}
              readOnly
              aria-describedby="settings-email-hint"
              className={cn(inputClass, "cursor-not-allowed text-muted")}
            />
            <p id="settings-email-hint" className="mt-xs font-label-sm text-label-sm text-muted">
              Contact support to change your sign-in e-mail.
            </p>
          </div>
          <div>
            <label htmlFor="settings-phone" className={labelClass}>Phone</label>
            <input id="settings-phone" type="tel" maxLength={30} value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="settings-birthday" className={labelClass}>Birthday (optional)</label>
            <input id="settings-birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className={cn(inputClass, "[color-scheme:dark]")} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-md">
          <button type="submit" className={primaryButtonClass}>Save changes</button>
          <SavedNote show={saved} text="Details saved" />
        </div>
      </form>
    </section>
  );
}

function PasswordForm() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"idle" | "saving" | "saved">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (next.length < PASSWORD_MIN_LENGTH || next.length > PASSWORD_MAX_LENGTH) {
      setError(`New password must be ${PASSWORD_MIN_LENGTH}–${PASSWORD_MAX_LENGTH} characters.`);
      return;
    }
    if (next !== confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (next === current) {
      setError("Choose a password different from the current one.");
      return;
    }
    setError(null);
    setPhase("saving");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setCurrent("");
    setNext("");
    setConfirm("");
    setPhase("saved");
    setTimeout(() => setPhase("idle"), 3000);
  }

  return (
    <section className={cardClass} aria-labelledby="password-heading">
      <h2 id="password-heading" className="mb-xs font-title-lg text-title-lg text-ivory">Password</h2>
      <p className="mb-lg font-body-md text-body-md text-muted">
        Use at least {PASSWORD_MIN_LENGTH} characters. Changing it signs you out on other devices.
      </p>
      {error ? (
        <p role="alert" className="mb-lg flex items-center gap-sm rounded border border-error/20 bg-error-container/10 p-md font-body-md text-body-md text-error">
          <Icon name="error" className="text-[18px]" />
          {error}
        </p>
      ) : null}
      <form onSubmit={handleSubmit} className="flex flex-col gap-lg">
        <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
          <div>
            <label htmlFor="pw-current" className={labelClass}>Current password</label>
            <input id="pw-current" type="password" autoComplete="current-password" required maxLength={PASSWORD_MAX_LENGTH} value={current} onChange={(e) => setCurrent(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="pw-new" className={labelClass}>New password</label>
            <input id="pw-new" type="password" autoComplete="new-password" required maxLength={PASSWORD_MAX_LENGTH} value={next} onChange={(e) => setNext(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label htmlFor="pw-confirm" className={labelClass}>Confirm new password</label>
            <input id="pw-confirm" type="password" autoComplete="new-password" required maxLength={PASSWORD_MAX_LENGTH} value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-md">
          <button type="submit" disabled={phase === "saving"} className={primaryButtonClass}>
            {phase === "saving" ? "Updating…" : "Update password"}
          </button>
          <SavedNote show={phase === "saved"} text="Password updated (demo)" />
        </div>
      </form>
    </section>
  );
}

function PreferencesCard({ profile }: { profile: Profile }) {
  function setPreference(key: keyof Profile["preferences"], value: boolean) {
    profileStore.set((previous) => ({ ...previous, preferences: { ...previous.preferences, [key]: value } }));
  }

  return (
    <section className={cardClass} aria-labelledby="prefs-heading">
      <h2 id="prefs-heading" className="mb-xs font-title-lg text-title-lg text-ivory">Notifications</h2>
      <p className="mb-lg font-body-md text-body-md text-muted">Choose what we e-mail you about. Changes save instantly.</p>
      <ul className="divide-y divide-ivory/10">
        {preferenceLabels.map((item) => (
          <li key={item.key} className="flex items-center justify-between gap-md py-md first:pt-0 last:pb-0">
            <div>
              <p className="font-body-lg text-body-lg text-ivory">{item.label}</p>
              <p className="font-body-md text-body-md text-muted">{item.hint}</p>
            </div>
            <Toggle
              label={item.label}
              checked={profile.preferences[item.key]}
              onChange={(value) => setPreference(item.key, value)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}

function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [requested, setRequested] = useState(false);

  return (
    <section className={cn(cardClass, "border-error/20")} aria-labelledby="danger-heading">
      <h2 id="danger-heading" className="mb-xs font-title-lg text-title-lg text-ivory">Delete account</h2>
      <p className="mb-lg font-body-md text-body-md text-muted">
        Permanently removes your profile, addresses and wishlist. Order records are kept for accounting.
      </p>
      {requested ? (
        <p role="status" className="font-body-md text-body-md text-secondary">
          Deletion requested. In a live store we would e-mail you to confirm. (Demo: nothing was deleted.)
        </p>
      ) : confirming ? (
        <div className="flex flex-wrap items-center gap-md">
          <span className="font-body-md text-body-md text-error">Are you sure? This cannot be undone.</span>
          <button
            type="button"
            onClick={() => setRequested(true)}
            className="rounded border border-error/60 px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-error transition-colors hover:bg-error/10"
          >
            Yes, delete
          </button>
          <button type="button" onClick={() => setConfirming(false)} className={secondaryButtonClass}>
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded border border-error/40 px-lg py-sm font-label-md text-label-md uppercase tracking-wider text-error transition-colors hover:bg-error/10"
        >
          Delete my account
        </button>
      )}
    </section>
  );
}

/** Account settings: profile, password, e-mail preferences and account deletion (demo). */
export default function AccountSettingsView() {
  const profile = useProfile();
  const hydrated = useHydrated();

  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-gutter px-margin-mobile py-xxl md:flex-row md:px-margin-desktop">
      <AccountSidebar active="settings" />
      <div className="flex w-full min-w-0 flex-grow flex-col gap-xl">
        <header>
          <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
            Account Settings
          </h1>
          <p className="font-body-md text-body-md text-muted">
            Update your personal details, password and preferences.
          </p>
        </header>
        {/* Keyed on hydration so the form picks up details saved in this browser. */}
        <ProfileForm key={hydrated ? "stored" : "default"} profile={profile} />
        <PasswordForm />
        <PreferencesCard profile={profile} />
        <DangerZone />
      </div>
    </div>
  );
}
