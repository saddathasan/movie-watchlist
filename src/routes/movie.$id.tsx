import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Star,
  Calendar,
  Clock,
  BookmarkPlus,
  BookmarkMinus,
  ExternalLink,
  AlertCircle,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Badge } from '#/components/ui/badge'
import { Skeleton } from '#/components/ui/skeleton'
import { Separator } from '#/components/ui/separator'
import { getMovieDetails, posterUrl, backdropUrl } from '#/lib/tmdb'
import { useAuth } from '#/integrations/auth/provider'
import { useWatchlist } from '#/hooks/useWatchlist'
import { toast } from 'sonner'

export const Route = createFileRoute('/movie/$id')({
  component: MovieDetailPage,
})

function MovieDetailPage() {
  const { id } = Route.useParams()
  const movieId = parseInt(id, 10)
  const { user } = useAuth()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()

  const { data: movie, isLoading, isError, refetch } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    staleTime: 10 * 60 * 1000,
  })

  const inList = movie ? isInWatchlist(movieId) : false

  const handleWatchlist = async () => {
    if (!user) {
      toast.error('Sign in to manage your watchlist')
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
    toast.success(inList ? 'Removed from watchlist' : 'Added to watchlist')
  }

  if (isLoading) return <MovieDetailSkeleton />

  if (isError || !movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Movie not found</h2>
        <p className="text-muted-foreground mb-6">
          We couldn't load this movie. It may have been removed or the ID is invalid.
        </p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => refetch()}>
            Try again
          </Button>
          <Link to="/search">
            <Button>Back to Search</Button>
          </Link>
        </div>
      </div>
    )
  }

  const poster = posterUrl(movie.poster_path, 'w500')
  const backdrop = backdropUrl(movie.backdrop_path, 'w1280')
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'
  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : null

  return (
    <div className="min-h-screen">
      {/* Backdrop */}
      <div className="relative h-[40vh] sm:h-[50vh] overflow-hidden">
        {backdrop ? (
          <img
            src={backdrop}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent" />

        {/* Back button */}
        <div className="absolute top-4 left-4 sm:left-6 lg:left-8">
          <Link to="/search">
            <Button variant="secondary" size="sm" className="gap-2 backdrop-blur-sm bg-background/70 hover:bg-background/90">
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="-mt-32 sm:-mt-40 relative z-10"
        >
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
            {/* Poster */}
            <div className="flex-shrink-0">
              <div className="w-44 sm:w-56 mx-auto sm:mx-0 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-border/50">
                <img
                  src={poster ?? '/placeholder-poster.svg'}
                  alt={movie.title}
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-2 sm:pt-16">
              {/* Title + tagline */}
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight mb-1">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-muted-foreground italic mb-4">
                  &ldquo;{movie.tagline}&rdquo;
                </p>
              )}

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">
                    {movie.vote_average.toFixed(1)}
                  </span>
                  <span>/ 10</span>
                  <span className="text-xs">({movie.vote_count.toLocaleString()} votes)</span>
                </span>
                <Separator orientation="vertical" className="h-4" />
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {year}
                </span>
                {runtime && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {runtime}
                    </span>
                  </>
                )}
              </div>

              {/* Genres */}
              {movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {movie.genres.map((g) => (
                    <Badge key={g.id} variant="secondary">
                      {g.name}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 mb-6">
                <Button
                  onClick={handleWatchlist}
                  variant={inList ? 'secondary' : 'default'}
                  className="gap-2"
                >
                  {inList ? (
                    <>
                      <BookmarkMinus className="w-4 h-4" />
                      Remove from Watchlist
                    </>
                  ) : (
                    <>
                      <BookmarkPlus className="w-4 h-4" />
                      Add to Watchlist
                    </>
                  )}
                </Button>
                {movie.homepage && (
                  <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Official Site
                    </Button>
                  </a>
                )}
                {movie.imdb_id && (
                  <a
                    href={`https://www.imdb.com/title/${movie.imdb_id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-1.5">
                      <span className="font-bold text-yellow-500">IMDb</span>
                    </Button>
                  </a>
                )}
              </div>

              {/* Overview */}
              {movie.overview && (
                <div>
                  <h2 className="font-semibold mb-2">Overview</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Release date full */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <InfoCard label="Release Date" value={movie.release_date || '—'} />
            <InfoCard label="Status" value={movie.status} />
            {movie.budget > 0 && (
              <InfoCard label="Budget" value={`$${(movie.budget / 1_000_000).toFixed(1)}M`} />
            )}
            {movie.revenue > 0 && (
              <InfoCard label="Revenue" value={`$${(movie.revenue / 1_000_000).toFixed(1)}M`} />
            )}
          </div>

          {/* Production companies */}
          {movie.production_companies.length > 0 && (
            <div className="mt-8 mb-10">
              <h2 className="font-semibold mb-3">Production</h2>
              <div className="flex flex-wrap gap-2">
                {movie.production_companies.map((c) => (
                  <Badge key={c.id} variant="outline">
                    {c.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-card border border-border/50 rounded-xl p-4">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  )
}

function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-[40vh] sm:h-[50vh] bg-muted animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 sm:-mt-40">
        <div className="flex flex-col sm:flex-row gap-6 sm:gap-8">
          <Skeleton className="w-44 sm:w-56 aspect-[2/3] rounded-2xl flex-shrink-0 mx-auto sm:mx-0" />
          <div className="flex-1 pt-2 sm:pt-16 space-y-3">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <div className="flex gap-2 pt-2">
              {[1, 2, 3].map((i) => <Skeleton key={i} className="h-6 w-16 rounded-full" />)}
            </div>
            <Skeleton className="h-10 w-48 mt-2" />
            <Skeleton className="h-24 w-full mt-4" />
          </div>
        </div>
      </div>
    </div>
  )
}
