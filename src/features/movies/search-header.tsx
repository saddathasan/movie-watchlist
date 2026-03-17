import { AnimatePresence, motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

import { fadeIn, transitions } from '#/lib/motion'

interface SearchHeaderProps {
  isSearching: boolean
  query: string
  totalResults: number
  isLoading: boolean
}

export function SearchHeader({
  isSearching,
  query,
  totalResults,
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
            <h2 className="font-semibold text-lg">
              Results for &ldquo;{query}&rdquo;
            </h2>
            {!isLoading ? (
              <p className="text-sm text-muted-foreground">
                {totalResults.toLocaleString()} movies found
              </p>
            ) : null}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h2 className="font-semibold text-lg">Trending This Week</h2>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
