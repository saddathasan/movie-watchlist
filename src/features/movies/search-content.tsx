import { useEffect, useRef, useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { fadeDown, transitions } from '#/lib/motion'
import { getTrendingMovies, searchMovies } from '#/lib/tmdb'

import { SearchBar } from './search-bar'
import { SearchHeader } from './search-header'
import { SearchPagination } from './search-pagination'
import { SearchResultsGrid } from './search-results-grid'

const routeApi = getRouteApi('/search')

export function SearchContent() {
  const { q } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const initialQuery = q ?? ''
  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const [page, setPage] = useState(1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, q: query || undefined }),
      replace: true,
    })
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
    queryKey: ['trending', 'week'],
    queryFn: getTrendingMovies,
    enabled: query.length === 0,
    staleTime: 5 * 60 * 1000,
  })

  const isSearching = query.length > 0
  const activeQuery = isSearching ? searchQ : trendingQ
  const movies = activeQuery.data?.results ?? []
  const totalPages = isSearching ? (searchQ.data?.total_pages ?? 1) : 1
  const totalResults = isSearching ? (searchQ.data?.total_results ?? 0) : 0
  const showPagination =
    isSearching && totalPages > 1 && !activeQuery.isLoading && movies.length > 0

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
          isFetching={activeQuery.isFetching}
          value={inputValue}
          onChange={handleInput}
          onSubmit={handleSubmit}
        />
      </motion.div>

      {/* Section header + compact pagination */}
      <div className="mb-6 flex items-center justify-between">
        <SearchHeader
          isLoading={activeQuery.isLoading}
          isSearching={isSearching}
          query={query}
          totalResults={totalResults}
        />
        {showPagination ? (
          <SearchPagination
            compact
            isFetching={activeQuery.isFetching}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        ) : null}
      </div>

      {/* Results / loading / empty / error */}
      <SearchResultsGrid
        isError={activeQuery.isError}
        isLoading={activeQuery.isLoading}
        isSearching={isSearching}
        movies={movies}
        onRetry={() => void activeQuery.refetch()}
      />

      {/* Bottom pagination */}
      {showPagination ? (
        <SearchPagination
          isFetching={activeQuery.isFetching}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  )
}
