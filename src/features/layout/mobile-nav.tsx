import type { User as FirebaseUser } from 'firebase/auth'

import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { BookMarked, LogIn, LogOut, Search, User } from 'lucide-react'

import { collapse, transitions } from '#/lib/motion'

import { WatchlistBadge } from './watchlist-badge'

const baseNavLink =
  'flex items-center gap-2 px-2 py-1 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground cursor-pointer'
const activeNavLink = 'text-primary font-semibold'

interface MobileNavProps {
  user: FirebaseUser | null
  loading: boolean
  watchlistCount: number
  onSignOut: () => void
  onLogin: () => void
  onNavigate: () => void
}

export function MobileNav({
  user,
  loading,
  watchlistCount,
  onSignOut,
  onLogin,
  onNavigate,
}: MobileNavProps) {
  return (
    <motion.div
      animate={collapse.animate}
      className="overflow-hidden border-t border-border/40 bg-overlay md:hidden"
      exit={collapse.exit}
      initial={collapse.initial}
      transition={transitions.fast}
    >
      <div className="container mx-auto flex flex-col gap-1 px-4 py-3">
        <Link
          activeOptions={{ exact: true, includeSearch: false }}
          activeProps={{ className: activeNavLink }}
          className={baseNavLink}
          to="/search"
          onClick={onNavigate}
        >
          <Search className="size-4" />
          Discover Movies
        </Link>

        {user ? (
          <Link
            activeOptions={{ exact: true }}
            activeProps={{ className: activeNavLink }}
            className={baseNavLink}
            to="/watchlist"
            onClick={onNavigate}
          >
            <BookMarked className="size-4" />
            Watchlist
            <WatchlistBadge count={watchlistCount} />
          </Link>
        ) : null}

        <div className="mt-1 border-t border-border/40 pt-2">
          {!loading ? (
            user ? (
              <>
                <p className="flex items-center gap-1.5 truncate px-2 py-1 text-xs text-muted-foreground">
                  <User className="size-3 shrink-0" />
                  {user.displayName ?? user.email}
                </p>
                <button
                  className="flex w-full cursor-pointer items-center gap-2 px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-destructive"
                  onClick={onSignOut}
                >
                  <LogOut className="size-4" />
                  Logout
                </button>
              </>
            ) : (
              <button className={baseNavLink} onClick={onLogin}>
                <LogIn className="size-4" />
                Login
              </button>
            )
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}
