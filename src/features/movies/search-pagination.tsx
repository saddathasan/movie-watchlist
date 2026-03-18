import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

interface SearchPaginationProps {
  page: number
  totalPages: number
  isFetching: boolean
  onPageChange: (page: number) => void
}

/**
 * Compute page numbers to display, with ellipsis markers (`null`).
 * Always shows: first, last, current ± 1, with `null` for gaps.
 */
function getPageRange(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages = new Set<number>()
  pages.add(1)
  pages.add(total)
  pages.add(current)
  if (current - 1 > 0) pages.add(current - 1)
  if (current + 1 <= total) pages.add(current + 1)

  const sorted = Array.from(pages).sort((a, b) => a - b)

  const result: (number | null)[] = []
  for (let i = 0; i < sorted.length; i++) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push(null)
    }
    result.push(sorted[i])
  }
  return result
}

/** Shared size for all buttons and ellipsis slots so the row stays aligned. */
const BTN = 'size-9 p-0'
/** Ellipsis cell — same dimensions as a button, non-interactive. */
function Ellipsis({ id }: { id: string }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground"
      key={id}
    >
      &hellip;
    </span>
  )
}

export function SearchPagination({
  page,
  totalPages,
  isFetching,
  onPageChange,
}: SearchPaginationProps) {
  const range = getPageRange(page, totalPages)
  const isFirst = page === 1
  const isLast = page === totalPages

  const prevBtn = (
    <Button
      aria-label="Previous page"
      className={cn(BTN)}
      disabled={isFirst || isFetching}
      variant="outline"
      onClick={() => onPageChange(page - 1)}
    >
      <ChevronLeft className="size-4" />
    </Button>
  )

  const nextBtn = (
    <Button
      aria-label="Next page"
      className={cn(BTN)}
      disabled={isLast || isFetching}
      variant="outline"
      onClick={() => onPageChange(page + 1)}
    >
      <ChevronRight className="size-4" />
    </Button>
  )

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-2"
    >
      {prevBtn}

      {/* Mobile: just current page number between ellipses */}
      <div className="flex items-center gap-2 sm:hidden">
        {!isFirst ? <Ellipsis id="mobile-pre" /> : null}
        <Button className={BTN} disabled variant="default">
          {page}
        </Button>
        {!isLast ? <Ellipsis id="mobile-post" /> : null}
      </div>

      {/* Desktop: full numbered range */}
      <div className="hidden items-center gap-2 sm:flex">
        {range.map((p, i) =>
          p === null ? (
            <Ellipsis key={`ellipsis-${i}`} id={`ellipsis-${i}`} />
          ) : (
            <Button
              key={p}
              aria-current={p === page ? 'page' : undefined}
              className={BTN}
              disabled={isFetching}
              variant={p === page ? 'default' : 'outline'}
              onClick={() => p !== page && onPageChange(p)}
            >
              {p}
            </Button>
          ),
        )}
      </div>

      {nextBtn}
    </nav>
  )
}
