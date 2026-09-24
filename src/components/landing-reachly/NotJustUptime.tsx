import { useEffect, useRef } from 'react'
import { CheckCircle2 } from 'lucide-react'
import { gsap } from '~/lib/landing-gsap'

const simpleChecks = ['GET /', 'HTTP 200', '→ considéré comme "en ligne"']

const reachlyChecks = [
  'Parcourt tout le site',
  'Ouvre chaque page',
  'Teste la navigation',
  'Clique les boutons',
  'Remplit les formulaires',
  'Relève les erreurs console',
  'Relève les erreurs réseau',
  'Vérifie le mobile',
  'Vérifie le SEO technique',
  'Capture les preuves',
]

export function NotJustUptime() {
  const cardRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const rightCol = rightColRef.current
    if (!card || !rightCol) return

    const items = Array.from(rightCol.querySelectorAll('[data-check-item]'))
    const ctx = gsap.context(() => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, scrollTrigger: { trigger: card, start: 'top 78%' } },
      )
      gsap.fromTo(
        items,
        { opacity: 0, x: -6 },
        {
          opacity: 1,
          x: 0,
          duration: 0.25,
          stagger: 0.06,
          delay: 0.2,
          scrollTrigger: { trigger: card, start: 'top 78%' },
        },
      )
    }, card)

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-20 sm:py-28 bg-canvas">
      <div className="mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl font-semibold text-ink-primary sm:text-4xl font-display leading-tight">
            Un site qui répond n'est pas un site prêt à livrer
          </h2>
          <p className="mt-4 text-lg text-ink-secondary">
            La différence entre un test de disponibilité et un vrai QA avant livraison.
          </p>
        </div>

        <div
          ref={cardRef}
          className="grid rounded-lg border border-hairline border-border-strong bg-surface overflow-hidden md:grid-cols-2"
        >
          <div className="p-8 border-b md:border-b-0 md:border-r border-hairline border-border">
            <p className="text-sm font-medium text-ink-muted mb-6">Vérification de disponibilité</p>
            <div className="space-y-3 font-mono text-sm text-ink-muted mb-8">
              {simpleChecks.map((check) => (
                <div key={check}>{check}</div>
              ))}
            </div>
            <p className="text-sm text-ink-secondary">Ne dit rien de ce que vivent vos visiteurs.</p>
          </div>

          <div ref={rightColRef} className="p-8">
            <p className="text-sm font-medium text-brand-text mb-6">Reachly</p>
            <div className="space-y-2.5 mb-8">
              {reachlyChecks.map((check) => (
                <div key={check} data-check-item className="flex items-center gap-2.5 text-sm text-ink-secondary">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  {check}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-ink-primary">Testé comme un vrai visiteur le ferait.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
