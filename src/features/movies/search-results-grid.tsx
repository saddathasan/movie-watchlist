import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Film } from 'lucide-react'

import { EmptyState, MovieCard } from '#/components'
import { Button } from '#/components/ui/button'
import type { TMDBMovie } from '#/lib/tmdb'

import { MovieCardSkeleton } from './movie-card-skeleton'
import { WatchlistToggleButton } from './watchlist-toggle-button'

interface SearchResultsGridProps {
  isLoading: boolean
  isError: boolean
  movies: TMDBMovie[]
  isSearching: boolean
  onRetry: () => void
}

export function SearchResultsGrid({
  isLoading,
  isError,
  movies,
  isSearching,
  onRetry,
}: SearchResultsGridProps) {
  const gridClass =
    'grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

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
      <div className={gridClass}>
        {Array.from({ length: 12 }).map((_, i) => (
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
    <motion.div layout className={gridClass}>
      <AnimatePresence>
        {movies.map((movie, i) => (
          <MovieCard
            key={movie.id}
            action={<WatchlistToggleButton movie={movie} />}
            id={movie.id}
            index={i}
            posterPath={movie.poster_path}
            releaseDate={movie.release_date}
            title={movie.title}
            voteAverage={movie.vote_average}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  )
}
