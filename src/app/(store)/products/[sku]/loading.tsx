export default function ProductLoading() {
  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-xxl px-margin-mobile pt-xl pb-xxl md:px-margin-desktop">
      <div className="h-4 w-64 rounded-sm bg-surface-container-high" />

      <div className="grid grid-cols-1 items-start gap-gutter md:grid-cols-12">
        <div className="aspect-square rounded-lg bg-surface-container-high md:col-span-7" />

        <div className="flex flex-col gap-lg md:col-span-5">
          <div className="h-10 w-3/4 rounded-sm bg-surface-container-high" />
          <div className="h-6 w-32 rounded-sm bg-surface-container-high" />
          <div className="h-4 w-48 rounded-sm bg-surface-container-high" />
          <div className="h-12 w-full rounded-sm bg-surface-container-high" />
          <div className="h-4 w-full rounded-sm bg-surface-container-high" />
        </div>
      </div>
    </div>
  );
}