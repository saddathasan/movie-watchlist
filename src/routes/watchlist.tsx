import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

import { WatchlistPageContent } from '#/features/watchlist'

const watchlistSchema = z.object({
  filter: z.enum(['all', 'watched', 'unwatched']).optional().default('all'),
})

export const Route = createFileRoute('/watchlist')({
  validateSearch: watchlistSchema,
  component: WatchlistPage,
})

function WatchlistPage() {
  return <WatchlistPageContent />
}
