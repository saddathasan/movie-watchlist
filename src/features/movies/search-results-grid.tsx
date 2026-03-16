import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Film } from 'lucide-react'

import { MovieCard } from '#/components'
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
  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h3 className="font-semibold text-lg">Something went wrong</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Failed to fetch movies. Please check your connection or try again.
        </p>
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <MovieCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (movies.length === 0 && isSearching) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <Film className="h-12 w-12 text-muted-foreground" />
        <h3 className="font-semibold text-lg">No results found</h3>
        <p className="text-sm text-muted-foreground">
          Try a different title or check your spelling.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      layout
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
    >
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
