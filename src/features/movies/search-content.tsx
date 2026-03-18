import { useEffect, useRef, useState } from 'react'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { fadeDown, transitions } from '#/lib/motion'
import { getTrendingMovies, searchMovies } from '#/lib/tmdb'

import { SearchBar } from './search-bar'
import { SearchHeader } from './search-header'
import { SearchPagination } from './search-pagination'
import { SearchResultsGrid } from './search-results-grid'

const routeApi = getRouteApi('/search')

export function SearchContent() {
  const { q, page } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()
  const queryClient = useQueryClient()

  const initialQuery = q ?? ''
  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Ref to the results grid container — scroll it into view on page change
  const gridRef = useRef<HTMLDivElement>(null)

  const currentPage = page

  // Sync query changes → URL, reset to page 1
  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, q: query || undefined, page: 1 }),
      replace: true,
    })
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

  const handlePageChange = (newPage: number) => {
    navigate({ search: (prev) => ({ ...prev, page: newPage }) })
    // Scroll to top of results grid, keeping search bar visible
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const isSearching = query.length > 0

  const searchQ = useQuery({
    queryKey: ['movies', 'search', query, currentPage],
    queryFn: () => searchMovies(query, currentPage),
    enabled: isSearching,
    staleTime: 5 * 60 * 1000,
    // Keep previous page data visible while new page loads — no flash
    placeholderData: (prev) => prev,
  })

  const trendingQ = useQuery({
    queryKey: ['trending', 'week', currentPage],
    queryFn: () => getTrendingMovies(currentPage),
    enabled: !isSearching,
    staleTime: 5 * 60 * 1000,
    placeholderData: (prev) => prev,
  })

  const activeQ = isSearching ? searchQ : trendingQ
  const movies = activeQ.data?.results ?? []
  const totalPages = Math.min(activeQ.data?.total_pages ?? 1, 500)
  const totalResults = isSearching ? (searchQ.data?.total_results ?? 0) : 0
  const showPagination = totalPages > 1 && !activeQ.isLoading

  // Prefetch next and previous pages in the background
  useEffect(() => {
    if (activeQ.isLoading || activeQ.isError) return

    const queryKey = isSearching
      ? (p: number) => ['movies', 'search', query, p]
      : (p: number) => ['trending', 'week', p]
    const queryFn = isSearching
      ? (p: number) => () => searchMovies(query, p)
      : (p: number) => () => getTrendingMovies(p)

    if (currentPage < totalPages) {
      void queryClient.prefetchQuery({
        queryKey: queryKey(currentPage + 1),
        queryFn: queryFn(currentPage + 1),
        staleTime: 5 * 60 * 1000,
      })
    }
    if (currentPage > 1) {
      void queryClient.prefetchQuery({
        queryKey: queryKey(currentPage - 1),
        queryFn: queryFn(currentPage - 1),
        staleTime: 5 * 60 * 1000,
      })
    }
  }, [
    isSearching,
    query,
    currentPage,
    totalPages,
    activeQ.isLoading,
    activeQ.isError,
  ])

  return (
    <div className="page-container py-8">
      {/* Hero search bar */}
      <motion.div
        animate={fadeDown.animate}
        className="mb-10 text-center"
        initial={fadeDown.initial}
        transition={transitions.default}
      >
        <h1 className="mb-3 text-4xl font-bold tracking-tight sm:text-5xl">
          Discover Movies
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Search millions of films and build your watchlist
        </p>
        <SearchBar
          isFetching={activeQ.isFetching}
          value={inputValue}
          onChange={handleInput}
          onSubmit={handleSubmit}
        />
      </motion.div>

      {/* Grid anchor — scroll target on page change */}
      <div ref={gridRef}>
        <div className="mb-6 flex items-start justify-between gap-4">
          <SearchHeader
            isLoading={activeQ.isLoading}
            isSearching={isSearching}
            isTrendingFirstPage={!isSearching && currentPage === 1}
            query={query}
            totalResults={totalResults}
          />
          {showPagination ? (
            <div className="hidden shrink-0 items-center gap-1 sm:flex">
              <Button
                aria-label="Previous page"
                disabled={currentPage === 1 || activeQ.isFetching}
                size="icon"
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                aria-label="Next page"
                disabled={currentPage === totalPages || activeQ.isFetching}
                size="icon"
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          ) : null}
        </div>

        {/* Results grid */}
        <SearchResultsGrid
          isError={activeQ.isError}
          isFetching={activeQ.isFetching}
          isLoading={activeQ.isLoading}
          isSearching={isSearching}
          movies={movies}
          page={currentPage}
          onRetry={() => void activeQ.refetch()}
        />

        {/* Single bottom pagination */}
        {showPagination ? (
          <SearchPagination
            isFetching={activeQ.isFetching}
            page={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        ) : null}
      </div>
    </div>
  )
}
