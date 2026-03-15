import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Search, BookmarkCheck, Star } from 'lucide-react'
import { getTrendingMovies, backdropUrl } from '#/lib/tmdb'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { data } = useQuery({
    queryKey: ['trending', 'week'],
    queryFn: () => getTrendingMovies(),
    staleTime: 1000 * 60 * 5,
  })

  const movies = data?.results ?? []
  const hero = movies.length
    ? movies[Math.floor(Math.random() * Math.min(5, movies.length))]
    : null

  const bg = hero ? backdropUrl(hero.backdrop_path, 'original') : null

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">
      {/* Background */}
      {bg && (
        <div className="absolute inset-0">
          <img src={bg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <h1 className="font-display text-6xl md:text-8xl text-foreground leading-none">
            YOUR MOVIES.<br />
            <span className="text-gold">YOUR LIST.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-lg">
            Discover, explore, and curate your perfect watchlist. Track every film that matters to you.
          </p>

          {hero && (
            <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Star className="h-4 w-4 fill-primary text-primary" />
              Now trending: <span className="text-foreground font-medium">{hero.title}</span>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/search"
              className="flex items-center gap-2 rounded-lg gradient-gold px-8 py-3.5 font-semibold text-primary-foreground hover:opacity-90 transition-opacity cursor-pointer"
            >
              <Search className="h-5 w-5" /> Explore Movies
            </Link>
            <Link
              to="/watchlist"
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-8 py-3.5 font-semibold text-foreground hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <BookmarkCheck className="h-5 w-5" /> My Watchlist
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
