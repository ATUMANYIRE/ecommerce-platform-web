import { cn } from "@/lib/utils/cn";

const tones: Record<string, string> = {
  Processing: "border-champagne/30 bg-champagne/10 text-champagne",
  Shipped: "border-sky-300/30 bg-sky-300/10 text-sky-200",
  Delivered: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
  Cancelled: "border-error/30 bg-error/10 text-error",
};

export default function OrderStatusChip({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded border px-sm py-xs font-label-sm text-label-sm uppercase tracking-wider",
        tones[status] ?? "border-muted/30 bg-muted/10 text-muted",
        className,
      )}
    >
      {status}
    </span>
  );
}
