import { Skeleton } from '#/components/ui/skeleton'

export function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-[50vh] md:h-[60vh] bg-surface animate-pulse" />
      <div className="page-container -mt-48 relative z-10">
        <div className="mb-6 h-5 w-16 bg-surface animate-pulse rounded" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-48 md:w-64 aspect-2/3 rounded-lg shrink-0 mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-20 rounded-full" />
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-44 rounded-lg" />
              <Skeleton className="h-11 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-32 mt-6" />
            <Skeleton className="h-24 w-full max-w-2xl" />
          </div>
        </div>
        <div className="mt-12">
          <Skeleton className="h-7 w-32 mb-5" />
          <div className="flex gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 shrink-0 w-20"
              >
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
