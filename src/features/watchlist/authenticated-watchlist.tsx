import { useState } from 'react'

import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Film, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { EmptyState, MovieCard, RemoveFromWatchlistDialog } from '#/components'
import { Button } from '#/components/ui/button'
import { fadeDown, fadeIn } from '#/lib/motion'

import { DeleteButton } from './delete-button'
import { useWatchlistFilter } from './hooks/use-watchlist-filter'
import type { WatchlistEntry } from './hooks/use-watchlist'
import { useWatchlist } from './hooks/use-watchlist'
import { MarkWatchedButton } from './mark-watched-button'
import { WatchlistEmptyState } from './watchlist-empty-state'
import { WatchlistFilterTabs } from './watchlist-filter-tabs'
import { WatchlistSkeleton } from './watchlist-skeleton'
import { WatchlistStats } from './watchlist-stats'

export function AuthenticatedWatchlist() {
  const { watchlist, loading, removeFromWatchlist, markWatched } =
    useWatchlist()
  const [pendingDelete, setPendingDelete] = useState<WatchlistEntry | null>(
    null,
  )

  const { filter, filtered, setFilter, watchedCount, unwatchedCount, total } =
    useWatchlistFilter(watchlist)

  if (loading) return <WatchlistSkeleton />

  const handleConfirmDelete = () => {
    if (!pendingDelete) return
    const entry = pendingDelete
    setPendingDelete(null)
    toast.promise(removeFromWatchlist(entry.id), {
      error: `Failed to remove "${entry.title}"`,
      loading: `Removing "${entry.title}"…`,
      success: `"${entry.title}" removed from watchlist`,
    })
  }

  const handleToggleWatched = (movieId: number, watched: boolean) => {
    const entry = watchlist.find((e) => e.id === movieId)
    if (!entry) return
    toast.promise(markWatched(movieId, watched), {
      error: `Failed to update "${entry.title}"`,
      loading: watched ? `Marking as watched…` : `Removing from watched…`,
      success: watched
        ? `"${entry.title}" marked as watched`
        : `"${entry.title}" removed from watched`,
    })
  }

  const filterEmptyMessage = {
    watched: {
      title: 'No watched movies yet',
      description: 'Mark a movie as watched and it will appear here.',
    },
    unwatched: {
      title: "You've watched everything!",
      description: 'Add more movies to your list to keep track.',
    },
    all: {
      title: 'No movies saved yet',
      description: 'Start building your watchlist.',
    },
  } as const

  return (
    <div className="page-container py-8">
      {/* Header */}
      <motion.div
        animate={fadeDown.animate}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={fadeDown.initial}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
          <p className="mt-1 text-muted-foreground">
            {total === 0
              ? 'No movies saved yet'
              : `${total} movie${total !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        {total > 0 ? (
          <Link className="cursor-pointer" to="/search">
            <Button
              className="cursor-pointer gap-2 hover:text-primary"
              variant="outline"
            >
              <Plus className="size-4" />
              Add More Movies
            </Button>
          </Link>
        ) : null}
      </motion.div>

      {total === 0 ? (
        <WatchlistEmptyState />
      ) : (
        <>
          {/* Stats bar */}
          <WatchlistStats
            total={total}
            unwatched={unwatchedCount}
            watched={watchedCount}
          />

          {/* Filter tabs */}
          <WatchlistFilterTabs
            filter={filter}
            total={total}
            unwatched={unwatchedCount}
            watched={watchedCount}
            onChange={setFilter}
          />

          {/* Grid or filter-empty state */}
          {filtered.length === 0 ? (
            <motion.div animate={fadeIn.animate} initial={fadeIn.initial}>
              <EmptyState
                description={filterEmptyMessage[filter].description}
                icon={<Film className="size-10 text-muted-foreground" />}
                title={filterEmptyMessage[filter].title}
              />
            </motion.div>
          ) : (
            <motion.div
              animate={fadeIn.animate}
              className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
              initial={fadeIn.initial}
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((entry, i) => (
                  <MovieCard
                    key={entry.id}
                    action={
                      <div className="flex items-center gap-1">
                        <MarkWatchedButton
                          movieId={entry.id}
                          title={entry.title}
                          watched={entry.watchedAt !== null}
                          onToggle={handleToggleWatched}
                        />
                        <DeleteButton
                          title={entry.title}
                          onDelete={() => setPendingDelete(entry)}
                        />
                      </div>
                    }
                    id={entry.id}
                    index={i}
                    posterPath={entry.poster_path}
                    releaseDate={entry.release_date}
                    title={entry.title}
                    voteAverage={entry.vote_average}
                    watched={entry.watchedAt !== null}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      <RemoveFromWatchlistDialog
        open={!!pendingDelete}
        title={pendingDelete?.title ?? ''}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
