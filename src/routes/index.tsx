import { createFileRoute } from '@tanstack/react-router'

import { HeroSection, TrendingStrip } from '#/features/home'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  return (
    <div className="relative">
      <HeroSection />
      <TrendingStrip />
    </div>
  )
}
