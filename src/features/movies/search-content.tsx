import { useEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Film, Loader2, AlertCircle, TrendingUp } from 'lucide-react'
import { z } from 'zod'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { searchMovies, getTrendingMovies } from '#/lib/tmdb'

import { MovieCard, MovieCardSkeleton } from './movie-card'

export const searchSchema = z.object({ q: z.string().optional() })

interface SearchContentProps {
  initialQuery?: string
  onQueryChange: (q: string | undefined) => void
}

export function SearchContent({
  initialQuery = '',
  onQueryChange,
}: SearchContentProps) {
  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    onQueryChange(query || undefined)
    setPage(1)
  }, [query])

  const handleInput = (val: string) => {
    setInputValue(val)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => setQuery(val.trim()), 400)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (debounceRef.current) clearTimeout(debounceRef.current)
    setQuery(inputValue.trim())
  }

  const searchQ = useQuery({
    queryKey: ['movies', 'search', query, page],
    queryFn: () => searchMovies(query, page),
    enabled: query.length > 0,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })

  const trendingQ = useQuery({
    queryKey: ['movies', 'trending'],
    queryFn: getTrendingMovies,
    enabled: query.length === 0,
    staleTime: 10 * 60 * 1000,
  })

  const isSearching = query.length > 0
  const activeQuery = isSearching ? searchQ : trendingQ
  const movies = activeQuery.data?.results ?? []
  const totalPages = isSearching ? (searchQ.data?.total_pages ?? 1) : 1
  const totalResults = isSearching ? (searchQ.data?.total_results ?? 0) : 0

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero search bar */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
          Discover Movies
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          Search millions of films and build your watchlist
        </p>
        <form className="max-w-2xl mx-auto relative" onSubmit={handleSubmit}>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
          <Input
            autoFocus
            className="pl-12 pr-4 h-14 text-base rounded-2xl border-border/60 shadow-sm focus-visible:ring-2 bg-card"
            placeholder="Search for a movie…"
            type="search"
            value={inputValue}
            onChange={(e) => handleInput(e.target.value)}
          />
          {activeQuery.isFetching ? (
            <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground animate-spin" />
          ) : null}
        </form>
      </motion.div>

      {/* Section header */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isSearching ? 'search' : 'trending'}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {isSearching ? (
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-semibold text-lg">
                  Results for &ldquo;{query}&rdquo;
                </h2>
                {!activeQuery.isLoading ? (
                  <p className="text-sm text-muted-foreground">
                    {totalResults.toLocaleString()} movies found
                  </p>
                ) : null}
              </div>
              {totalPages > 1 ? (
                <div className="flex items-center gap-2 text-sm">
                  <Button
                    disabled={page === 1 || activeQuery.isFetching}
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Prev
                  </Button>
                  <span className="text-muted-foreground">
                    {page} / {Math.min(totalPages, 500)}
                  </span>
                  <Button
                    disabled={page >= totalPages || activeQuery.isFetching}
                    size="sm"
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">Trending This Week</h2>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Error state */}
      {activeQuery.isError ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <AlertCircle className="w-12 h-12 text-destructive" />
          <h3 className="font-semibold text-lg">Something went wrong</h3>
          <p className="text-muted-foreground text-sm max-w-sm">
            Failed to fetch movies. Please check your connection or try again.
          </p>
          <Button variant="outline" onClick={() => activeQuery.refetch()}>
            Try again
          </Button>
        </div>
      ) : null}

      {/* Loading state */}
      {activeQuery.isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      ) : null}

      {/* Empty state */}
      {!activeQuery.isLoading &&
      !activeQuery.isError &&
      movies.length === 0 &&
      isSearching ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Film className="w-12 h-12 text-muted-foreground" />
          <h3 className="font-semibold text-lg">No results found</h3>
          <p className="text-muted-foreground text-sm">
            Try a different title or check your spelling.
          </p>
        </div>
      ) : null}

      {/* Results grid */}
      {!activeQuery.isLoading && movies.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
        >
          <AnimatePresence>
            {movies.map((movie, i) => (
              <MovieCard key={movie.id} index={i} movie={movie} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : null}

      {/* Bottom pagination */}
      {isSearching &&
      totalPages > 1 &&
      !activeQuery.isLoading &&
      movies.length > 0 ? (
        <div className="flex justify-center gap-2 mt-10">
          <Button
            disabled={page === 1 || activeQuery.isFetching}
            variant="outline"
            onClick={() => {
              setPage((p) => Math.max(1, p - 1))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Previous
          </Button>
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {Math.min(totalPages, 500)}
          </span>
          <Button
            disabled={page >= totalPages || activeQuery.isFetching}
            variant="outline"
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1))
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            Next
          </Button>
        </div>
      ) : null}
    </div>
  )
}
