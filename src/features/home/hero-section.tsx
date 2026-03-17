import { useEffect, useState } from 'react'

import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Star, Play } from 'lucide-react'

import { scaleIn, transitions } from '#/lib/motion'
import { backdropUrl } from '#/lib/tmdb'
import { cn } from '#/lib/utils'

import { useTrendingMovies } from './hooks/use-trending-movies'

export function HeroSection() {
  const movies = useTrendingMovies()
  const [heroIdx, setHeroIdx] = useState(0)
  // .at() returns T | undefined — allows valid null-guard below
  const hero = movies.at(heroIdx)
  const bg = hero ? backdropUrl(hero.backdrop_path, 'original') : null

  useEffect(() => {
    if (movies.length < 2) return
    const interval = setInterval(() => {
      setHeroIdx((i) => (i + 1) % Math.min(5, movies.length))
    }, 6000)
    return () => clearInterval(interval)
  }, [movies.length])

  return (
    <section className="relative h-svh -mt-16 overflow-hidden">
      {/* Background image */}
      {bg ? (
        <motion.div
          key={hero?.id}
          animate={scaleIn.animate}
          className="absolute inset-0"
          initial={scaleIn.initial}
          transition={transitions.cinematic}
        >
          <img alt="" className="h-full w-full object-cover" src={bg} />
        </motion.div>
      ) : null}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-r from-background via-background/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-background/60" />
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-linear-to-t from-background to-transparent" />

      {/* Hero content */}
      <div className="relative z-10 flex h-full items-end pb-32 lg:pb-40">
        <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
          {hero ? (
            <motion.div
              key={hero.id}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl"
              initial={{ opacity: 0, y: 30 }}
              transition={{ ...transitions.slow, delay: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5 rounded-full bg-foreground/10 backdrop-blur-sm px-3 py-1">
                  <Star className="size-3 fill-primary text-primary" />
                  <span className="text-xs font-medium text-foreground/80">
                    {hero.vote_average.toFixed(1)}
                  </span>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-primary font-medium">
                  Trending Now
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl text-foreground leading-[0.95] tracking-tight">
                {hero.title}
              </h1>

              <p className="mt-5 text-sm sm:text-base text-foreground/60 leading-relaxed line-clamp-3 max-w-md">
                {hero.overview}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <Link
                  className="flex items-center gap-2 gradient-gold rounded-full px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
                  params={{ id: String(hero.id) }}
                  to="/movie/$id"
                >
                  <Play className="size-4 fill-current" />
                  View Details
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-full border border-foreground/20 bg-foreground/5 backdrop-blur-sm px-6 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:border-foreground/40 transition-all cursor-pointer"
                  to="/search"
                >
                  Explore All
                </Link>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>

      {/* Dot navigation */}
      {movies.length > 1 ? (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {movies.slice(0, 5).map((_, i) => (
            <button
              key={i}
              className={cn(
                'h-1 rounded-full transition-all duration-500 cursor-pointer',
                i === heroIdx
                  ? 'w-8 bg-primary'
                  : 'w-3 bg-foreground/20 hover:bg-foreground/40',
              )}
              onClick={() => setHeroIdx(i)}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
