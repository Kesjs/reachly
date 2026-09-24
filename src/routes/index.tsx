import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '~/components/landing-reachly/Nav'
import { Hero } from '~/components/landing-reachly/Hero'
import { Problem } from '~/components/landing-reachly/Problem'
import { HowItWorks } from '~/components/landing-reachly/HowItWorks'
import { NotJustUptime } from '~/components/landing-reachly/NotJustUptime'
import { AIDiagnosis } from '~/components/landing-reachly/AIDiagnosis'
import { Pricing } from '~/components/landing-reachly/Pricing'
import { FAQ } from '~/components/landing-reachly/FAQ'
import { FinalCTA, Footer } from '~/components/landing-reachly/FinalCTA'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main className="theme-landing min-h-screen bg-canvas">
      <Nav />
      <Hero />
      <div className="bg-canvas">
        <Problem />
        <HowItWorks />
        <NotJustUptime />
        <AIDiagnosis />
        <Pricing />
        <FAQ />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  )
}
