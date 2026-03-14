import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Plus, Check, Star, Film } from 'lucide-react'
import { posterUrl, type TMDBMovie } from '#/lib/tmdb'
import { useAuth } from '#/integrations/auth/provider'
import { useWatchlist } from '#/hooks/useWatchlist'
import { toast } from 'sonner'

interface MovieCardProps {
  movie: TMDBMovie
  index?: number
}

export function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const { user } = useAuth()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inList = isInWatchlist(movie.id)
  const poster = posterUrl(movie.poster_path, 'w342')
  const year = movie.release_date?.split('-')[0] || 'N/A'

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
    >
      <Link to="/movie/$id" params={{ id: String(movie.id) }} className="group block">
        <div className="relative overflow-hidden rounded-lg bg-surface shadow-card transition-all duration-300 group-hover:shadow-glow group-hover:-translate-y-1">
          {/* Poster */}
          <div className="aspect-[2/3] overflow-hidden">
            {poster ? (
              <img
                src={poster}
                alt={movie.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-secondary">
                <Film className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          {/* Rating badge */}
          {movie.vote_average > 0 && (
            <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
              <Star className="h-3 w-3 fill-primary text-primary" />
              {movie.vote_average.toFixed(1)}
            </div>
          )}

          {/* Watchlist button */}
          <button
            onClick={handleWatchlist}
            className={`absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all duration-200 ${
              inList
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 text-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
            aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inList ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </button>

          {/* Info */}
          <div className="p-3">
            <h3 className="font-semibold text-sm text-foreground truncate">{movie.title}</h3>
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
      <div className="aspect-[2/3] bg-secondary animate-pulse" />
      <div className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-secondary animate-pulse rounded w-3/4" />
        <div className="h-3 bg-secondary animate-pulse rounded w-1/3" />
      </div>
    </div>
  )
}
