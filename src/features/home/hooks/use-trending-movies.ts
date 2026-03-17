import { useQuery } from '@tanstack/react-query'

import { getTrendingMovies } from '#/lib/tmdb'

export function useTrendingMovies() {
  const { data } = useQuery({
    queryKey: ['trending', 'week'],
    queryFn: () => getTrendingMovies(1),
    staleTime: 1000 * 60 * 5,
  })
  return data?.results.slice(0, 8) ?? []
}
