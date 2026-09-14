export default function LoginLoading() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-md">
        <div className="mx-auto h-10 w-28 rounded shimmer" />
        <div className="mx-auto h-8 w-56 rounded shimmer" />
        <div className="h-6 w-2/3 rounded shimmer" />
        <div className="h-6 w-full rounded shimmer" />
        <div className="h-12 w-full rounded shimmer" />
      </div>
    </main>
  );
}