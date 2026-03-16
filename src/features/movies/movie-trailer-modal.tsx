import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

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
  return (
    <AnimatePresence>
      {open && trailer ? (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="relative w-full max-w-3xl"
            exit={{ opacity: 0, scale: 0.92 }}
            initial={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-10 right-0 flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors cursor-pointer"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
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
