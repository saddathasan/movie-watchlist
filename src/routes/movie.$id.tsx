import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  Clock,
  Calendar,
  Plus,
  PlayCircle,
  X,
  User,
} from 'lucide-react'
import { Skeleton } from '#/components/ui/skeleton'
import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { getMovieDetails, posterUrl, backdropUrl, profileUrl } from '#/lib/tmdb'
import { useAuth } from '#/integrations/auth/provider'
import { useWatchlist } from '#/hooks/useWatchlist'
import { toast } from 'sonner'
import { useState } from 'react'

export const Route = createFileRoute('/movie/$id')({
  component: MovieDetailPage,
})

function MovieDetailPage() {
  const { id } = Route.useParams()
  const movieId = parseInt(id, 10)
  const { user } = useAuth()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [pendingRemove, setPendingRemove] = useState(false)

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    staleTime: 10 * 60 * 1000,
  })

  const inList = movie ? isInWatchlist(movieId) : false

  const handleWatchlist = async () => {
    if (!user) {
      toast.error('Please log in to use your watchlist')
      return
    }
    if (!movie) return
    await toggleWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    })
    toast.success(inList ? 'Removed from watchlist' : 'Added to watchlist!')
  }

  if (isLoading) return <MovieDetailSkeleton />

  if (isError || !movie) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load movie details.</p>
        <button
          onClick={() => window.history.back()}
          className="text-primary hover:underline text-sm cursor-pointer"
        >
          Go back
        </button>
      </div>
    )
  }

  const poster = posterUrl(movie.poster_path, 'w500')
  const backdrop = backdropUrl(movie.backdrop_path, 'w1280')
  const year = movie.release_date?.split('-')[0] || 'N/A'
  const runtime = movie.runtime ? `${movie.runtime} min` : null

  // Trailer: first official YouTube trailer, fall back to any YouTube trailer
  const trailer =
    movie.videos?.results.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official,
    ) ?? movie.videos?.results.find((v) => v.site === 'YouTube' && v.type === 'Trailer')

  // Top cast: first 10 ordered by cast order
  const topCast = movie.credits?.cast.slice(0, 10) ?? []

  return (
    <div className="min-h-screen">
      {/* ── Backdrop ── */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {backdrop ? (
          <img src={backdrop} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-secondary" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/50 to-transparent cursor-pointer" />
        {/* <div className="absolute inset-0 bg-linear-to-r from-background/20 to-transparent" /> */}
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        {/* Back button */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col md:flex-row gap-8"
        >
          {/* ── Poster ── */}
          <div className="shrink-0">
            <div className="w-48 md:w-64 mx-auto md:mx-0 overflow-hidden rounded-lg shadow-card">
              {poster ? (
                <img src={poster} alt={movie.title} className="w-full h-auto" />
              ) : (
                <div className="flex aspect-[2/3] w-full items-center justify-center bg-secondary rounded-lg">
                  <User className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>
          </div>

          {/* ── Info column ── */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
              {movie.title}
            </h1>

            {/* Tagline */}
            {movie.tagline && (
              <p className="mt-2 text-primary italic text-sm">
                &ldquo;{movie.tagline}&rdquo;
              </p>
            )}

            {/* Meta row 1 — rating / runtime / year */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {movie.vote_average > 0 && (
                <span className="flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-semibold text-foreground">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span>/ 10</span>
                </span>
              )}
              {runtime && (
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {runtime}
                </span>
              )}
              {year && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {year}
                </span>
              )}
            </div>

            {/* Genre pills */}
            {movie.genres.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {movie.genres.map((g) => (
                  <span
                    key={g.id}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={inList ? () => setPendingRemove(true) : handleWatchlist}
                className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
                  inList
                    ? 'bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground'
                    : 'gradient-gold text-primary-foreground hover:opacity-90'
                }`}
              >
                {inList ? (
                  'Remove from Watchlist'
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Add to Watchlist
                  </>
                )}
              </button>

              {trailer && (
                <motion.button
                  onClick={() => setTrailerOpen(true)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="hover-gradient-gold flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-6 py-3 text-lg font-semibold text-foreground cursor-pointer"
                >
                  <PlayCircle className="h-5 w-5" />
                  Trailer
                </motion.button>
              )}
            </div>

            {/* Overview */}
            {movie.overview && (
              <div className="mt-8">
                <p className="text-foreground/90 leading-relaxed max-w-2xl">
                  {movie.overview}
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── Top Cast ── */}
        {topCast.length > 0 && (
          <div className="mt-12 mb-16">
            <h2 className="font-display text-2xl text-foreground mb-5">
              Top Cast
            </h2>
            <div className="flex gap-5 overflow-x-auto pb-3 scrollbar-hide">
              {topCast.map((member) => {
                const photo = profileUrl(member.profile_path, 'w185')
                return (
                  <div
                    key={member.id}
                    className="flex flex-col items-center gap-2 shrink-0 w-20"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-secondary ring-2 ring-border/40 shrink-0">
                      {photo ? (
                        <img
                          src={photo}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                    <div className="text-center w-full">
                      <p className="text-xs font-semibold text-foreground leading-tight truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-muted-foreground leading-tight truncate mt-0.5">
                        {member.character}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Remove from Watchlist confirmation ── */}
      <Dialog open={pendingRemove} onOpenChange={(open) => { if (!open) setPendingRemove(false) }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Remove from Watchlist</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove{' '}
              <span className="font-semibold text-foreground">"{movie?.title}"</span>{' '}
              from your watchlist? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={() => setPendingRemove(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => { setPendingRemove(false); handleWatchlist() }}
              className="cursor-pointer"
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Trailer Modal ── */}
      <AnimatePresence>
        {trailerOpen && trailer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setTrailerOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setTrailerOpen(false)}
                className="absolute -top-10 right-0 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
                Close
              </button>
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                  title={trailer.name}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-[50vh] md:h-[60vh] bg-surface animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-48 relative z-10">
        <div className="mb-6 h-5 w-16 bg-surface animate-pulse rounded" />
        <div className="flex flex-col md:flex-row gap-8">
          <Skeleton className="w-48 md:w-64 aspect-[2/3] rounded-lg shrink-0 mx-auto md:mx-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <div className="flex gap-2 pt-1">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-20 rounded-full" />
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <Skeleton className="h-11 w-44 rounded-lg" />
              <Skeleton className="h-11 w-28 rounded-lg" />
            </div>
            <Skeleton className="h-7 w-32 mt-6" />
            <Skeleton className="h-24 w-full max-w-2xl" />
          </div>
        </div>
        <div className="mt-12">
          <Skeleton className="h-7 w-32 mb-5" />
          <div className="flex gap-5">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0 w-20">
                <Skeleton className="w-20 h-20 rounded-full" />
                <Skeleton className="h-3 w-16 rounded" />
                <Skeleton className="h-3 w-12 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
