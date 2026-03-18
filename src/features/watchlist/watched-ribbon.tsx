import { AnimatePresence, motion } from 'framer-motion'

interface WatchedRibbonProps {
  watched: boolean
}

export function WatchedRibbon({ watched }: WatchedRibbonProps) {
  return (
    <AnimatePresence>
      {watched ? (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="pointer-events-none absolute right-0 top-0 z-10 overflow-hidden rounded-tr-xl"
          exit={{ opacity: 0, scale: 0.8 }}
          initial={{ opacity: 0, scale: 0.8 }}
          style={{ width: 72, height: 72 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Diagonal ribbon clipped to the card's top-right corner triangle */}
          <div
            className="absolute flex items-center justify-center bg-primary"
            style={{
              width: 110,
              height: 22,
              top: 16,
              right: -28,
              transform: 'rotate(45deg)',
            }}
          >
            <span className="font-display text-[10px] tracking-widest text-primary-foreground">
              WATCHED
            </span>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
