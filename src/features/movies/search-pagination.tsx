import { Button } from '#/components/ui/button'

interface SearchPaginationProps {
  page: number
  totalPages: number
  isFetching: boolean
  compact?: boolean
  onPageChange: (page: number) => void
}

export function SearchPagination({
  page,
  totalPages,
  isFetching,
  compact = false,
  onPageChange,
}: SearchPaginationProps) {
  const capped = Math.min(totalPages, 500)

  const handlePrev = () => {
    onPageChange(Math.max(1, page - 1))
    if (!compact) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleNext = () => {
    onPageChange(Math.min(totalPages, page + 1))
    if (!compact) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Button
          disabled={page === 1 || isFetching}
          size="sm"
          variant="outline"
          onClick={handlePrev}
        >
          Prev
        </Button>
        <span className="text-muted-foreground">
          {page} / {capped}
        </span>
        <Button
          disabled={page >= totalPages || isFetching}
          size="sm"
          variant="outline"
          onClick={handleNext}
        >
          Next
        </Button>
      </div>
    )
  }

  return (
    <div className="mt-10 flex justify-center gap-2">
      <Button
        disabled={page === 1 || isFetching}
        variant="outline"
        onClick={handlePrev}
      >
        Previous
      </Button>
      <span className="flex items-center px-4 text-sm text-muted-foreground">
        Page {page} of {capped}
      </span>
      <Button
        disabled={page >= totalPages || isFetching}
        variant="outline"
        onClick={handleNext}
      >
        Next
      </Button>
    </div>
  )
}
