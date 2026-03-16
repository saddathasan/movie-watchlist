import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Film, Star, Trash2 } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { posterUrl } from '#/lib/tmdb'

import type { WatchlistEntry } from './hooks/use-watchlist'

export interface WatchlistCardProps {
  entry: WatchlistEntry
  index: number
  onDelete: () => void
}

export function WatchlistCard({ entry, index, onDelete }: WatchlistCardProps) {
  const poster = posterUrl(entry.poster_path, 'w342')
  const year = entry.release_date.slice(0, 4) || 'N/A'

  return (
    <motion.div
      layout
      animate={{ opacity: 1, scale: 1 }}
      className="group relative rounded-xl bg-surface shadow-card hover:-translate-y-1 transition-transform duration-300"
      exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
      initial={{ opacity: 0, scale: 0.92 }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
    >
      <Link
        className="block overflow-hidden rounded-t-xl cursor-pointer"
        params={{ id: String(entry.id) }}
        to="/movie/$id"
      >
        <div className="relative aspect-2/3 overflow-hidden">
          {poster ? (
            <img
              alt={entry.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              src={poster}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Film className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </Link>

      {entry.vote_average > 0 ? (
        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
          <Star className="h-3 w-3 fill-primary text-primary" />
          {entry.vote_average.toFixed(1)}
        </div>
      ) : null}

      <div className="flex items-center gap-1 p-3">
        <div className="flex-1 min-w-0">
          <Link
            className="cursor-pointer"
            params={{ id: String(entry.id) }}
            to="/movie/$id"
          >
            <h3 className="font-semibold text-sm text-foreground truncate group-hover:text-primary transition-colors duration-200">
              {entry.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-0.5">{year}</p>
        </div>

        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                aria-label={`Remove ${entry.title} from watchlist`}
                className="shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 cursor-pointer"
                onClick={onDelete}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove from watchlist</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  )
}
