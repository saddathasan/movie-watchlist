import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Play, Star } from 'lucide-react'
import { getTrendingMovies, backdropUrl, posterUrl } from '#/lib/tmdb'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { data } = useQuery({
    queryKey: ['trending', 'week'],
    queryFn: () => getTrendingMovies(),
    staleTime: 1000 * 60 * 5,
  })

  const movies = data?.results.slice(0, 8) ?? []
  const [heroIdx, setHeroIdx] = useState(0)
  const hero = movies[heroIdx] ?? null
  const bg = hero ? backdropUrl(hero.backdrop_path, 'original') : null

  // Auto-cycle hero every 6s
  useEffect(() => {
    if (movies.length < 2) return
    const interval = setInterval(() => {
      setHeroIdx((i) => (i + 1) % Math.min(5, movies.length))
    }, 6000)
    return () => clearInterval(interval)
  }, [movies.length])

  return (
    <div className="relative">
      {/* ── Hero Section ── */}
      <section className="relative h-svh -mt-16 overflow-hidden">
        {/* Background image — keyed on hero.id so Framer Motion re-animates on each change */}
        {bg && (
          <motion.div
            key={hero?.id}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img src={bg} alt="" className="h-full w-full object-cover" />
          </motion.div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/30 to-background/60" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent" />

        {/* Hero content — anchored to bottom */}
        <div className="relative z-10 flex h-full items-end pb-32 lg:pb-40">
          <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
            {hero && (
              <motion.div
                key={hero.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="max-w-xl"
              >
                {/* Eyebrow */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1.5 rounded-full bg-foreground/10 backdrop-blur-sm px-3 py-1">
                    <Star className="h-3 w-3 fill-primary text-primary" />
                    <span className="text-xs font-medium text-foreground/80">
                      {hero.vote_average.toFixed(1)}
                    </span>
                  </div>
                  <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                    Trending Now
                  </span>
                </div>

                {/* Title */}
                <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-foreground leading-[0.95] tracking-tight">
                  {hero.title}
                </h1>

                {/* Overview */}
                <p className="mt-5 text-sm sm:text-base text-foreground/60 leading-relaxed line-clamp-3 max-w-md">
                  {hero.overview}
                </p>

                {/* CTAs */}
                <div className="mt-8 flex items-center gap-4">
                  <Link
                    to="/movie/$id"
                    params={{ id: String(hero.id) }}
                    className="flex items-center gap-2 gradient-gold rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    View Details
                  </Link>
                  <Link
                    to="/search"
                    className="flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 backdrop-blur-sm px-6 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer"
                  >
                    Explore All
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Dot navigation */}
        {movies.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {movies.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIdx(i)}
                className={`h-1 rounded-full transition-all duration-500 cursor-pointer ${
                  i === heroIdx
                    ? 'w-8 bg-primary'
                    : 'w-3 bg-foreground/20 hover:bg-foreground/40'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── Trending Strip ── */}
      {movies.length > 0 && (
        <section className="relative -mt-20 z-20 pb-16">
          <div className="mx-auto max-w-7xl px-4 lg:px-8">
            {/* Section heading */}
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
                to="/search"
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Horizontal scroll row */}
            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
              {movies.map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="shrink-0"
                >
                  <Link
                    to="/movie/$id"
                    params={{ id: String(movie.id) }}
                    className="group block w-36 sm:w-40 lg:w-44 cursor-pointer"
                  >
                    {/* Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-surface shadow-card transition-all duration-500 group-hover:shadow-glow group-hover:-translate-y-2">
                      {movie.poster_path ? (
                        <img
                          src={posterUrl(movie.poster_path, 'w342')!}
                          alt={movie.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-full w-full bg-secondary flex items-center justify-center">
                          <Play className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      {/* Hover overlay + title slide-up */}
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                        <p className="text-xs font-semibold text-foreground truncate">
                          {movie.title}
                        </p>
                      </div>
                    </div>

                    {/* Below poster */}
                    <div className="mt-2.5 px-0.5">
                      <p className="text-xs font-medium text-foreground/80 truncate">
                        {movie.title}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {movie.release_date?.split('-')[0]}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
