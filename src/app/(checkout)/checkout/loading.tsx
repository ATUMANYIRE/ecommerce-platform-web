export default function CheckoutLoading() {
  return (
    <div className="mx-auto w-full max-w-max-width flex-grow px-margin-mobile py-xxl md:px-margin-desktop">
      <div className="mb-xl flex flex-col justify-between gap-md border-b border-outline/10 pb-lg md:flex-row md:items-end">
        <div className="shimmer h-8 w-48 rounded-sm" />
        <div className="shimmer h-4 w-64 rounded-sm opacity-70" />
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-xl lg:col-span-8">
          <section className="flex flex-col gap-lg">
            <div className="shimmer h-6 w-40 rounded-sm" />
            <div className="flex flex-col gap-md rounded-lg border border-on-surface/10 bg-surface-container-low p-lg">
              <div className="grid grid-cols-1 gap-md md:grid-cols-2">
                <div className="shimmer h-28 rounded" />
                <div className="shimmer h-28 rounded" />
              </div>
              <div className="shimmer h-10 w-44 rounded" />
            </div>
          </section>

          <section className="flex flex-col gap-lg pt-lg">
            <div className="shimmer h-6 w-40 rounded-sm" />
            <div className="flex flex-col gap-md">
              <div className="shimmer h-16 rounded-lg border border-on-surface/5" />
              <div className="shimmer h-16 rounded-lg border border-on-surface/5" />
            </div>
          </section>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-28 flex flex-col gap-lg rounded-lg border border-on-surface/10 bg-surface-container-low p-lg md:p-xl">
            <div className="shimmer h-6 w-40 rounded-sm" />
            <div className="flex flex-col gap-md">
              {[0, 1].map((index) => (
                <div key={index} className="flex items-start gap-md">
                  <div className="shimmer h-20 w-20 shrink-0 rounded-lg" />
                  <div className="flex flex-grow flex-col gap-xs pt-1">
                    <div className="shimmer h-5 w-3/4 rounded-sm" />
                    <div className="shimmer h-4 w-1/2 rounded-sm opacity-60" />
                  </div>
                  <div className="shimmer h-5 w-14 rounded-sm" />
                </div>
              ))}
            </div>
            <div className="h-px w-full bg-on-surface/10" />
            <div className="flex flex-col gap-sm">
              <div className="flex justify-between">
                <div className="shimmer h-4 w-16 rounded-sm" />
                <div className="shimmer h-4 w-20 rounded-sm" />
              </div>
              <div className="flex justify-between">
                <div className="shimmer h-4 w-20 rounded-sm" />
                <div className="shimmer h-4 w-16 rounded-sm" />
              </div>
            </div>
            <div className="flex items-end justify-between">
              <div className="shimmer h-6 w-24 rounded-sm" />
              <div className="shimmer h-8 w-32 rounded-sm" />
            </div>
            <div className="shimmer h-14 w-full rounded" />
            <div className="flex items-center justify-center gap-xs opacity-70">
              <div className="shimmer h-4 w-4 rounded-full" />
              <div className="shimmer h-3 w-32 rounded-sm" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}