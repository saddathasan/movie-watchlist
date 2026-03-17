import { toast } from 'sonner'

import { useAuth } from '#/integrations/auth/provider'
import type { TMDBMovie } from '#/lib/tmdb'

import { useWatchlist } from './use-watchlist'

type WatchlistMovieInput = Pick<
  TMDBMovie,
  'id' | 'title' | 'poster_path' | 'release_date' | 'vote_average'
>

export function useWatchlistAction(movie: WatchlistMovieInput) {
  const { user } = useAuth()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inList = isInWatchlist(movie.id)

  const handleToggle = async () => {
    if (!user) {
      toast.error('Please log in to use your watchlist')
      return
    }
    await toggleWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    })
    toast.success(inList ? 'Removed from watchlist' : 'Added to watchlist!')
  }

  return { inList, handleToggle }
}
