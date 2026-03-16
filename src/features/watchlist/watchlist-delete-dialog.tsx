import { RemoveFromWatchlistDialog } from '#/components/remove-from-watchlist-dialog'

import type { WatchlistEntry } from './hooks/use-watchlist'

export interface WatchlistDeleteDialogProps {
  entry: WatchlistEntry | null
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function WatchlistDeleteDialog({
  entry,
  open,
  onCancel,
  onConfirm,
}: WatchlistDeleteDialogProps) {
  return (
    <RemoveFromWatchlistDialog
      open={open}
      title={entry?.title ?? ''}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}
