import { Skeleton } from '#/components/ui/skeleton'
import { MovieCardSkeleton } from '#/features/movies'

export function WatchlistSkeleton() {
  return (
    <div className="page-container py-8">
      <div className="mb-8">
        <Skeleton className="mb-2 h-9 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
