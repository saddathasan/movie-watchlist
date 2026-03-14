import { Link, useRouter } from '@tanstack/react-router'
import { Film, Search, BookMarked, LogIn, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '#/components/ui/button'
import { useAuth } from '#/integrations/auth/provider'
import { toast } from 'sonner'

export default function Navbar() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success('Signed out successfully')
      router.navigate({ to: '/search' })
    } catch {
      toast.error('Failed to sign out')
    }
    setMobileOpen(false)
  }

  const navLinks = [
    { to: '/search', label: 'Search', icon: Search },
    ...(user ? [{ to: '/watchlist', label: 'Watchlist', icon: BookMarked }] : []),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to="/search"
            className="flex items-center gap-2 group"
          >
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">
              CineWatch
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all duration-200 [&.active]:text-foreground [&.active]:bg-accent"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {!loading && (
              user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground truncate max-w-[160px]">
                    {user.email}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign out
                  </Button>
                </div>
              ) : (
                <Link to="/login">
                  <Button size="sm" className="gap-2">
                    <LogIn className="w-4 h-4" />
                    Sign in
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border/40 bg-background overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-1">
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all [&.active]:text-foreground [&.active]:bg-accent"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
              <div className="pt-2 border-t border-border/40 mt-1">
                {!loading && (
                  user ? (
                    <>
                      <p className="text-xs text-muted-foreground px-3 py-1 truncate">{user.email}</p>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-all"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground bg-primary/10 hover:bg-primary/20 transition-all"
                    >
                      <LogIn className="w-4 h-4" />
                      Sign in
                    </Link>
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
