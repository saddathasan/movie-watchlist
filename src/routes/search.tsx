import { createFileRoute } from '@tanstack/react-router'

// Direct imports to avoid Rollup circular chunk deps with TanStack Router code-splitting
import { SearchContent } from '#/features/movies/search-content'
import { searchSchema } from '#/features/movies/search-schema'

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchContent,
})
