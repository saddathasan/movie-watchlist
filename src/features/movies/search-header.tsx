import { AnimatePresence, motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

import { fadeIn, transitions } from '#/lib/motion'

interface SearchHeaderProps {
  isSearching: boolean
  isTrendingFirstPage?: boolean
  query: string
  totalResults: number
  isLoading: boolean
}

export function SearchHeader({
  isSearching,
  isTrendingFirstPage = false,
  query,
  totalResults,
  isLoading,
}: SearchHeaderProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={isSearching ? 'search' : 'browse'}
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
                {totalResults.toLocaleString()} movies found
              </p>
            ) : null}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-semibold">Explore Movies</h2>
            {isTrendingFirstPage ? (
              <p className="mt-0.5 flex items-center gap-1 text-sm text-muted-foreground">
                <TrendingUp className="size-3.5 text-primary" />
                Trending this week
              </p>
            ) : null}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}
