import { useState } from 'react'

import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { toast } from 'sonner'

import { MovieCard, RemoveFromWatchlistDialog } from '#/components'
import { Button } from '#/components/ui/button'

import { DeleteButton } from './delete-button'
import type { WatchlistEntry } from './hooks/use-watchlist'
import { useWatchlist } from './hooks/use-watchlist'
import { WatchlistEmptyState } from './watchlist-empty-state'
import { WatchlistSkeleton } from './watchlist-skeleton'

export function AuthenticatedWatchlist() {
  const { watchlist, loading, removeFromWatchlist } = useWatchlist()
  const [pendingDelete, setPendingDelete] = useState<WatchlistEntry | null>(
    null,
  )

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

  return (
    <div className="page-container py-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
        initial={{ opacity: 0, y: -10 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
          <p className="mt-1 text-muted-foreground">
            {watchlist.length === 0
              ? 'No movies saved yet'
              : `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        {watchlist.length > 0 ? (
          <Link className="cursor-pointer" to="/search">
            <Button
              className="gap-2 cursor-pointer hover:text-primary"
              variant="outline"
            >
              <Plus className="h-4 w-4" />
              Add More Movies
            </Button>
          </Link>
        ) : null}
      </motion.div>

      {watchlist.length === 0 ? (
        <WatchlistEmptyState />
      ) : (
        <motion.div
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
          initial={{ opacity: 0 }}
        >
          <AnimatePresence mode="popLayout">
            {watchlist.map((entry, i) => (
              <MovieCard
                key={entry.id}
                action={
                  <DeleteButton
                    title={entry.title}
                    onDelete={() => setPendingDelete(entry)}
                  />
                }
                id={entry.id}
                index={i}
                posterPath={entry.poster_path}
                releaseDate={entry.release_date}
                title={entry.title}
                voteAverage={entry.vote_average}
              />
            ))}
          </AnimatePresence>
        </motion.div>
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
