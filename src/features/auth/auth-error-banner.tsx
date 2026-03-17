import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'

import { collapse, transitions } from '#/lib/motion'

interface AuthErrorBannerProps {
  error: string | null
}

export function AuthErrorBanner({ error }: AuthErrorBannerProps) {
  if (!error) return null

  return (
    <motion.div
      animate={collapse.animate}
      className="flex items-center gap-2 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive"
      exit={collapse.exit}
      initial={collapse.initial}
      transition={transitions.fast}
    >
      <AlertCircle className="size-4 flex-shrink-0" />
      <span className="font-form">{error}</span>
    </motion.div>
  )
}
