export const ESTIMATED_TAX_RATE = 0.085;

export function estimateTax(amount: number): number {
  return Number((amount * ESTIMATED_TAX_RATE).toFixed(2));
}