import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

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
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onCancel()
      }}
    >
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Remove from Watchlist</DialogTitle>
          <DialogDescription>
            Are you sure you want to remove{' '}
            <span className="font-semibold text-foreground">
              "{entry?.title}"
            </span>{' '}
            from your watchlist? This cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-3 pt-2">
          <Button className="cursor-pointer" variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            className="cursor-pointer"
            variant="destructive"
            onClick={onConfirm}
          >
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
