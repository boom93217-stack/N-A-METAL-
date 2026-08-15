export function DashboardLayoutSkeleton() {
  return (
    <div className="flex min-h-screen animate-pulse">
      <div className="hidden w-[280px] shrink-0 border-r bg-sidebar md:block">
        <div className="flex h-16 items-center px-4">
          <div className="h-6 w-32 rounded bg-muted" />
        </div>
        <div className="flex flex-col gap-2 px-2 py-1">
          <div className="h-10 rounded-lg bg-muted" />
          <div className="h-10 rounded-lg bg-muted" />
        </div>
      </div>
      <div className="flex-1 p-4">
        <div className="mb-4 h-8 w-48 rounded bg-muted" />
        <div className="h-64 rounded-lg bg-muted" />
      </div>
    </div>
  );
}
