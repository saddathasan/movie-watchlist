import type { User as FirebaseUser } from 'firebase/auth'

import { Link } from '@tanstack/react-router'
import { BookMarked, LogIn, LogOut, Search, User } from 'lucide-react'

import { WatchlistBadge } from './watchlist-badge'

const baseNavLink =
  'flex items-center gap-2 px-2 py-1 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground cursor-pointer'
const activeNavLink = 'text-primary font-semibold'

interface DesktopNavProps {
  user: FirebaseUser | null
  loading: boolean
  watchlistCount: number
  onSignOut: () => void
  onLogin: () => void
}

export function DesktopNav({
  user,
  loading,
  watchlistCount,
  onSignOut,
  onLogin,
}: DesktopNavProps) {
  return (
    <div className="hidden items-center gap-4 md:flex">
      <Link
        activeOptions={{ exact: true }}
        activeProps={{ className: activeNavLink }}
        className={baseNavLink}
        to="/search"
      >
        <Search className="size-4" />
        <span>Discover Movies</span>
      </Link>

      {user ? (
        <Link
          activeOptions={{ exact: true }}
          activeProps={{ className: activeNavLink }}
          className={baseNavLink}
          to="/watchlist"
        >
          <BookMarked className="size-4" />
          <span>Watchlist</span>
          <WatchlistBadge count={watchlistCount} />
        </Link>
      ) : null}

      <span className="h-4 w-px shrink-0 bg-border/60" />

      {!loading ? (
        user ? (
          <div className="flex items-center gap-3">
            <span className="hidden max-w-[180px] items-center gap-1.5 truncate text-sm text-muted-foreground lg:flex">
              <User className="size-3.5 shrink-0" />
              {user.displayName ?? user.email}
            </span>
            <button
              className="flex cursor-pointer items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
              onClick={onSignOut}
            >
              <LogOut className="size-4" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button className={baseNavLink} onClick={onLogin}>
            <LogIn className="size-4" />
            <span>Login</span>
          </button>
        )
      ) : null}
    </div>
  )
}
