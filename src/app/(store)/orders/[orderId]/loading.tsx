export default function OrderDetailsLoading() {
  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xl md:px-margin-desktop">
      <div className="mb-lg flex items-center gap-2">
        <div className="shimmer h-4 w-16 rounded" />
        <span className="font-label-sm text-label-sm text-outline/50">/</span>
        <div className="shimmer h-4 w-24 rounded" />
        <span className="font-label-sm text-label-sm text-outline/50">/</span>
        <div className="shimmer h-4 w-20 rounded" />
      </div>

      <div className="mb-xl flex flex-col justify-between gap-md md:flex-row md:items-end">
        <div>
          <div className="shimmer mb-4 h-10 w-64 rounded" />
          <div className="flex items-center gap-md">
            <div className="shimmer h-4 w-32 rounded" />
            <div className="shimmer h-4 w-4 rounded-full" />
            <div className="shimmer h-4 w-40 rounded" />
          </div>
        </div>
        <div className="shimmer h-10 w-32 rounded" />
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-lg lg:col-span-8">
          <div className="rounded-lg border border-outline/10 bg-ink p-lg">
            <div className="shimmer mb-lg h-6 w-48 rounded" />
            <div className="relative mt-xl flex justify-between">
              <div className="absolute top-3 left-0 h-px w-full bg-outline/10" />
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="flex flex-col items-center gap-sm">
                  <div className="shimmer h-6 w-6 rounded-full" />
                  <div className="shimmer mt-2 h-4 w-20 rounded" />
                  <div className="shimmer h-3 w-16 rounded" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-outline/10 bg-ink p-lg">
            <div className="shimmer mb-lg h-6 w-32 rounded" />
            <div className="flex flex-col gap-lg">
              {[0, 1].map((index) => (
                <div key={index} className="flex gap-md">
                  <div className="shimmer h-24 w-24 rounded" />
                  <div className="flex flex-grow flex-col justify-center gap-sm">
                    <div className="shimmer h-5 w-48 rounded" />
                    <div className="shimmer h-4 w-32 rounded" />
                    <div className="shimmer mt-2 h-4 w-24 rounded" />
                  </div>
                  <div className="flex flex-col items-end justify-center gap-sm">
                    <div className="shimmer h-5 w-20 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-lg lg:col-span-4">
          <div className="flex flex-col gap-md rounded-lg border border-outline/10 bg-ink p-lg">
            <div className="shimmer mb-sm h-6 w-32 rounded" />
            <div className="flex justify-between">
              <div className="shimmer h-4 w-20 rounded" />
              <div className="shimmer h-4 w-16 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="shimmer h-4 w-24 rounded" />
              <div className="shimmer h-4 w-16 rounded" />
            </div>
            <div className="flex justify-between">
              <div className="shimmer h-4 w-16 rounded" />
              <div className="shimmer h-4 w-12 rounded" />
            </div>
            <div className="my-sm h-px bg-outline/10" />
            <div className="flex items-end justify-between">
              <div className="shimmer h-6 w-16 rounded" />
              <div className="shimmer h-8 w-24 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-sm rounded-lg border border-outline/10 bg-ink p-lg">
            <div className="shimmer mb-sm h-6 w-40 rounded" />
            <div className="shimmer h-4 w-32 rounded" />
            <div className="shimmer h-4 w-48 rounded" />
            <div className="shimmer h-4 w-24 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}