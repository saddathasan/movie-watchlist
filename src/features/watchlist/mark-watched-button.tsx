import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { Switch } from '#/components/ui/switch'

interface MarkWatchedButtonProps {
  movieId: number
  title: string
  watched: boolean
  onToggle: (movieId: number, watched: boolean) => void
}

export function MarkWatchedButton({
  movieId,
  title,
  watched,
  onToggle,
}: MarkWatchedButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex size-7 shrink-0 cursor-pointer items-center justify-center">
            <Switch
              aria-label={
                watched
                  ? `Unmark "${title}" as watched`
                  : `Mark "${title}" as watched`
              }
              checked={watched}
              size="sm"
              onCheckedChange={(checked) => onToggle(movieId, checked)}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{watched ? 'Mark as unwatched' : 'Mark as watched'}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
