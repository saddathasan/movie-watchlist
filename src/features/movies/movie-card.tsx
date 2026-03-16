import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Plus, Check, Star, Film } from 'lucide-react'
import { toast } from 'sonner'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { useAuth } from '#/integrations/auth/provider'
import { posterUrl } from '#/lib/tmdb'
import type { TMDBMovie } from '#/lib/tmdb'

import { useWatchlist } from '../watchlist/hooks/use-watchlist'

interface MovieCardProps {
  movie: TMDBMovie
  index?: number
}

export function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const { user } = useAuth()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inList = isInWatchlist(movie.id)
  const poster = posterUrl(movie.poster_path, 'w342')
  const year = movie.release_date.split('-')[0] || 'N/A'

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
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
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link
        className="group block cursor-pointer"
        params={{ id: String(movie.id) }}
        to="/movie/$id"
      >
        <div className="relative overflow-hidden rounded-lg bg-surface shadow-card transition-transform duration-300 group-hover:-translate-y-1">
          {/* Poster */}
          <div className="aspect-2/3 overflow-hidden">
            {poster ? (
              <img
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
                src={poster}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <Film className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Rating badge */}
          {movie.vote_average > 0 ? (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {movie.vote_average.toFixed(1)}
            </div>
          ) : null}

          {/* Watchlist button with tooltip */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label={
                    inList ? 'Remove from watchlist' : 'Add to watchlist'
                  }
                  className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 cursor-pointer ${
                    inList
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground'
                  }`}
                  onClick={handleWatchlist}
                >
                  {inList ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{inList ? 'Remove from watchlist' : 'Add to watchlist'}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-200">
              {movie.title}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{year}</p>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export function MovieCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-surface shadow-card">
      <div className="aspect-2/3 bg-secondary animate-pulse" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-secondary animate-pulse rounded w-3/4" />
        <div className="h-3 bg-secondary animate-pulse rounded w-1/3" />
      </div>
    </div>
  )
}
