import { useState } from 'react'

import { useQuery } from '@tanstack/react-query'
import { getRouteApi } from '@tanstack/react-router'
import { AlertCircle, ArrowLeft } from 'lucide-react'

import { EmptyState, RemoveFromWatchlistDialog } from '#/components'
import { Button } from '#/components/ui/button'
import { useWatchlistAction } from '#/features/watchlist'
import { backdropUrl, getMovieDetails } from '#/lib/tmdb'

import { MovieDetailBackdrop } from './movie-detail-backdrop'
import { MovieDetailCast } from './movie-detail-cast'
import { MovieDetailInfo } from './movie-detail-info'
import { MovieDetailSkeleton } from './movie-detail-skeleton'
import { MovieTrailerModal } from './movie-trailer-modal'

const routeApi = getRouteApi('/movie/$id')

const EMPTY_MOVIE = {
  id: 0,
  title: '',
  poster_path: null,
  release_date: '',
  vote_average: 0,
} as const

export function MovieDetail() {
  const { id } = routeApi.useParams()
  const movieId = parseInt(id, 10)
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

  // Hook called unconditionally — stable fallback used when movie not yet loaded.
  // The toggle is never reachable before the movie resolves (early returns below).
  const { inList, handleToggle } = useWatchlistAction(movie ?? EMPTY_MOVIE)

  const handleWatchlistClick = () => {
    if (inList) {
      setPendingRemove(true)
    } else {
      void handleToggle()
    }
  }

  if (isLoading) return <MovieDetailSkeleton />

  if (isError || !movie) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <EmptyState
          action={
            <Button variant="outline" onClick={() => window.history.back()}>
              Go back
            </Button>
          }
          description="Failed to load movie details. Please try again."
          icon={<AlertCircle className="size-10 text-destructive" />}
          title="Something went wrong"
          variant="error"
        />
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

      <div className="page-container relative z-10 -mt-48">
        <button
          className="mb-6 flex cursor-pointer items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="size-4" />
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
          void handleToggle()
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
