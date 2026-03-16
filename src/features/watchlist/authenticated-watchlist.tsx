import { useState } from 'react'

import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '#/components/ui/button'

import { useWatchlist } from './hooks/use-watchlist'
import type { WatchlistEntry } from './hooks/use-watchlist'
import { WatchlistCard } from './watchlist-card'
import { WatchlistDeleteDialog } from './watchlist-delete-dialog'
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        initial={{ opacity: 0, y: -10 }}
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
          <p className="text-muted-foreground mt-1">
            {watchlist.length === 0
              ? 'No movies saved yet'
              : `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        {watchlist.length > 0 ? (
          <Link className="cursor-pointer" to="/search">
            <Button className="gap-2 hover:text-primary cursor-pointer" variant="outline">
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          initial={{ opacity: 0 }}
        >
          <AnimatePresence mode="popLayout">
            {watchlist.map((entry, i) => (
              <WatchlistCard
                key={entry.id}
                entry={entry}
                index={i}
                onDelete={() => setPendingDelete(entry)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <WatchlistDeleteDialog
        entry={pendingDelete}
        open={!!pendingDelete}
        onCancel={() => setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}
