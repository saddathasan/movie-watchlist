export function WatchlistSkeleton() {
  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-secondary/50 animate-pulse rounded mb-2" />
        <div className="h-4 w-32 bg-secondary/50 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="aspect-2/3 rounded-2xl bg-secondary/50 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
