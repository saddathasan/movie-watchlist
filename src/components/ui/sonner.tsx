import { useEffect, useState } from 'react'

import { CircleCheckIcon, Loader2Icon, OctagonXIcon } from 'lucide-react'
import { Toaster as Sonner } from 'sonner'
import type { ToasterProps } from 'sonner'

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(min-width: 640px)').matches,
  )

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 640px)')
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return isDesktop
}

const Toaster = ({ ...props }: ToasterProps) => {
  const isDesktop = useIsDesktop()

  return (
    <Sonner
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-primary" />,
        error: <OctagonXIcon className="size-4 text-destructive" />,
        loading: (
          <Loader2Icon className="size-4 animate-spin text-muted-foreground" />
        ),
      }}
      offset={isDesktop ? { top: 80 } : undefined}
      position={isDesktop ? 'top-right' : 'bottom-center'}
      theme="dark"
      toastOptions={{
        classNames: {
          toast:
            'border-l-2 border-l-transparent bg-card/80 backdrop-blur-xl shadow-card rounded-[var(--radius)] border border-border',
          success: 'border-l-primary',
          error: 'border-l-destructive',
          loading: 'border-l-muted-foreground',
          title: 'font-medium text-sm text-foreground',
          description: 'text-xs text-muted-foreground',
          icon: 'mt-0.5',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
