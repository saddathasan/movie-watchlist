import { useState } from 'react'

import { Link, useRouter } from '@tanstack/react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { Film, Menu, X } from 'lucide-react'
import { toast } from 'sonner'

import { AuthSheet } from '#/features/auth'
import { useWatchlist } from '#/features/watchlist'
import { useAuth } from '#/integrations/auth/provider'
import { fadeDown } from '#/lib/motion'

import { DesktopNav } from './desktop-nav'
import { MobileNav } from './mobile-nav'

export function Navbar() {
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

  const handleLogin = () => {
    setMobileOpen(false)
    setAuthSheetOpen(true)
  }

  return (
    <motion.nav
      animate={fadeDown.animate}
      className="sticky top-0 z-50 border-b border-border/50 bg-overlay/80 backdrop-blur-xl"
      initial={fadeDown.initial}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link
          className="group flex cursor-pointer items-center gap-2"
          to={user ? '/search' : '/'}
        >
          <Film className="size-6 text-primary transition-transform duration-300 group-hover:rotate-12" />
          <span className="font-display text-2xl tracking-wider text-foreground">
            CINE<span className="text-primary">WATCH</span>
          </span>
        </Link>

        <DesktopNav
          loading={loading}
          user={user}
          watchlistCount={watchlist.length}
          onLogin={handleLogin}
          onSignOut={handleSignOut}
        />

        {/* Mobile toggle */}
        <button
          aria-label="Toggle menu"
          className="cursor-pointer rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <MobileNav
            loading={loading}
            user={user}
            watchlistCount={watchlist.length}
            onLogin={handleLogin}
            onNavigate={() => setMobileOpen(false)}
            onSignOut={handleSignOut}
          />
        ) : null}
      </AnimatePresence>

      <AuthSheet open={authSheetOpen} onOpenChange={setAuthSheetOpen} />
    </motion.nav>
  )
}
