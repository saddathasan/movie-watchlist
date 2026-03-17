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
    try {
      await toggleWatchlist(movie)
      toast.success(inList ? 'Removed from watchlist' : 'Added to watchlist!')
    } catch {
      toast.error('Something went wrong. Please try again.')
    }
  }

  return { inList, handleToggle }
}
