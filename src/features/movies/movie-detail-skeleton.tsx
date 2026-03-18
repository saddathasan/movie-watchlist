import { Skeleton } from '#/components/ui/skeleton'

function delay(ms: number): React.CSSProperties {
  return { animationDelay: `${ms}ms` }
}

export function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Backdrop — mirrors MovieDetailBackdrop exactly */}
      <div className="relative h-[50vh] overflow-hidden md:h-[60vh]">
        <Skeleton className="h-full w-full rounded-none" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent" />
      </div>

      <div className="page-container relative z-10 -mt-48">
        {/* Back button */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="size-4 rounded-sm" style={delay(0)} />
          <Skeleton className="h-4 w-10" style={delay(50)} />
        </div>

        {/* Poster + info — mirrors MovieDetailInfo layout */}
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Poster */}
          <div className="shrink-0">
            <Skeleton
              className="mx-auto aspect-2/3 w-48 rounded-lg shadow-card md:mx-0 md:w-64"
              style={delay(100)}
            />
          </div>

          {/* Info column */}
          <div className="min-w-0 flex-1">
            {/* Title */}
            <Skeleton className="h-12 w-3/4" style={delay(120)} />
            {/* Tagline */}
            <Skeleton className="mt-3 h-4 w-2/5" style={delay(150)} />

            {/* Meta row: rating · runtime · year */}
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-4 rounded-sm" style={delay(180)} />
                <Skeleton className="h-4 w-10" style={delay(200)} />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-4 rounded-sm" style={delay(220)} />
                <Skeleton className="h-4 w-14" style={delay(240)} />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="size-4 rounded-sm" style={delay(260)} />
                <Skeleton className="h-4 w-10" style={delay(280)} />
              </div>
            </div>

            {/* Genre pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[80, 64, 88, 72].map((w, i) => (
                <Skeleton
                  key={i}
                  className="h-6 rounded-full"
                  style={{ width: w, ...delay(300 + i * 40) }}
                />
              ))}
            </div>

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Skeleton className="h-11 w-44 rounded-lg" style={delay(460)} />
              <Skeleton className="h-11 w-28 rounded-lg" style={delay(500)} />
            </div>

            {/* Overview — 3 lines */}
            <div className="mt-8 space-y-2">
              <Skeleton className="h-4 w-full max-w-2xl" style={delay(540)} />
              <Skeleton className="h-4 w-11/12 max-w-2xl" style={delay(570)} />
              <Skeleton className="h-4 w-3/4 max-w-2xl" style={delay(600)} />
            </div>
          </div>
        </div>

        {/* Cast section — mirrors MovieDetailCast */}
        <div className="mt-12 mb-16">
          <Skeleton className="mb-5 h-7 w-28" style={delay(640)} />
          <div className="flex gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex w-20 shrink-0 flex-col items-center gap-2"
              >
                <Skeleton
                  className="size-20 rounded-full"
                  style={delay(680 + i * 40)}
                />
                <Skeleton className="h-3 w-16" style={delay(700 + i * 40)} />
                <Skeleton className="h-3 w-12" style={delay(720 + i * 40)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
