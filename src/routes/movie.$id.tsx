import { createFileRoute } from '@tanstack/react-router'

import { MovieDetail } from '#/features/movies'

export const Route = createFileRoute('/movie/$id')({
  component: MovieDetailPage,
})

function MovieDetailPage() {
  const { id } = Route.useParams()
  return <MovieDetail movieId={parseInt(id, 10)} />
}
