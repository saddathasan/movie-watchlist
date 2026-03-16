import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BookMarked, Search } from 'lucide-react'

import { Button } from '#/components/ui/button'

export function WatchlistEmptyState() {
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      className="py-32 flex flex-col items-center text-center max-w-lg mx-auto bg-card/50 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm"
      initial={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex items-center justify-center w-24 h-24 rounded-3xl bg-muted mb-8">
        <BookMarked className="w-12 h-12 text-muted-foreground" />
      </div>
      <h2 className="font-display text-3xl text-foreground mb-4">
        Your watchlist is empty
      </h2>
      <p className="text-muted-foreground text-lg mb-8 px-8">
        You haven't added any movies yet. Start exploring and build your
        cinematic library.
      </p>
      <Link className="cursor-pointer" to="/search">
        <Button className="px-8 font-bold text-base gap-2" size="lg">
          <Search className="w-4 h-4" />
          Explore Movies
        </Button>
      </Link>
    </motion.div>
  )
}
