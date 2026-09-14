export default function AccountLoading() {
  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-lg px-margin-mobile py-lg md:flex-row md:gap-xxl md:px-margin-desktop md:py-xxl">
      {/* Sidebar */}
      <aside className="w-full md:w-64">
        <div className="flex flex-col gap-sm">
          <div className="mb-lg flex items-center gap-md">
            <div className="shimmer h-12 w-12 rounded-full" />
            <div className="flex flex-grow flex-col gap-xs">
              <div className="shimmer h-4 w-24 rounded" />
              <div className="shimmer h-3 w-32 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-xs">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="shimmer h-10 w-full rounded" />
            ))}
            <div className="shimmer mt-md h-10 w-full rounded opacity-50" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-grow flex-col gap-xxl">
        <div className="flex flex-col gap-sm">
          <div className="shimmer h-8 w-48 rounded md:h-10" />
          <div className="shimmer h-4 w-64 rounded opacity-70" />
        </div>

        <section className="grid grid-cols-1 gap-md md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className="flex flex-col gap-md rounded-lg border border-muted/10 bg-surface p-lg shadow-[0_4px_32px_rgba(11,13,15,0.15)]"
            >
              <div className="flex items-start justify-between">
                <div className="shimmer h-8 w-8 rounded" />
                <div className="shimmer h-4 w-16 rounded opacity-50" />
              </div>
              <div className="mt-md flex flex-col gap-xs">
                <div className="shimmer h-6 w-20 rounded" />
                <div className="shimmer h-4 w-32 rounded opacity-70" />
              </div>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-md">
          <div className="flex items-end justify-between">
            <div className="shimmer h-6 w-32 rounded" />
            <div className="shimmer h-4 w-16 rounded" />
          </div>
          <div className="overflow-hidden rounded-lg border border-muted/10 bg-surface">
            <div className="grid grid-cols-4 gap-md border-b border-muted/10 bg-surface-container p-md">
              <div className="shimmer h-3 w-16 rounded opacity-50" />
              <div className="shimmer h-3 w-20 rounded opacity-50" />
              <div className="shimmer h-3 w-16 rounded opacity-50" />
              <div className="shimmer h-3 w-12 rounded opacity-50" />
            </div>
            <div className="flex flex-col">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className={`grid grid-cols-4 items-center gap-md p-md ${
                    index < 2 ? "border-b border-muted/10" : ""
                  }`}
                >
                  <div className="shimmer h-4 w-20 rounded" />
                  <div className="shimmer h-4 w-32 rounded" />
                  <div className="shimmer h-4 w-24 rounded" />
                  <div className="shimmer h-4 w-16 justify-self-end rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-md">
          <div className="flex items-end justify-between">
            <div className="shimmer h-6 w-24 rounded" />
            <div className="shimmer h-4 w-16 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-md md:grid-cols-4">
            {[0, 1, 2, 3].map((index) => (
              <div
                key={index}
                className={`flex flex-col gap-sm ${
                  index > 1 ? "hidden md:flex" : ""
                }`}
              >
                <div className="shimmer aspect-square w-full rounded-lg" />
                <div className="mt-xs flex flex-col gap-xs">
                  <div className="shimmer h-4 w-full rounded" />
                  <div className="shimmer h-3 w-2/3 rounded opacity-70" />
                  <div className="shimmer mt-xs h-4 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}