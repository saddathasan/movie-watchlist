import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BookMarked, LogIn } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { useAuth } from '#/integrations/auth/provider'

import { AuthenticatedWatchlist } from './authenticated-watchlist'
import { WatchlistSkeleton } from './watchlist-skeleton'

export function WatchlistPageContent() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) return <WatchlistSkeleton />

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm mx-auto"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted mx-auto mb-4">
            <BookMarked className="w-8 h-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Sign in to see your Watchlist
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Your watchlist is saved per account. Sign in to access your saved
            movies from any device.
          </p>
          <Link className="cursor-pointer" to="/">
            <Button className="gap-2">
              <LogIn className="w-4 h-4" />
              Sign in
            </Button>
          </Link>
        </motion.div>
      </div>
    )
  }

  return <AuthenticatedWatchlist />
}
