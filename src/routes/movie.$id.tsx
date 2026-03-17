import { createFileRoute } from '@tanstack/react-router'

// Direct import to avoid Rollup circular chunk deps with TanStack Router code-splitting
import { MovieDetail } from '#/features/movies/movie-detail'

export const Route = createFileRoute('/movie/$id')({
  component: MovieDetail,
})
