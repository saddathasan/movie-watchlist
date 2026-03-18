import { getRouteApi } from '@tanstack/react-router'

import type { WatchlistEntry } from './use-watchlist'

export type WatchlistFilter = 'all' | 'watched' | 'unwatched'

const routeApi = getRouteApi('/watchlist')

export function useWatchlistFilter(watchlist: WatchlistEntry[]) {
  const { filter } = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const setFilter = (next: WatchlistFilter) => {
    void navigate({
      search: (prev) => ({ ...prev, filter: next }),
      replace: true,
    })
  }

  const filtered = watchlist.filter((entry) => {
    if (filter === 'watched') return entry.watchedAt !== null
    if (filter === 'unwatched') return entry.watchedAt === null
    return true
  })

  const watchedCount = watchlist.filter((e) => e.watchedAt !== null).length
  const unwatchedCount = watchlist.length - watchedCount

  return {
    filter,
    filtered,
    setFilter,
    watchedCount,
    unwatchedCount,
    total: watchlist.length,
  }
}
