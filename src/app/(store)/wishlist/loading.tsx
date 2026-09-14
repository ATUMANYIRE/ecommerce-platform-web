export default function WishlistLoading() {
  return (
    <div className="mx-auto w-full max-w-max-width px-margin-mobile pt-xl pb-xxl md:px-margin-desktop">
      <div className="mb-xl flex flex-col gap-sm border-b border-outline-variant/30 pb-lg">
        <div className="shimmer h-10 w-48 rounded-sm" />
        <div className="shimmer h-5 w-32 rounded-sm" />
      </div>

      <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={[
              "flex flex-col gap-md rounded bg-surface-container-low p-lg",
              index === 2 ? "hidden sm:flex" : "",
              index === 3 ? "hidden lg:flex" : "",
            ].join(" ")}
          >
            <div className="shimmer aspect-square w-full rounded-sm" />
            <div className="flex flex-col gap-xs">
              <div className="shimmer mt-sm h-6 w-3/4 rounded-sm" />
              <div className="shimmer mt-xs h-4 w-1/2 rounded-sm" />
              <div className="shimmer mt-md h-5 w-1/3 rounded-sm" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}