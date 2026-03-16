import { Check, Plus } from 'lucide-react'
import { toast } from 'sonner'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useAuth } from '#/integrations/auth/provider'
import type { TMDBMovie } from '#/lib/tmdb'

import { useWatchlist } from '../watchlist/hooks/use-watchlist'

interface WatchlistToggleButtonProps {
  movie: TMDBMovie
}

export function WatchlistToggleButton({ movie }: WatchlistToggleButtonProps) {
  const { user } = useAuth()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inList = isInWatchlist(movie.id)

  const handleClick = async () => {
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

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
            className={`flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200 ${
              inList
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
            onClick={handleClick}
          >
            {inList ? (
              <Check className="h-3.5 w-3.5" />
            ) : (
              <Plus className="h-3.5 w-3.5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{inList ? 'Remove from watchlist' : 'Add to watchlist'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
