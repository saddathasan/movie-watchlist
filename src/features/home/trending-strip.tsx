import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight, Play } from 'lucide-react'

import { fadeUp, staggerDelay } from '#/lib/motion'
import { posterUrl } from '#/lib/tmdb'

import { useTrendingMovies } from './hooks/use-trending-movies'

export function TrendingStrip() {
  const movies = useTrendingMovies()

  if (movies.length === 0) return null

  return (
    <section className="relative -mt-20 z-20 pb-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-medium mb-1">
              This Week
            </p>
            <h2 className="font-display text-2xl lg:text-3xl text-foreground">
              Trending Films
            </h2>
          </div>
          <Link
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            to="/search"
          >
            View All <ArrowRight className="size-3" />
          </Link>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
          {movies.map((movie, i) => (
            <motion.div
              key={movie.id}
              animate={fadeUp.animate}
              className="shrink-0"
              initial={fadeUp.initial}
              transition={{ ...staggerDelay(i, 0.08), duration: 0.5 }}
            >
              <Link
                className="group block w-36 sm:w-40 lg:w-44 cursor-pointer"
                params={{ id: String(movie.id) }}
                to="/movie/$id"
              >
                <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-surface shadow-card transition-all duration-500 group-hover:shadow-glow group-hover:-translate-y-2">
                  {movie.poster_path ? (
                    <img
                      alt={movie.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      src={posterUrl(movie.poster_path, 'w342')!}
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary flex items-center justify-center">
                      <Play className="size-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <p className="text-xs font-semibold text-foreground truncate">
                      {movie.title}
                    </p>
                  </div>
                </div>

                <div className="mt-2.5 px-0.5">
                  <p className="text-xs font-medium text-foreground/80 truncate">
                    {movie.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {movie.release_date.split('-')[0]}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
