import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

import { fadeUp, transitions } from '#/lib/motion'
import { cn } from '#/lib/utils'

export interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  variant?: 'default' | 'error'
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <motion.div
      animate={fadeUp.animate}
      className="flex flex-col items-center text-center"
      initial={fadeUp.initial}
      transition={transitions.default}
    >
      <div
        className={cn(
          'mb-6 flex size-20 items-center justify-center rounded-3xl',
          variant === 'error' ? 'bg-destructive/10' : 'bg-muted',
        )}
      >
        {icon}
      </div>
      <h2 className="mb-3 text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action ? action : null}
    </motion.div>
  )
}
