import { useEffect, useRef, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { fadeDown, transitions } from '#/lib/motion'
import { getTrendingMovies, searchMovies } from '#/lib/tmdb'

import { SearchBar } from './search-bar'
import { SearchHeader } from './search-header'
import { SearchResultsGrid } from './search-results-grid'

const routeApi = getRouteApi('/search')

export function SearchContent() {
  const { q } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const initialQuery = q ?? ''
  const [inputValue, setInputValue] = useState(initialQuery)
  const [query, setQuery] = useState(initialQuery)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    navigate({
      search: (prev) => ({ ...prev, q: query || undefined }),
      replace: true,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
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

  const searchQ = useInfiniteQuery({
    queryKey: ['movies', 'search', query],
    queryFn: ({ pageParam }) => searchMovies(query, pageParam),
    enabled: query.length > 0,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        lastPage.results.length === 0 ||
        lastPage.page >= Math.min(lastPage.total_pages, 500)
      ) {
        return undefined
      }
      return lastPage.page + 1
    },
    maxPages: 5,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const trendingQ = useInfiniteQuery({
    queryKey: ['trending', 'week', 'infinite'],
    queryFn: ({ pageParam }) => getTrendingMovies(pageParam),
    enabled: query.length === 0,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (
        lastPage.results.length === 0 ||
        lastPage.page >= Math.min(lastPage.total_pages, 500)
      ) {
        return undefined
      }
      return lastPage.page + 1
    },
    maxPages: 5,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })

  const isSearching = query.length > 0
  const activeQ = isSearching ? searchQ : trendingQ

  // Total from the first page's metadata
  const totalResults = isSearching
    ? (searchQ.data?.pages[0]?.total_results ?? 0)
    : 0
  // Count of movies actually loaded so far
  const loadedCount =
    activeQ.data?.pages.reduce((acc, p) => acc + p.results.length, 0) ?? 0

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

      {/* Section header */}
      <div className="mb-6">
        <SearchHeader
          isLoading={activeQ.isLoading}
          isSearching={isSearching}
          loadedCount={loadedCount}
          query={query}
          totalResults={totalResults}
        />
      </div>

      {/* Results / loading / empty / error */}
      <SearchResultsGrid
        fetchNextPage={activeQ.fetchNextPage}
        hasNextPage={activeQ.hasNextPage}
        isFetching={activeQ.isFetching}
        isFetchingNextPage={activeQ.isFetchingNextPage}
        isError={activeQ.isError}
        isLoading={activeQ.isLoading}
        isSearching={isSearching}
        pages={activeQ.data?.pages ?? []}
        onRetry={() => void activeQ.refetch()}
      />
    </div>
  )
}
