import { motion } from 'framer-motion'

import { fadeDown } from '#/lib/motion'

interface WatchlistStatsProps {
  total: number
  watched: number
  unwatched: number
}

export function WatchlistStats({
  total,
  watched,
  unwatched,
}: WatchlistStatsProps) {
  const pct = total === 0 ? 0 : Math.round((watched / total) * 100)

  return (
    <motion.div
      animate={fadeDown.animate}
      className="mb-6 rounded-xl border border-border bg-card/60 p-4 backdrop-blur-sm"
      initial={fadeDown.initial}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Counts row */}
      <div className="mb-3 flex items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-4">
          <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-1.5">
            <span className="font-display text-xl text-primary sm:text-base">
              {watched}
            </span>
            <span className="text-xs text-muted-foreground sm:text-sm">
              watched
            </span>
          </span>
          <span className="h-4 w-px bg-border" />
          <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-1.5">
            <span className="font-display text-xl text-foreground sm:text-base">
              {unwatched}
            </span>
            <span className="text-xs text-muted-foreground sm:text-sm">
              on my list
            </span>
          </span>
          <span className="h-4 w-px bg-border" />
          <span className="flex flex-col items-center gap-0.5 sm:flex-row sm:gap-1.5">
            <span className="font-display text-xl text-foreground sm:text-base">
              {total}
            </span>
            <span className="text-xs text-muted-foreground sm:text-sm">
              total
            </span>
          </span>
        </div>
        <span className="shrink-0 font-semibold tabular-nums text-primary">
          {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 overflow-hidden rounded-full bg-border">
        <motion.div
          animate={{ width: `${pct}%` }}
          className="h-full rounded-full bg-primary"
          initial={{ width: '0%' }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
        />
      </div>
    </motion.div>
  )
}
