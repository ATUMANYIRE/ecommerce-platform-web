import type { Money } from "@/types/product";

/**
 * Format an amount (decimal string like "49.99") with an ISO currency code.
 * Uses Intl.NumberFormat so the currency symbol matches the code.
 */
export function formatMoney(money: Pick<Money, "amount" | "currency">): string {
  const amount = Number(money.amount);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: money.currency,
    }).format(amount);
  } catch {
    return `${money.currency} ${money.amount}`;
  }
}

/**
 * Format a raw numeric amount with a currency code (search items use this shape).
 */
export function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}
