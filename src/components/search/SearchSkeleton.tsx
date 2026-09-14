const CARD_WIDTHS = [
  "w-3/4",
  "w-5/6",
  "w-2/3",
  "w-4/5",
  "w-3/4",
  "w-2/3",
];

function SkeletonLine({ className }: { className?: string }) {
  return (
    <div
      className={`h-4 rounded-sm bg-surface-container-high ${className ?? ""}`}
    />
  );
}

export function SkeletonCard({ index = 0 }: { index?: number }) {
  return (
    <div className="flex flex-col gap-sm">
      <div className="aspect-square w-full rounded bg-surface-container-high" />
      <div className="space-y-sm pt-sm">
        <SkeletonLine className={CARD_WIDTHS[index % CARD_WIDTHS.length]} />
        <SkeletonLine className="h-4 w-1/4" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </div>
  );
}

export function SkeletonSidebar() {
  return (
    <div className="flex flex-col gap-lg">
      {["Categories", "Brand", "Price"].map((label) => (
        <div key={label} className="border-t border-outline-variant/30 pt-md">
          <div className="mb-md h-4 w-24 rounded-sm bg-surface-container-high" />
          <div className="flex flex-col gap-sm">
            <SkeletonLine className="w-3/4" />
            <SkeletonLine className="w-1/2" />
            <SkeletonLine className="w-2/3" />
            <SkeletonLine className="w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}
