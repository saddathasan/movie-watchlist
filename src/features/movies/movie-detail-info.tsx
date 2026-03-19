import { motion } from 'framer-motion'
import { Calendar, Clock, PlayCircle, Plus, Star } from 'lucide-react'

import { buttonPress, fadeUp, transitions } from '#/lib/motion'
import { posterUrl } from '#/lib/tmdb'
import type { TMDBMovieDetails } from '#/lib/tmdb'
import { cn } from '#/lib/utils'

export interface MovieDetailInfoProps {
  movie: TMDBMovieDetails
  inList: boolean
  hasTrailer: boolean
  onWatchlistClick: () => void
  onTrailerClick: () => void
}

export function MovieDetailInfo({
  movie,
  inList,
  hasTrailer,
  onWatchlistClick,
  onTrailerClick,
}: MovieDetailInfoProps) {
  const poster = posterUrl(movie.poster_path, 'w500')
  const year = movie.release_date.split('-')[0] || 'N/A'
  const runtime = movie.runtime ? `${movie.runtime} min` : null

  return (
    <motion.div
      animate={fadeUp.animate}
      className="flex flex-col md:flex-row gap-8"
      initial={fadeUp.initial}
      transition={transitions.default}
    >
      {/* Poster */}
      <div className="shrink-0">
        <div className="w-48 overflow-hidden rounded-lg shadow-card md:w-64">
          {poster ? (
            <img alt={movie.title} className="w-full h-auto" src={poster} />
          ) : (
            <div className="flex aspect-2/3 w-full items-center justify-center bg-secondary rounded-lg" />
          )}
        </div>
      </div>

      {/* Info column */}
      <div className="flex-1 min-w-0">
        <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
          {movie.title}
        </h1>

        {movie.tagline ? (
          <p className="mt-2 text-primary italic text-sm">
            &ldquo;{movie.tagline}&rdquo;
          </p>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {movie.vote_average > 0 ? (
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-primary text-primary" />
              <span className="font-semibold text-foreground">
                {movie.vote_average.toFixed(1)}
              </span>
              <span>/ 10</span>
            </span>
          ) : null}
          {runtime ? (
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              {runtime}
            </span>
          ) : null}
          {year ? (
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              {year}
            </span>
          ) : null}
        </div>

        {movie.genres.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {movie.genres.map((g) => (
              <span
                key={g.id}
                className="rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground"
              >
                {g.name}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className={cn(
              'flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer',
              inList
                ? 'bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground'
                : 'gradient-gold text-primary-foreground hover:opacity-90',
            )}
            onClick={onWatchlistClick}
          >
            {inList ? (
              'Remove from Watchlist'
            ) : (
              <>
                <Plus className="size-4" />
                Add to Watchlist
              </>
            )}
          </button>

          {hasTrailer ? (
            <motion.button
              className="hover-gradient-gold flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-6 py-3 text-lg font-semibold text-foreground cursor-pointer"
              whileHover={buttonPress.whileHover}
              whileTap={buttonPress.whileTap}
              onClick={onTrailerClick}
            >
              <PlayCircle className="size-5" />
              Trailer
            </motion.button>
          ) : null}
        </div>

        {movie.overview ? (
          <div className="mt-8">
            <p className="text-foreground/90 leading-relaxed max-w-2xl">
              {movie.overview}
            </p>
          </div>
        ) : null}
      </div>
    </motion.div>
  )
}
