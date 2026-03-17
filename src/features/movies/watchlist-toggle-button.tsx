import { Check, Plus } from 'lucide-react'

import { TooltipIconButton } from '#/components'
import type { TMDBMovie } from '#/lib/tmdb'

import { useWatchlistAction } from '../watchlist/hooks/use-watchlist-action'

interface WatchlistToggleButtonProps {
  movie: TMDBMovie
}

export function WatchlistToggleButton({ movie }: WatchlistToggleButtonProps) {
  const { inList, handleToggle } = useWatchlistAction(movie)

  return (
    <TooltipIconButton
      active={inList}
      icon={
        inList ? (
          <Check className="size-4" />
        ) : (
          <Plus className="size-4" />
        )
      }
      label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
      onClick={handleToggle}
    />
  )
}
