import { Link } from '@tanstack/react-router'
import { BookMarked, Search } from 'lucide-react'

import { EmptyState } from '#/components'
import { Button } from '#/components/ui/button'

export function WatchlistEmptyState() {
  return (
    <div className="py-32">
      <EmptyState
        action={
          <Link className="cursor-pointer" to="/search">
            <Button className="gap-2 px-8 text-base font-bold" size="lg">
              <Search className="h-4 w-4" />
              Explore Movies
            </Button>
          </Link>
        }
        description="You haven't added any movies yet. Start exploring and build your cinematic library."
        icon={<BookMarked className="h-10 w-10 text-muted-foreground" />}
        title="Your watchlist is empty"
      />
    </div>
  )
}
