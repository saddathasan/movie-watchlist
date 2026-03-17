import { Skeleton } from '#/components/ui/skeleton'

export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-card">
      <Skeleton className="aspect-2/3 rounded-none" />
      <div className="flex flex-col gap-2 p-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  )
}
