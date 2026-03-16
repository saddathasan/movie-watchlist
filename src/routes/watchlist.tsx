import { createFileRoute } from '@tanstack/react-router'

import { WatchlistPageContent } from '#/features/watchlist'

export const Route = createFileRoute('/watchlist')({
  component: WatchlistPage,
})

function WatchlistPage() {
  return <WatchlistPageContent />
}
