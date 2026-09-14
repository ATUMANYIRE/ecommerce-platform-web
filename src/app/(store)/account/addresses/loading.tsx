export default function AccountAddressesLoading() {
  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile py-xxl md:px-margin-desktop">
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
    </div>
  );
}