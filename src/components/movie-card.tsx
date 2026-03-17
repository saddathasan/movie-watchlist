import type { ReactNode } from 'react'

import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Film, Star } from 'lucide-react'

import { scaleFade, staggerDelay } from '#/lib/motion'
import { posterUrl } from '#/lib/tmdb'

export interface MovieCardProps {
  id: number
  title: string
  posterPath: string | null
  releaseDate: string
  voteAverage: number
  index?: number
  action?: ReactNode
  /** Enable layout animation — only needed when items can be removed (e.g. watchlist). Off by default for perf. */
  enableLayout?: boolean
  /** Enable exit animation — only needed inside AnimatePresence with removals. Off by default. */
  enableExit?: boolean
}

export function MovieCard({
  id,
  title,
  posterPath,
  releaseDate,
  voteAverage,
  index = 0,
  action,
  enableLayout = false,
  enableExit = false,
}: MovieCardProps) {
  const poster = posterUrl(posterPath, 'w342')
  const year = releaseDate.slice(0, 4) || 'N/A'

  return (
    <motion.div
      layout={enableLayout}
      animate={scaleFade.animate}
      className="group relative rounded-xl bg-surface shadow-card transition-transform duration-300 hover:-translate-y-1"
      exit={enableExit ? scaleFade.exit : undefined}
      initial={scaleFade.initial}
      transition={{ ...staggerDelay(index), duration: 0.35 }}
    >
      {/* Poster */}
      <Link
        className="block cursor-pointer overflow-hidden rounded-t-xl"
        params={{ id: String(id) }}
        to="/movie/$id"
      >
        <div className="relative aspect-2/3 overflow-hidden">
          {poster ? (
            <img
              alt={title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              src={poster}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-secondary">
              <Film className="size-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-t from-background/90 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        </div>
      </Link>

      {/* Rating badge */}
      {voteAverage > 0 ? (
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">
          <Star className="size-3 fill-primary text-primary" />
          {voteAverage.toFixed(1)}
        </div>
      ) : null}

      {/* Info row */}
      <div className="flex items-center gap-1 p-3">
        <div className="min-w-0 flex-1">
          <Link
            className="cursor-pointer"
            params={{ id: String(id) }}
            to="/movie/$id"
          >
            <h3 className="truncate text-sm font-semibold text-foreground transition-colors duration-200 group-hover:text-primary">
              {title}
            </h3>
          </Link>
          <p className="mt-0.5 text-xs text-muted-foreground">{year}</p>
        </div>

        {action ? action : null}
      </div>
    </motion.div>
  )
}
