import { createFileRoute, Link } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { BookMarked, Trash2, LogIn, Star, Calendar, Search } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Skeleton } from '#/components/ui/skeleton'
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
          <h2 className="text-xl font-semibold mb-2">Sign in to see your Watchlist</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your watchlist is saved per account. Sign in to access your saved movies from any device.
          </p>
          <Link to="/login">
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

  const handleRemove = async (entry: WatchlistEntry) => {
    await removeFromWatchlist(entry.id)
    toast.success(`Removed "${entry.title}" from watchlist`)
  }

  if (loading) return <WatchlistSkeleton />

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
        <Link to="/search">
          <Button variant="outline" className="gap-2">
            <Search className="w-4 h-4" />
            Find more movies
          </Button>
        </Link>
      </motion.div>

      {/* Empty state */}
      {watchlist.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center py-20"
        >
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-muted mx-auto mb-5">
            <BookMarked className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Your watchlist is empty</h2>
          <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
            Start adding movies by clicking the bookmark icon on any movie card or details page.
          </p>
          <Link to="/search">
            <Button className="gap-2">
              <Search className="w-4 h-4" />
              Search for movies
            </Button>
          </Link>
        </motion.div>
      )}

      {/* Grid */}
      {watchlist.length > 0 && (
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {watchlist.map((entry, i) => (
              <WatchlistCard
                key={entry.id}
                entry={entry}
                index={i}
                onRemove={() => handleRemove(entry)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}

function WatchlistCard({
  entry,
  index,
  onRemove,
}: {
  entry: WatchlistEntry
  index: number
  onRemove: () => void
}) {
  const poster = posterUrl(entry.poster_path, 'w342')
  const year = entry.release_date ? entry.release_date.slice(0, 4) : '—'
  const rating = entry.vote_average ? entry.vote_average.toFixed(1) : 'N/A'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, delay: index * 0.04 }}
    >
      <Card className="group overflow-hidden border-border/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex flex-row gap-0 p-0 h-36">
        {/* Poster */}
        <Link
          to="/movie/$id"
          params={{ id: String(entry.id) }}
          className="block flex-shrink-0 w-24 overflow-hidden"
        >
          <img
            src={poster ?? '/placeholder-poster.svg'}
            alt={entry.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Info */}
        <CardContent className="p-3 flex flex-col justify-between flex-1 min-w-0">
          <div>
            <Link to="/movie/$id" params={{ id: String(entry.id) }}>
              <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
                {entry.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {year}
              </span>
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {rating}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <Link to="/movie/$id" params={{ id: String(entry.id) }} className="flex-1">
              <Button variant="secondary" size="sm" className="w-full text-xs h-7">
                Details
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              onClick={onRemove}
              aria-label="Remove from watchlist"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function WatchlistSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-36 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
