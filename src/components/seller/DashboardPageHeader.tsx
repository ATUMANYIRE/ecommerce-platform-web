/** Title block shared by the Seller Hub and Admin Console pages. */
export default function DashboardPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="mb-xl flex flex-col gap-md sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="mb-xs font-headline-lg-mobile text-headline-lg-mobile text-on-surface md:font-headline-lg md:text-headline-lg">
          {title}
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-sm">{actions}</div> : null}
    </header>
  );
}
