/**
 * Form styling shared by the account, seller and admin screens. Mirrors the
 * underlined inputs already used on the addresses and checkout forms.
 */
export const inputClass =
  "w-full border-0 border-b border-ivory/30 bg-transparent pb-sm font-body-md text-body-md text-ivory placeholder:text-muted/60 transition-colors focus:border-secondary focus:outline-none disabled:opacity-50";

export const labelClass =
  "mb-sm block font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant";

export const cardClass =
  "relative overflow-hidden rounded-lg border border-ivory/10 bg-ink p-lg shadow-[0_4px_32px_rgba(11,13,15,0.15)]";

export const primaryButtonClass =
  "inline-flex items-center justify-center gap-xs rounded bg-secondary px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-obsidian transition-colors hover:bg-secondary/90 disabled:cursor-not-allowed disabled:opacity-60";

export const secondaryButtonClass =
  "inline-flex items-center justify-center gap-xs rounded border border-muted/40 px-lg py-sm font-label-md text-label-md font-semibold uppercase tracking-wider text-ivory transition-colors hover:border-ivory disabled:opacity-50";

export const chipClass =
  "inline-flex items-center rounded border px-sm py-xs font-label-sm text-label-sm uppercase tracking-wider";
