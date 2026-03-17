import { AnimatePresence, motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

import { fadeIn, transitions } from '#/lib/motion'

interface SearchHeaderProps {
  isSearching: boolean
  query: string
  totalResults: number
  loadedCount: number
  isLoading: boolean
}

export function SearchHeader({
  isSearching,
  query,
  totalResults,
  loadedCount,
  isLoading,
}: SearchHeaderProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isSearching ? 'search' : 'trending'}
        animate={fadeIn.animate}
        exit={fadeIn.exit}
        initial={fadeIn.initial}
        transition={transitions.fast}
      >
        {isSearching ? (
          <div>
            <h2 className="text-lg font-semibold">
              Results for &ldquo;{query}&rdquo;
            </h2>
            {!isLoading ? (
              <p className="text-sm text-muted-foreground">
                Showing {loadedCount.toLocaleString()} of{' '}
                {totalResults.toLocaleString()} movies
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="text-lg font-semibold">Trending This Week</h2>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
