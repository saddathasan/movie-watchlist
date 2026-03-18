import { cn } from '#/lib/utils'

import type { WatchlistFilter } from './hooks/use-watchlist-filter'

interface Tab {
  value: WatchlistFilter
  label: string
  count: number
}

interface WatchlistFilterTabsProps {
  filter: WatchlistFilter
  total: number
  watched: number
  unwatched: number
  onChange: (filter: WatchlistFilter) => void
}

export function WatchlistFilterTabs({
  filter,
  total,
  watched,
  unwatched,
  onChange,
}: WatchlistFilterTabsProps) {
  const tabs: Tab[] = [
    { value: 'all', label: 'All', count: total },
    { value: 'unwatched', label: 'On My List', count: unwatched },
    { value: 'watched', label: 'Watched', count: watched },
  ]

  return (
    <div className="mb-6 flex gap-1 border-b border-border">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          className={cn(
            'relative flex cursor-pointer items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200',
            filter === tab.value
              ? 'text-primary'
              : 'text-muted-foreground hover:text-foreground',
          )}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
          <span
            className={cn(
              'rounded-full px-1.5 py-0.5 text-xs font-semibold tabular-nums transition-colors duration-200',
              filter === tab.value
                ? 'bg-primary/15 text-primary'
                : 'bg-muted text-muted-foreground',
            )}
          >
            {tab.count}
          </span>
          {/* Active underline */}
          {filter === tab.value ? (
            <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
          ) : null}
        </button>
      ))}
    </div>
  )
}
