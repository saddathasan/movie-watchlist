import { Skeleton } from '#/components/ui/skeleton'

export function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <Skeleton className="h-[50vh] rounded-none md:h-[60vh]" />
      <div className="page-container relative z-10 -mt-48">
        <Skeleton className="mb-6 h-5 w-16" />
        <div className="flex flex-col gap-8 md:flex-row">
          <Skeleton className="mx-auto aspect-2/3 w-48 shrink-0 rounded-lg md:mx-0 md:w-64" />
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
            <Skeleton className="mt-6 h-7 w-32" />
            <Skeleton className="h-24 w-full max-w-2xl" />
          </div>
        </div>
        <div className="mt-12">
          <Skeleton className="mb-5 h-7 w-32" />
          <div className="flex gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex w-20 shrink-0 flex-col items-center gap-2"
              >
                <Skeleton className="size-20 rounded-full" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
