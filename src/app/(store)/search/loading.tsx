import {
  SkeletonGrid,
  SkeletonSidebar,
} from "@/components/search/SearchSkeleton";

export default function SearchLoading() {
  return (
    <div className="mx-auto flex w-full max-w-max-width flex-col gap-xl px-margin-mobile py-xl md:flex-row md:px-margin-desktop md:py-xxl">
      <div className="hidden w-full md:block md:w-64 md:flex-shrink-0">
        <SkeletonSidebar />
      </div>
      <div className="flex flex-1 flex-col">
        <div className="mb-lg">
          <div className="mb-sm h-4 w-40 rounded-sm bg-surface-container-high" />
          <div className="h-8 w-64 rounded-sm bg-surface-container-high" />
        </div>
        <SkeletonGrid count={6} />
      </div>
    </div>
  );
}
