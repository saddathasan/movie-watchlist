export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-card">
      <div className="aspect-2/3 bg-secondary animate-pulse" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-secondary animate-pulse rounded w-3/4" />
        <div className="h-3 bg-secondary animate-pulse rounded w-1/3" />
      </div>
    </div>
  )
}
