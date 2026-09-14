export default function CartLoading() {
  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xxl md:px-margin-desktop">
      <div className="mb-xl">
        <div className="shimmer h-8 w-52 rounded-sm" />
        <div className="shimmer mt-sm h-4 w-24 rounded-sm" />
      </div>

      <div className="grid grid-cols-1 gap-gutter lg:grid-cols-12">
        <div className="flex flex-col gap-md lg:col-span-8">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="flex flex-col gap-lg rounded-2xl border border-white/5 bg-surface-container-low p-lg sm:flex-row"
            >
              <div className="shimmer h-24 w-full shrink-0 rounded-xl sm:h-36 sm:w-36" />
              <div className="flex flex-grow flex-col justify-between gap-lg py-sm">
                <div className="space-y-sm">
                  <div className="shimmer h-5 w-2/3 rounded-sm" />
                  <div className="shimmer h-4 w-28 rounded-sm" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="shimmer h-9 w-28 rounded-full" />
                  <div className="shimmer h-5 w-20 rounded-sm" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4">
          <div className="shimmer sticky top-xxl flex flex-col gap-lg rounded-2xl border border-white/5 bg-surface-container-low p-lg">
            <div className="shimmer h-6 w-40 rounded-sm" />
            <div className="space-y-md">
              <div className="shimmer h-4 w-full rounded-sm" />
              <div className="shimmer h-4 w-full rounded-sm" />
            </div>
            <div className="shimmer h-8 w-full rounded-sm" />
            <div className="shimmer h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}