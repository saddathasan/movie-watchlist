import { Trash2 } from 'lucide-react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'

interface DeleteButtonProps {
  title: string
  onDelete: () => void
}

export function DeleteButton({ title, onDelete }: DeleteButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={`Remove ${title} from watchlist`}
            className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-all duration-200 hover:bg-primary hover:text-primary-foreground"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove from watchlist</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
