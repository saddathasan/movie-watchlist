import { useEffect } from 'react'

import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

import { fadeIn, scaleFade, transitions } from '#/lib/motion'
import type { TMDBVideo } from '#/lib/tmdb'

interface MovieTrailerModalProps {
  open: boolean
  trailer: TMDBVideo | undefined
  onClose: () => void
}

export function MovieTrailerModal({
  open,
  trailer,
  onClose,
}: MovieTrailerModalProps) {
  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  const showModal = open && !!trailer

  return (
    <AnimatePresence>
      {showModal ? (
        <motion.div
          animate={fadeIn.animate}
          aria-label={trailer.name}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          exit={fadeIn.exit}
          initial={fadeIn.initial}
          role="dialog"
          transition={transitions.fast}
          onClick={onClose}
        >
          <motion.div
            animate={scaleFade.animate}
            className="relative w-full max-w-3xl"
            exit={scaleFade.exit}
            initial={scaleFade.initial}
            transition={transitions.fast}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
              onClick={onClose}
            >
              <X className="size-4" />
              Close
            </button>
            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="h-full w-full"
                src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
                title={trailer.name}
              />
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
