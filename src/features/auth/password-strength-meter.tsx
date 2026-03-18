import { useMemo } from 'react'

import { motion } from 'framer-motion'

import { collapse, transitions } from '#/lib/motion'
import { cn } from '#/lib/utils'

import { getPasswordStrength } from './password-strength'

export function PasswordStrengthMeter({ password }: { password: string }) {
  const { score, label, labelColor, barColor } = useMemo(
    () => getPasswordStrength(password),
    [password],
  )

  if (!password) return null

  return (
    <motion.div
      animate={collapse.animate}
      className="space-y-1.5 pt-1"
      exit={collapse.exit}
      initial={collapse.initial}
      transition={transitions.fast}
    >
      <div className="flex items-center gap-1.5">
        {([1, 2, 3, 4] as const).map((seg) => (
          <div
            key={seg}
            className="h-1 flex-1 overflow-hidden rounded-full bg-border/40"
          >
            <div
              className={cn(
                'h-full rounded-full transition-all duration-300 ease-out',
                score >= seg ? barColor : 'bg-transparent',
              )}
              style={{ width: score >= seg ? '100%' : '0%' }}
            />
          </div>
        ))}
        <span
          className={cn(
            'w-12 shrink-0 text-right font-form text-[11px] font-medium transition-colors duration-300',
            labelColor,
          )}
        >
          {label}
        </span>
      </div>
      <p className="font-form text-[11px] text-muted-foreground/70">
        Use 8+ chars, uppercase, number &amp; symbol for a strong password
      </p>
    </motion.div>
  )
}
