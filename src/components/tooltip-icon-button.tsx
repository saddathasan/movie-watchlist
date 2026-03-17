import type { ReactNode } from 'react'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '#/components/ui/tooltip'
import { cn } from '#/lib/utils'

export interface TooltipIconButtonProps {
  label: string
  icon: ReactNode
  active?: boolean
  onClick: () => void
}

export function TooltipIconButton({
  label,
  icon,
  active = false,
  onClick,
}: TooltipIconButtonProps) {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            aria-label={label}
            className={cn(
              'flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-all duration-200',
              active
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-primary hover:text-primary-foreground',
            )}
            onClick={onClick}
          >
            {icon}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
