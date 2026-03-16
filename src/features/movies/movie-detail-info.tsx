import { motion } from 'framer-motion'
import { Calendar, Clock, PlayCircle, Plus, Star } from 'lucide-react'

import { posterUrl } from '#/lib/tmdb'
import type { TMDBMovieDetails } from '#/lib/tmdb'

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
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-8"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      {/* Poster */}
      <div className="shrink-0">
        <div className="w-48 md:w-64 mx-auto md:mx-0 overflow-hidden rounded-lg shadow-card">
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
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold text-foreground">
                {movie.vote_average.toFixed(1)}
              </span>
              <span>/ 10</span>
            </span>
          ) : null}
          {runtime ? (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {runtime}
            </span>
          ) : null}
          {year ? (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
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
            className={`flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold transition-all duration-200 cursor-pointer ${
              inList
                ? 'bg-secondary text-secondary-foreground hover:bg-destructive hover:text-destructive-foreground'
                : 'gradient-gold text-primary-foreground hover:opacity-90'
            }`}
            onClick={onWatchlistClick}
          >
            {inList ? (
              'Remove from Watchlist'
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Watchlist
              </>
            )}
          </button>

          {hasTrailer ? (
            <motion.button
              className="hover-gradient-gold flex items-center gap-2 rounded-lg border border-white/20 bg-transparent px-6 py-3 text-lg font-semibold text-foreground cursor-pointer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onTrailerClick}
            >
              <PlayCircle className="h-5 w-5" />
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
