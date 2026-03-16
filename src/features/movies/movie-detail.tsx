import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'

import { RemoveFromWatchlistDialog } from '#/components/remove-from-watchlist-dialog'
import { useAuth } from '#/integrations/auth/provider'
import { backdropUrl, getMovieDetails } from '#/lib/tmdb'

import { useWatchlist } from '../watchlist/hooks/use-watchlist'

import { MovieDetailBackdrop } from './movie-detail-backdrop'
import { MovieDetailCast } from './movie-detail-cast'
import { MovieDetailInfo } from './movie-detail-info'
import { MovieDetailSkeleton } from './movie-detail-skeleton'
import { MovieTrailerModal } from './movie-trailer-modal'

interface MovieDetailProps {
  movieId: number
}

export function MovieDetail({ movieId }: MovieDetailProps) {
  const { user } = useAuth()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const [trailerOpen, setTrailerOpen] = useState(false)
  const [pendingRemove, setPendingRemove] = useState(false)

  const {
    data: movie,
    isLoading,
    isError,
  } = useQuery({
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

  const handleWatchlistClick = () => {
    if (inList) {
      setPendingRemove(true)
    } else {
      void handleWatchlist()
    }
  }

  if (isLoading) return <MovieDetailSkeleton />

  if (isError || !movie) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <p className="text-destructive">Failed to load movie details.</p>
        <button
          className="cursor-pointer text-sm text-primary hover:underline"
          onClick={() => window.history.back()}
        >
          Go back
        </button>
      </div>
    )
  }

  const backdrop = backdropUrl(movie.backdrop_path, 'w1280')
  const trailer =
    movie.videos.results.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer' && v.official,
    ) ??
    movie.videos.results.find(
      (v) => v.site === 'YouTube' && v.type === 'Trailer',
    )
  const topCast = movie.credits.cast.slice(0, 10)

  return (
    <div className="min-h-screen">
      <MovieDetailBackdrop backdropSrc={backdrop} />

      <div className="relative z-10 -mt-48 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <MovieDetailInfo
          hasTrailer={trailer !== undefined}
          inList={inList}
          movie={movie}
          onTrailerClick={() => setTrailerOpen(true)}
          onWatchlistClick={handleWatchlistClick}
        />

        <MovieDetailCast cast={topCast} />
      </div>

      <RemoveFromWatchlistDialog
        open={pendingRemove}
        title={movie.title}
        onCancel={() => setPendingRemove(false)}
        onConfirm={() => {
          setPendingRemove(false)
          void handleWatchlist()
        }}
      />

      <MovieTrailerModal
        open={trailerOpen}
        trailer={trailer}
        onClose={() => setTrailerOpen(false)}
      />
    </div>
  )
}
