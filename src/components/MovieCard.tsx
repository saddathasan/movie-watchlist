import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BookmarkPlus, BookmarkMinus, Star, Calendar } from 'lucide-react'
import { Card, CardContent } from '#/components/ui/card'
import { Badge } from '#/components/ui/badge'
import { Button } from '#/components/ui/button'
import { posterUrl, type TMDBMovie } from '#/lib/tmdb'
import { useAuth } from '#/integrations/auth/provider'
import { useWatchlist } from '#/hooks/useWatchlist'
import { toast } from 'sonner'

interface MovieCardProps {
  movie: TMDBMovie
  index?: number
}

const PLACEHOLDER = '/placeholder-poster.svg'

export function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const { user } = useAuth()
  const { isInWatchlist, toggleWatchlist } = useWatchlist()
  const inList = isInWatchlist(movie.id)
  const poster = posterUrl(movie.poster_path, 'w342')
  const year = movie.release_date ? movie.release_date.slice(0, 4) : '—'
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'

  const handleWatchlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Sign in to manage your watchlist')
      return
    }
    await toggleWatchlist({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      release_date: movie.release_date,
      vote_average: movie.vote_average,
    })
    toast.success(inList ? 'Removed from watchlist' : 'Added to watchlist')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group overflow-hidden border-border/50 bg-card hover:shadow-xl hover:shadow-black/10 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col p-0">
        {/* Poster */}
        <Link to="/movie/$id" params={{ id: String(movie.id) }} className="block relative overflow-hidden aspect-[2/3] flex-shrink-0">
          <img
            src={poster ?? PLACEHOLDER}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = PLACEHOLDER
            }}
          />
          {/* Rating badge */}
          <div className="absolute top-2 left-2">
            <Badge className="gap-1 bg-black/70 text-white border-0 backdrop-blur-sm text-xs">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              {rating}
            </Badge>
          </div>
          {/* Watchlist overlay */}
          <motion.button
            onClick={handleWatchlist}
            whileTap={{ scale: 0.9 }}
            className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-sm transition-all duration-200 ${
              inList
                ? 'bg-primary text-primary-foreground'
                : 'bg-black/50 text-white hover:bg-primary hover:text-primary-foreground'
            }`}
            aria-label={inList ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {inList ? (
              <BookmarkMinus className="w-4 h-4" />
            ) : (
              <BookmarkPlus className="w-4 h-4" />
            )}
          </motion.button>
        </Link>

        {/* Info */}
        <CardContent className="p-3 flex flex-col flex-1 gap-2">
          <Link to="/movie/$id" params={{ id: String(movie.id) }}>
            <h3 className="font-semibold text-sm leading-tight line-clamp-2 hover:text-primary transition-colors">
              {movie.title}
            </h3>
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-auto">
            <Calendar className="w-3 h-3" />
            <span>{year}</span>
          </div>
          <Link to="/movie/$id" params={{ id: String(movie.id) }}>
            <Button variant="secondary" size="sm" className="w-full text-xs h-7 mt-1">
              View Details
            </Button>
          </Link>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export function MovieCardSkeleton() {
  return (
    <Card className="overflow-hidden border-border/50 p-0">
      <div className="aspect-[2/3] bg-muted animate-pulse" />
      <CardContent className="p-3 flex flex-col gap-2">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-7 bg-muted animate-pulse rounded mt-1" />
      </CardContent>
    </Card>
  )
}
