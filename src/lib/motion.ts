import type { Transition, Variants } from 'framer-motion'

// ─── Transition presets ───────────────────────────────────────

export const transitions = {
  fast: { duration: 0.2 } satisfies Transition,
  default: { duration: 0.4 } satisfies Transition,
  medium: { duration: 0.5 } satisfies Transition,
  slow: { duration: 0.8 } satisfies Transition,
  cinematic: { duration: 1.2, ease: 'easeOut' } satisfies Transition,
} as const

/** Index-based stagger delay for list items. */
export function staggerDelay(index: number, step = 0.04): Transition {
  return { delay: index * step }
}

// ─── Variant presets ──────────────────────────────────────────

/** Fade in from below. Default y offset = 20. */
export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
} satisfies Variants

/** Fade in from above. Default y offset = -20. */
export const fadeDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
} satisfies Variants

/** Simple opacity fade with enter + exit. */
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
} satisfies Variants

/** Scale + opacity enter/exit (modal, card). */
export const scaleFade = {
  initial: { opacity: 0, scale: 0.92 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.85, transition: transitions.fast },
} satisfies Variants

/** Cinematic scale-down for hero backgrounds. */
export const scaleIn = {
  initial: { opacity: 0, scale: 1.05 },
  animate: { opacity: 1, scale: 1 },
} satisfies Variants

/** Height auto-expand with opacity (accordions, reveals). */
export const collapse = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
} satisfies Variants

/** Content swap: enter from below, exit upward. */
export const fadeSwap = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
} satisfies Variants

// ─── Interaction presets ──────────────────────────────────────

export const buttonPress = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
} as const
