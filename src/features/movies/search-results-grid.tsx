import { Fragment, useCallback, useRef } from 'react'

import { motion } from 'framer-motion'
import { AlertCircle, Film } from 'lucide-react'

import { EmptyState, MovieCard } from '#/components'
import { Button } from '#/components/ui/button'
import { fadeUp, staggerDelay, transitions } from '#/lib/motion'
import type { TMDBSearchResult } from '#/lib/tmdb'

import { MovieCardSkeleton } from './movie-card-skeleton'
import { WatchlistToggleButton } from './watchlist-toggle-button'

interface SearchResultsGridProps {
  isLoading: boolean
  isError: boolean
  pages: TMDBSearchResult[]
  isSearching: boolean
  isFetching: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: () => void
  onRetry: () => void
}

const GRID_CLASS =
  'grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'

export function SearchResultsGrid({
  isLoading,
  isError,
  pages,
  isSearching,
  isFetching,
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  onRetry,
}: SearchResultsGridProps) {
  // Track how many pages were rendered before this render to identify new pages
  const prevPageCountRef = useRef(pages.length)

  // Callback ref pattern — no race condition, no useEffect needed
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect()
      if (!node) return

      observerRef.current = new IntersectionObserver(
        ([entry]) => {
          // Guard: hasNextPage AND not already fetching (any kind)
          if (entry.isIntersecting && hasNextPage && !isFetching) {
            fetchNextPage()
          }
        },
        { rootMargin: '300px' },
      )
      observerRef.current.observe(node)
    },
    [hasNextPage, isFetching, fetchNextPage],
  )

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

  const allEmpty = pages.every((p) => p.results.length === 0)
  if (allEmpty && isSearching) {
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

  // Snapshot prev page count before updating ref — used to determine which
  // pages are "new" this render and should animate in
  const firstNewPageIndex = prevPageCountRef.current
  prevPageCountRef.current = pages.length

  return (
    <>
      <div className={GRID_CLASS}>
        {pages.map((page, pageIndex) => {
          const isNewPage = pageIndex >= firstNewPageIndex
          return (
            <Fragment key={page.page}>
              {page.results.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  animate={fadeUp.animate}
                  // Only animate items from newly appended pages
                  initial={isNewPage ? fadeUp.initial : false}
                  transition={
                    isNewPage
                      ? { ...staggerDelay(i, 0.03), ...transitions.default }
                      : undefined
                  }
                >
                  <MovieCard
                    action={<WatchlistToggleButton movie={movie} />}
                    id={movie.id}
                    index={0}
                    posterPath={movie.poster_path}
                    releaseDate={movie.release_date}
                    title={movie.title}
                    voteAverage={movie.vote_average}
                  />
                </motion.div>
              ))}
            </Fragment>
          )
        })}

        {/* Skeleton placeholders while fetching next page — fills the grid row */}
        {isFetchingNextPage
          ? Array.from({ length: 5 }).map((_, i) => (
              <MovieCardSkeleton key={`skeleton-${i}`} />
            ))
          : null}
      </div>

      {/* Invisible sentinel — IntersectionObserver watches this */}
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />
    </>
  )
}
