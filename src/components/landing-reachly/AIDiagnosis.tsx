import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap } from '~/lib/landing-gsap'

export function AIDiagnosis() {
  const cardRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const arrow = arrowRef.current
    if (!card) return

    const observed = card.querySelector('[data-observed]')
    const diagnosis = card.querySelector('[data-diagnosis]')

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 75%' } })
      tl.fromTo(card, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.4 })
      if (observed) tl.fromTo(observed, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.35 }, 0.15)
      if (arrow) tl.fromTo(arrow, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(2)' }, 0.5)
      if (diagnosis) tl.fromTo(diagnosis, { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.35 }, 0.65)
    }, card)

    return () => ctx.revert()
  }, [])

  return (
    <section className="py-20 sm:py-28 bg-surface border-y border-hairline border-border">
      <div className="mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <h2 className="text-3xl font-semibold text-ink-primary sm:text-4xl font-display leading-tight">
            La preuve d'abord. L'explication ensuite.
          </h2>
          <p className="mt-4 text-lg text-ink-secondary">
            Reachly observe réellement ce qui se passe sur votre site, puis l'IA vous explique
            le problème — elle n'invente jamais un fait technique qui n'a pas été mesuré.
          </p>
        </div>

        <div
          ref={cardRef}
          className="grid items-stretch gap-0 rounded-lg border border-hairline border-border-strong bg-canvas overflow-hidden lg:grid-cols-[1fr_auto_1.3fr]"
        >
          <div data-observed className="p-7">
            <p className="text-xs font-mono text-ink-muted mb-4">observé pendant le test</p>
            <div className="space-y-2 font-mono text-sm rounded-md bg-surface border border-hairline border-border p-4">
              <div className="text-ink-muted">POST /api/contact</div>
              <div className="text-danger font-medium">HTTP 500</div>
              <div className="text-ink-muted">3 tentatives, même résultat</div>
            </div>
          </div>

          <div ref={arrowRef} className="hidden lg:flex items-center justify-center border-x border-hairline border-border px-4">
            <ArrowRight className="h-5 w-5 text-ink-muted" />
          </div>

          <div data-diagnosis className="p-7 border-t lg:border-t-0 border-hairline border-border">
            <p className="text-xs font-mono text-brand-text mb-4">diagnostic Reachly</p>
            <p className="text-ink-primary leading-relaxed mb-4">
              Le formulaire de contact envoie correctement la requête, mais le serveur échoue en
              la traitant — pas un problème d'interface, un problème d'API.
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
              <div>
                <span className="text-ink-muted">À vérifier : </span>
                <span className="font-mono text-ink-secondary">/api/contact</span>
              </div>
              <div>
                <span className="text-ink-muted">Piste : </span>
                <span className="text-ink-secondary">logs serveur et dernier déploiement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
