import type { ReactNode } from 'react'

import { motion } from 'framer-motion'

export interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action: ReactNode
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-muted">
        {icon}
      </div>
      <h2 className="mb-3 text-2xl font-semibold text-foreground">{title}</h2>
      <p className="mb-8 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
      {action}
    </motion.div>
  )
}
