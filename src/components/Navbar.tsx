import { Link } from '@tanstack/react-router'
import {
  Film,
  Search,
  BookMarked,
  LogIn,
  LogOut,
  Menu,
  X,
  User,
} from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '#/integrations/auth/provider'
import { useWatchlist } from '#/hooks/useWatchlist'
import { useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthSheet } from '#/components/AuthSheet'

const baseNavLink =
  'flex items-center gap-2 px-2 py-1 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground cursor-pointer'
const activeNavLink = 'text-primary font-semibold'

export default function Navbar() {
  const { user, signOut, loading } = useAuth()
  const { watchlist } = useWatchlist()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authSheetOpen, setAuthSheetOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.navigate({ to: '/' })
    } catch {
      toast.error('Failed to sign out')
    }
    setMobileOpen(false)
  }

  const logoTo = user ? '/search' : '/'
  const badgeCount = watchlist.length > 99 ? '99+' : watchlist.length

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-0 z-50 border-b border-border/50 bg-overlay/80 backdrop-blur-xl"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          to={logoTo}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <Film className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-display text-2xl tracking-wider text-foreground">
            CINE<span className="text-primary">WATCH</span>
          </span>
        </Link>

        {/* Desktop — all nav + auth items on the right */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/search"
            className={baseNavLink}
            activeProps={{ className: activeNavLink }}
            activeOptions={{ exact: true }}
          >
            <Search className="h-4 w-4" />
            <span>Explore Movies</span>
          </Link>

          {user && (
            <Link
              to="/watchlist"
              className={baseNavLink}
              activeProps={{ className: activeNavLink }}
              activeOptions={{ exact: true }}
            >
              <BookMarked className="h-4 w-4" />
              <span>Watchlist</span>
              {watchlist.length > 0 && (
                <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                  {badgeCount}
                </span>
              )}
            </Link>
          )}

          {/* Divider */}
          <span className="w-px h-4 bg-border/60 shrink-0" />

          {!loading &&
            (user ? (
              <div className="flex items-center gap-3">
                <span className="hidden lg:flex items-center gap-1.5 text-sm text-muted-foreground truncate max-w-[180px]">
                  <User className="h-3.5 w-3.5 shrink-0" />
                  {user.displayName ?? user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-2 py-1 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthSheetOpen(true)}
                className={baseNavLink}
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>
            ))}
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/40 bg-overlay overflow-hidden"
          >
            <div className="container mx-auto px-4 py-3 flex flex-col gap-1">
              <Link
                to="/search"
                onClick={() => setMobileOpen(false)}
                className={baseNavLink}
                activeProps={{ className: activeNavLink }}
                activeOptions={{ exact: true }}
              >
                <Search className="h-4 w-4" />
                Search
              </Link>

              {user && (
                <Link
                  to="/watchlist"
                  onClick={() => setMobileOpen(false)}
                  className={baseNavLink}
                  activeProps={{ className: activeNavLink }}
                  activeOptions={{ exact: true }}
                >
                  <BookMarked className="h-4 w-4" />
                  Watchlist
                  {watchlist.length > 0 && (
                    <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {badgeCount}
                    </span>
                  )}
                </Link>
              )}

              <div className="pt-2 border-t border-border/40 mt-1">
                {!loading &&
                  (user ? (
                    <>
                      <p className="flex items-center gap-1.5 text-xs text-muted-foreground px-2 py-1 truncate">
                        <User className="h-3 w-3 shrink-0" />
                        {user.displayName ?? user.email}
                      </p>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-2 px-2 py-2 w-full text-sm font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => {
                        setMobileOpen(false)
                        setAuthSheetOpen(true)
                      }}
                      className={baseNavLink}
                    >
                      <LogIn className="h-4 w-4" />
                      Login
                    </button>
                  ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthSheet open={authSheetOpen} onOpenChange={setAuthSheetOpen} />
    </motion.nav>
  )
}
