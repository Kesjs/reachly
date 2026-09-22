import { Container, Button, Eyebrow } from './ui'

function ReportMockup() {
  const checks = ['Page accessible', 'Champs fonctionnels', 'Soumission réussie', 'Confirmation reçue']
  return (
    <div className="relative w-full max-w-[420px]">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="font-display text-[15px] font-bold text-white">Reachly</span>
          <span className="flex items-center gap-1.5 text-[12px] text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
            Formulaire surveillé
          </span>
        </div>
        <p className="mt-4 font-mono text-[13px] text-ink-secondary">mycompany.com/contact</p>
        <ul className="mt-4 space-y-2.5">
          {checks.map((c) => (
            <li key={c} className="flex items-center gap-2.5 text-[14px] text-ink-primary">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success/15 text-[11px] text-success">
                ✓
              </span>
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-border pt-4 text-[13px]">
          <div>
            <p className="text-ink-muted">Dernier test</p>
            <p className="mt-0.5 text-ink-primary">Aujourd&rsquo;hui · 14:32</p>
          </div>
          <div>
            <p className="text-ink-muted">Prochain test</p>
            <p className="mt-0.5 text-ink-primary">Dans 58 min</p>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-6 hidden w-64 rounded-xl border border-border bg-elevated p-3.5 shadow-[0_16px_40px_-16px_rgba(0,0,0,0.7)] sm:block">
        <p className="text-[13px] font-semibold text-brand-text">🔴 Problème détecté</p>
        <p className="mt-1 text-[12.5px] leading-snug text-ink-secondary">/api/contact retourne HTTP 500.</p>
      </div>
    </div>
  )
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="pointer-events-none absolute -top-32 right-0 h-[520px] w-[520px] rounded-full opacity-20 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #ff5c49 0%, transparent 70%)' }}
      />
      <Container className="relative grid items-center gap-14 py-20 md:grid-cols-2 md:py-28">
        <div className="hero-reveal">
          <Eyebrow>Monitoring automatique des formulaires</Eyebrow>
          <h1 className="mt-6 font-display text-[38px] font-extrabold leading-[1.12] tracking-tight text-white sm:text-[46px]">
            Ne perdez plus jamais un prospect à cause d&rsquo;un formulaire cassé.
          </h1>
          <p className="mt-5 max-w-[480px] text-[17px] leading-relaxed text-ink-secondary">
            Reachly teste vos formulaires comme un vrai visiteur, remplit les champs, envoie la
            demande, et vous prévient immédiatement lorsqu&rsquo;une soumission échoue.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="#tester">Tester mon formulaire</Button>
            <span className="text-[13px] text-ink-muted">Test gratuit · Aucune carte bancaire</span>
          </div>
        </div>
        <div className="flex justify-center md:justify-end">
          <ReportMockup />
        </div>
      </Container>
    </section>
  )
}
