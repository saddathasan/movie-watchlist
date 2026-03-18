import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Film } from 'lucide-react'

import { EmptyState, MovieCard } from '#/components'
import { Button } from '#/components/ui/button'
import { fadeIn, fadeUp, staggerDelay, transitions } from '#/lib/motion'
import type { TMDBMovie } from '#/lib/tmdb'

import { MovieCardSkeleton } from './movie-card-skeleton'
import { WatchlistToggleButton } from './watchlist-toggle-button'

interface SearchResultsGridProps {
  isLoading: boolean
  isError: boolean
  isFetching: boolean
  isSearching: boolean
  movies: TMDBMovie[]
  page: number
  onRetry: () => void
}

const GRID_CLASS =
  'grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export function SearchResultsGrid({
  isLoading,
  isError,
  isFetching,
  isSearching,
  movies,
  page,
  onRetry,
}: SearchResultsGridProps) {
  if (isError) {
    return (
      <div className="py-20">
        <EmptyState
          action={
            <Button variant="outline" onClick={onRetry}>
              Try again
            </Button>
          }
          description="Failed to fetch movies. Please check your connection or try again."
          icon={<AlertCircle className="size-10 text-destructive" />}
          title="Something went wrong"
          variant="error"
        />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className={GRID_CLASS}>
        {Array.from({ length: 20 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (movies.length === 0 && isSearching) {
    return (
      <div className="py-20">
        <EmptyState
          description="Try a different title or check your spelling."
          icon={<Film className="size-10 text-muted-foreground" />}
          title="No results found"
        />
      </div>
    )
  }

  return (
    // Dim the grid while a new page is fetching (cache miss); instant when prefetched
    <div
      className="transition-opacity duration-200"
      style={{ opacity: isFetching ? 0.5 : 1 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          animate={fadeIn.animate}
          className={GRID_CLASS}
          exit={fadeIn.exit}
          initial={fadeIn.initial}
          transition={transitions.fast}
        >
          {movies.map((movie, index) => (
            <motion.div
              key={movie.id}
              animate={fadeUp.animate}
              initial={fadeUp.initial}
              transition={{
                ...staggerDelay(index, 0.03),
                ...transitions.default,
              }}
            >
              <MovieCard
                action={<WatchlistToggleButton movie={movie} />}
                id={movie.id}
                index={index}
                posterPath={movie.poster_path}
                releaseDate={movie.release_date}
                title={movie.title}
                voteAverage={movie.vote_average}
              />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
