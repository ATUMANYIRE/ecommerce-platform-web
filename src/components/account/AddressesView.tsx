"use client";

import Link from "next/link";
import { useState } from "react";
import type { FormEvent } from "react";
import Icon from "@/components/ui/Icon";
import AccountSidebar from "@/components/account/AccountSidebar";
import { useAddresses } from "@/context/AddressContext";
import type { ShippingAddress } from "@/context/AddressContext";
import { cn } from "@/lib/utils/cn";

export type AddressesDemoState =
  | "empty"
  | "error"
  | "auth"
  | "loading"
  | "add";

const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
];

const inputClass =
  "w-full border-b border-ivory/30 bg-transparent pb-sm font-body-md text-body-md text-ivory placeholder:text-muted/60 transition-colors focus:border-secondary focus:outline-none disabled:opacity-50";

function Field({
  label,
  htmlFor,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("group", className)}>
      <label
        htmlFor={htmlFor}
        className="mb-sm block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant transition-colors group-focus-within:text-secondary"
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function AddressCard({
  address,
  isDefault,
  onUse,
  onEdit,
  onDelete,
}: {
  address: ShippingAddress;
  isDefault: boolean;
  onUse: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article
      className={cn(
        "relative flex flex-col overflow-hidden rounded-lg border bg-ink p-lg shadow-[0_4px_32px_rgba(11,13,15,0.15)]",
        isDefault ? "border-secondary/30" : "border-ivory/10",
      )}
    >
      {isDefault ? (
        <span className="absolute right-lg top-lg inline-flex items-center rounded bg-secondary/10 px-sm py-xs font-label-sm text-label-sm font-semibold tracking-wider text-secondary">
          Default
        </span>
      ) : null}

      <div className="mb-sm flex items-center gap-xs pr-16">
        <h3 className="flex items-center gap-xs font-title-lg text-title-lg text-ivory">
          {address.label ?? "Address"}
          {isDefault ? (
            <Icon name="star" className="text-[18px] text-secondary" />
          ) : null}
        </h3>
      </div>

      <div className="mb-xl flex flex-col gap-xs font-body-md text-body-md leading-relaxed text-muted">
        <p className="font-medium text-ivory">{address.name}</p>
        <p>{address.line1}</p>
        {address.line2 ? <p>{address.line2}</p> : null}
        <p>
          {address.city}, {address.postalCode}
        </p>
        <p>{address.country}</p>
        {address.phone ? (
          <p className="mt-sm flex items-center gap-xs text-secondary">
            <Icon name="call" className="text-[16px]" />
            {address.phone}
          </p>
        ) : null}
      </div>

      <div className="mt-auto border-t border-ivory/10 pt-md">
        {isDefault ? (
          <div className="flex items-center justify-between gap-md">
            <span className="flex items-center gap-xs font-label-md text-label-md text-secondary">
              <Icon name="check_circle" className="text-[18px]" />
              Selected for Checkout
            </span>
            <div className="flex items-center gap-md">
              <button
                type="button"
                title="Edit address"
                onClick={onEdit}
                className="flex items-center gap-xs font-label-md text-label-md text-muted transition-colors hover:text-ivory"
              >
                <Icon name="edit" className="text-[18px]" />
                Edit
              </button>
              <button
                type="button"
                title="Remove address"
                onClick={onDelete}
                className="flex items-center gap-xs font-label-md text-label-md text-muted transition-colors hover:text-error"
              >
                <Icon name="delete" className="text-[18px]" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onUse}
              className="flex w-full items-center justify-center rounded border border-secondary/40 px-md py-sm font-label-md text-label-md text-secondary transition-colors hover:bg-secondary/10"
            >
              Use for Checkout
            </button>
            <div className="mt-md flex items-center justify-between">
              <button
                type="button"
                title="Edit address"
                onClick={onEdit}
                className="flex items-center gap-xs font-label-md text-label-md text-muted transition-colors hover:text-ivory"
              >
                <Icon name="edit" className="text-[18px]" />
                Edit
              </button>
              <button
                type="button"
                title="Remove address"
                onClick={onDelete}
                className="flex items-center gap-xs font-label-md text-label-md text-muted transition-colors hover:text-error"
              >
                <Icon name="delete" className="text-[18px]" />
                Remove
              </button>
            </div>
          </>
        )}
      </div>
    </article>
  );
}

function SkeletonGrid() {
  return (
    <>
      <div className="mb-xl flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-xs h-8 w-56 rounded shimmer" />
          <div className="h-4 w-80 max-w-full rounded shimmer" />
        </div>
        <div className="h-10 w-40 rounded shimmer" />
      </div>
      <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className="flex h-56 flex-col gap-md rounded-lg border border-muted/20 bg-ink p-lg"
          >
            <div className="h-5 w-32 rounded shimmer" />
            <div className="h-4 w-full rounded shimmer" />
            <div className="h-4 w-3/4 rounded shimmer" />
            <div className="h-4 w-1/2 rounded shimmer" />
            <div className="mt-auto h-8 w-32 rounded shimmer" />
          </div>
        ))}
      </div>
    </>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-dashed border-ivory/20 bg-ink px-lg py-xxl text-center">
      <div className="mb-lg inline-flex rounded-full bg-surface-container-highest p-md">
        <Icon name="location_off" className="text-[32px] text-secondary" />
      </div>
      <h2 className="mb-xs font-title-lg text-title-lg text-ivory">
        No saved addresses
      </h2>
      <p className="mb-xl max-w-sm font-body-md text-body-md text-muted">
        Add an address to speed up checkout — you can always edit or remove it
        later.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-xs rounded bg-secondary px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary/90"
      >
        <Icon name="add" className="text-[16px]" />
        Add Address
      </button>
    </div>
  );
}

function ErrorState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-error/20 bg-ink px-lg py-xxl text-center">
      <div className="mb-lg inline-flex rounded-full bg-error/10 p-md">
        <Icon name="warning" className="text-[32px] text-error" />
      </div>
      <h2 className="mb-xs font-title-lg text-title-lg text-ivory">
        We couldn&apos;t load your addresses
      </h2>
      <p className="mb-xl max-w-sm font-body-md text-body-md text-muted">
        There was a problem connecting to our servers. Please try again in a
        moment.
      </p>
      <div className="flex flex-wrap justify-center gap-sm">
        <Link
          href="/account/addresses"
          className="inline-flex items-center rounded bg-secondary px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary/90"
        >
          Try Again
        </Link>
        <Link
          href="/account"
          className="inline-flex items-center rounded border border-muted/40 px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-ivory transition-colors hover:border-ivory"
        >
          Return to Account
        </Link>
      </div>
    </div>
  );
}

function AuthState() {
  return (
    <div className="flex min-h-80 flex-col items-center justify-center rounded-lg border border-muted/20 bg-ink px-lg py-xxl text-center">
      <div className="mb-lg inline-flex rounded-full bg-surface-container-highest p-md">
        <Icon name="lock" className="text-[32px] text-secondary" />
      </div>
      <h2 className="mb-xs font-title-lg text-title-lg text-ivory">
        Sign in to manage your addresses
      </h2>
      <p className="mb-xl max-w-sm font-body-md text-body-md text-muted">
        Create an account or sign in to save, edit, and remove shipping
        addresses across every device.
      </p>
      <div className="flex flex-wrap justify-center gap-sm">
        <Link
          href="/login"
          className="inline-flex items-center rounded bg-secondary px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary/90"
        >
          Sign In
        </Link>
        <Link
          href="/register"
          className="inline-flex items-center rounded border border-muted/40 px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-ivory transition-colors hover:border-ivory"
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}

function AddAddressModal({
  onClose,
  editing,
}: {
  onClose: () => void;
  /** When set, the modal edits this address instead of adding a new one. */
  editing?: ShippingAddress;
}) {
  const { addAddress, updateAddress, selectAddress, selectedAddress } = useAddresses();
  const [name, setName] = useState(editing?.name ?? "");
  const [phone, setPhone] = useState(editing?.phone ?? "");
  const [line1, setLine1] = useState(editing?.line1 ?? "");
  const [city, setCity] = useState(editing?.city ?? "");
  const [postalCode, setPostalCode] = useState(editing?.postalCode ?? "");
  const [country, setCountry] = useState(
    editing && countries.includes(editing.country) ? editing.country : countries[0],
  );
  const [setAsDefault, setSetAsDefault] = useState(
    editing ? selectedAddress?.id === editing.id : false,
  );
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    const previousDefaultId = selectedAddress?.id ?? null;
    const input = {
      name: name.trim(),
      phone: phone.trim(),
      line1: line1.trim(),
      line2: editing?.line2,
      label: editing?.label,
      city: city.trim(),
      postalCode: postalCode.trim(),
      country,
    };
    if (editing) {
      updateAddress(editing.id, input);
      if (setAsDefault) selectAddress(editing.id);
    } else {
      addAddress(input);
      if (!setAsDefault && previousDefaultId) {
        selectAddress(previousDefaultId);
      }
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-gutter md:items-center">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={saving ? undefined : onClose}
        aria-hidden="true"
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-10 my-auto w-full max-w-2xl overflow-hidden rounded-lg border border-outline-variant/20 bg-ink shadow-[0_32px_64px_rgba(0,0,0,0.5)]"
      >
        <header className="flex items-center justify-between border-b border-ivory/10 bg-surface px-lg py-md">
          <h2 className="flex items-center gap-md font-title-lg text-title-lg text-on-surface">
            <Icon name="location_on" className="text-secondary" />
            {editing ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            disabled={saving}
            className="text-on-surface-variant transition-colors hover:text-on-surface disabled:opacity-50"
          >
            <Icon name="close" />
          </button>
        </header>

        <div className="space-y-xl p-lg md:p-xl">
          <div className="grid grid-cols-1 gap-lg md:grid-cols-2">
            <Field label="Full Name" htmlFor="addr-name">
              <input
                id="addr-name"
                autoFocus
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                disabled={saving}
                placeholder="Elliot Alderson"
                className={inputClass}
              />
            </Field>
            <Field label="Phone Number" htmlFor="addr-phone">
              <input
                id="addr-phone"
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                disabled={saving}
                placeholder="+1 (555) 000-0000"
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Street Address" htmlFor="addr-line1">
            <input
              id="addr-line1"
              required
              value={line1}
              onChange={(event) => setLine1(event.target.value)}
              disabled={saving}
              placeholder="123 Main Street, Apt 4"
              className={inputClass}
            />
          </Field>

          <div className="grid grid-cols-1 gap-lg md:grid-cols-3">
            <Field label="City" htmlFor="addr-city">
              <input
                id="addr-city"
                required
                value={city}
                onChange={(event) => setCity(event.target.value)}
                disabled={saving}
                placeholder="San Francisco"
                className={inputClass}
              />
            </Field>
            <Field label="Postal Code" htmlFor="addr-postal">
              <input
                id="addr-postal"
                required
                value={postalCode}
                onChange={(event) => setPostalCode(event.target.value)}
                disabled={saving}
                placeholder="94105"
                className={inputClass}
              />
            </Field>
            <Field label="Country" htmlFor="addr-country">
              <div className="relative">
                <select
                  id="addr-country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  disabled={saving}
                  className={cn(inputClass, "cursor-pointer appearance-none pr-lg")}
                >
                  {countries.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <Icon
                  name="expand_more"
                  className="pointer-events-none absolute bottom-sm right-0 text-ivory/60"
                />
              </div>
            </Field>
          </div>

          <label className="flex cursor-pointer items-center gap-md">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={setAsDefault}
              onChange={(event) => setSetAsDefault(event.target.checked)}
              disabled={saving}
            />
            <span className="relative h-5 w-10 shrink-0 rounded-full bg-surface-container-high transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-ivory after:transition-transform peer-checked:bg-secondary peer-checked:after:translate-x-5" />
            <span className="font-body-md text-body-md text-ivory">
              Set as default shipping address
            </span>
          </label>
        </div>

        <footer className="flex flex-col-reverse items-stretch justify-end gap-sm border-t border-ivory/10 bg-surface px-lg py-md sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded border border-muted/40 px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-ivory transition-colors hover:border-ivory disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center gap-xs rounded bg-secondary px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? (
              <>
                <Icon name="sync" className="animate-spin text-[16px]" />
                Saving…
              </>
            ) : (
              "Save Address"
            )}
          </button>
        </footer>
      </form>
    </div>
  );
}

/**
 * Saved addresses page under the account hub. Renders the account sidebar with
 * the address grid, plus demo states (empty/error/auth/loading) reachable via
 * ?state= and the Add New Address modal overlay.
 */
export default function AddressesView({
  demoState,
}: {
  demoState: AddressesDemoState | undefined;
}) {
  const { addresses, selectedAddress, selectAddress, removeAddress } =
    useAddresses();
  const [modalOpen, setModalOpen] = useState(demoState === "add");
  const [editing, setEditing] = useState<ShippingAddress | null>(null);

  const isEmpty = demoState === "empty" || addresses.length === 0;

  const handleDelete = (id: string) => {
    const remaining = addresses.filter((address) => address.id !== id);
    removeAddress(id);
    if (selectedAddress?.id === id && remaining.length > 0) {
      selectAddress(remaining[0].id);
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-gutter px-margin-mobile py-xxl md:flex-row md:px-margin-desktop">
      <AccountSidebar active="addresses" />

      <div className="flex w-full min-w-0 flex-grow flex-col">
        {demoState === "loading" ? (
          <SkeletonGrid />
        ) : demoState === "auth" ? (
          <AuthState />
        ) : demoState === "error" ? (
          <ErrorState />
        ) : isEmpty ? (
          <EmptyState onAdd={() => setModalOpen(true)} />
        ) : (
          <>
            <header className="mb-xl flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
                  Saved Addresses
                </h1>
                <p className="font-body-md text-body-md text-muted">
                  Manage the addresses you use for delivery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex w-full items-center justify-center gap-xs self-start rounded bg-secondary px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary/90 sm:w-auto"
              >
                <Icon name="add" className="text-[16px]" />
                Add Address
              </button>
            </header>

            <div className="grid grid-cols-1 gap-md md:grid-cols-2 lg:grid-cols-3">
              {addresses.map((address) => (
                <AddressCard
                  key={address.id}
                  address={address}
                  isDefault={selectedAddress?.id === address.id}
                  onUse={() => selectAddress(address.id)}
                  onEdit={() => setEditing(address)}
                  onDelete={() => handleDelete(address.id)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {modalOpen ? (
        <AddAddressModal onClose={() => setModalOpen(false)} />
      ) : null}
      {editing ? (
        <AddAddressModal key={editing.id} editing={editing} onClose={() => setEditing(null)} />
      ) : null}
    </div>
  );
}