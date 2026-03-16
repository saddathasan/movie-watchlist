import { createFileRoute } from '@tanstack/react-router'

import { SearchContent, searchSchema } from '#/features/movies'

export const Route = createFileRoute('/search')({
  validateSearch: searchSchema,
  component: SearchPage,
})

function SearchPage() {
  const { q } = Route.useSearch()
  const navigate = Route.useNavigate()

  return (
    <SearchContent
      initialQuery={q ?? ''}
      onQueryChange={(next) =>
        navigate({ search: (prev) => ({ ...prev, q: next }), replace: true })
      }
    />
  )
}
