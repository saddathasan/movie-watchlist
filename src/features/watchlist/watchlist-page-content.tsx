import { Link } from '@tanstack/react-router'
import { BookMarked, LogIn } from 'lucide-react'

import { EmptyState } from '#/components'
import { Button } from '#/components/ui/button'
import { useAuth } from '#/integrations/auth/provider'

import { AuthenticatedWatchlist } from './authenticated-watchlist'
import { WatchlistSkeleton } from './watchlist-skeleton'

export function WatchlistPageContent() {
  const { user, loading: authLoading } = useAuth()

  if (authLoading) return <WatchlistSkeleton />

  if (!user) {
    return (
      <div className="page-container py-20 text-center">
        <EmptyState
          action={
            <Link className="cursor-pointer" to="/">
              <Button className="gap-2">
                <LogIn className="size-4" />
                Sign in
              </Button>
            </Link>
          }
          description="Your watchlist is saved per account. Sign in to access your saved movies from any device."
          icon={<BookMarked className="size-10 text-muted-foreground" />}
          title="Sign in to see your Watchlist"
        />
      </div>
    )
  }

  return <AuthenticatedWatchlist />
}
