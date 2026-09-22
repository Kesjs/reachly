import { Container, Button } from './ui'

const features = [
  '3 formulaires',
  'Tests automatiques',
  'Surveillance 24/7',
  'Alertes email',
  'Diagnostic IA',
  'Détection de récupération',
]

export function Pricing() {
  return (
    <section id="prix" className="border-b border-border bg-surface/40 py-24">
      <Container>
        <div className="mx-auto max-w-[440px]">
          <div className="rounded-xl border border-border bg-canvas p-7">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <p className="font-display text-[15px] font-bold text-white">Reachly</p>
              <span className="font-mono text-[12px] text-ink-muted">Plan Monitor</span>
            </div>

            <div className="mt-5 space-y-3 font-mono text-[13.5px]">
              {features.map((f) => (
                <div key={f} className="flex items-center justify-between text-ink-secondary">
                  <span>{f}</span>
                  <span className="text-success">✓</span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-baseline justify-between border-t border-border pt-5">
              <span className="text-[14px] text-ink-secondary">Total</span>
              <span>
                <span className="font-display text-[32px] font-extrabold text-white">9€</span>
                <span className="text-[14px] text-ink-secondary"> /mois</span>
              </span>
            </div>
          </div>

          <Button href="#tester" className="mt-5 w-full">
            Commencer gratuitement
          </Button>
          <p className="mt-3 text-center text-[13px] text-ink-muted">
            7 jours gratuits · Annulez quand vous voulez
          </p>
        </div>
      </Container>
    </section>
  )
}
