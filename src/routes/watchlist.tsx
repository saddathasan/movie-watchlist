import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { BookMarked, LogIn, Search, Trash2, Star, Film } from 'lucide-react'
import { useState } from 'react'
import { Button } from '#/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { useAuth } from '#/integrations/auth/provider'
import { useWatchlist, type WatchlistEntry } from '#/hooks/useWatchlist'
import { posterUrl } from '#/lib/tmdb'
import { toast } from 'sonner'

export const Route = createFileRoute('/watchlist')({
  component: WatchlistPage,
})

function WatchlistPage() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) return <WatchlistSkeleton />

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="max-w-sm mx-auto"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mx-auto mb-4">
            <BookMarked className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Sign in to see your Watchlist
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your watchlist is saved per account. Sign in to access your saved
            movies from any device.
          </p>
          <Link to="/" className="cursor-pointer">
            <Button className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign in
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return <AuthenticatedWatchlist />
}

function AuthenticatedWatchlist() {
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
      loading: `Removing "${entry.title}"…`,
      success: `"${entry.title}" removed from watchlist`,
      error: `Failed to remove "${entry.title}"`,
    })
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Watchlist</h1>
          <p className="text-muted-foreground mt-1">
            {watchlist.length === 0
              ? 'No movies saved yet'
              : `${watchlist.length} movie${watchlist.length !== 1 ? 's' : ''} saved`}
          </p>
        </div>
        {watchlist.length > 0 && (
          <Link to="/search" className="cursor-pointer">
            <Button variant="outline" className="gap-2">
              <Search className="w-4 h-4" />
              Find more movies
            </Button>
          </Link>
        )}
      </motion.div>

      {/* Empty state */}
      {watchlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="py-32 flex flex-col items-center text-center max-w-lg mx-auto bg-card/50 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm"
        >
          <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-muted mb-8">
            <BookMarked className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="font-display text-3xl text-foreground mb-4">
            Your watchlist is empty
          </h2>
          <p className="text-muted-foreground text-lg mb-8 px-8">
            You haven't added any movies yet. Start exploring and build your
            cinematic library.
          </p>
          <Link to="/search" className="cursor-pointer">
            <Button size="lg" className="px-8 font-bold text-base gap-2">
              <Search className="w-4 h-4" />
              Explore Movies
            </Button>
          </Link>
        </motion.div>
      ) : (
        /* Grid */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
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

      {/* Delete confirmation modal */}
      <Dialog
        open={!!pendingDelete}
        onOpenChange={(open) => {
          if (!open) setPendingDelete(null)
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove from Watchlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              <span className="font-semibold text-foreground">
                "{pendingDelete?.title}"
              </span>{' '}
              from your watchlist? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setPendingDelete(null)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              className="cursor-pointer"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function WatchlistCard({
  entry,
  index,
  onDelete,
}: {
  entry: WatchlistEntry
  index: number
  onDelete: () => void
}) {
  const poster = posterUrl(entry.poster_path, 'w342')
  const year = entry.release_date?.slice(0, 4) || 'N/A'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className="group relative rounded-xl bg-surface shadow-card hover:-translate-y-1 transition-transform duration-300"
    >
      {/* Poster — clickable */}
      <Link
        to="/movie/$id"
        params={{ id: String(entry.id) }}
        className="block overflow-hidden rounded-t-xl cursor-pointer"
      >
        <div className="relative aspect-[2/3] overflow-hidden">
          {poster ? (
            <img
              src={poster}
              alt={entry.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Film className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {/* Hover gradient scoped to poster */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {/* Rating badge */}
      {(entry.vote_average ?? 0) > 0 && (
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {entry.vote_average.toFixed(1)}
        </div>
      )}

      {/* Info row */}
      <div className="flex items-center gap-1 p-3">
        <div className="flex-1 min-w-0">
          {/* Title — clickable, turns gold on card hover */}
          <Link
            to="/movie/$id"
            params={{ id: String(entry.id) }}
            className="cursor-pointer"
          >
            <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-200">
              {entry.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{year}</p>
        </div>

        {/* Delete button — gold circle on hover, with tooltip */}
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onDelete}
                aria-label={`Remove ${entry.title} from watchlist`}
                className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from watchlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}

function WatchlistSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="h-9 w-48 bg-secondary/50 animate-pulse rounded mb-2" />
        <div className="h-4 w-32 bg-secondary/50 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="aspect-[2/3] rounded-2xl bg-secondary/50 animate-pulse"
          />
        ))}
      </div>
    </div>
  )
}
