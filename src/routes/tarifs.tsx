import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '~/components/landing-reachly/Nav'
import { Pricing } from '~/components/landing-reachly/Pricing'
import { Footer } from '~/components/landing-reachly/Footer'

export const Route = createFileRoute('/tarifs')({
  component: TarifsPage,
})

function TarifsPage() {
  return (
    <main className="theme-landing min-h-screen bg-canvas">
      <Nav />

      {/* La navbar est fixe, le composant Pricing inclut déjà son padding (py-24). */}
      <Pricing />

      <Footer />
    </main>
  )
}
