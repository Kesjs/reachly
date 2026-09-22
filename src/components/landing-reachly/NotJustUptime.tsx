import { Container } from './ui'

const basic = ['GET /contact', 'HTTP 200', '✓ Considéré comme « en ligne »']
const deep = [
  'Ouvre la page',
  'Trouve le formulaire',
  'Remplit les champs',
  'Soumet la demande',
  'Vérifie la réponse',
  'Analyse les erreurs',
]

export function NotJustUptime() {
  return (
    <section className="border-b border-border bg-surface/40 py-24">
      <Container>
        <div className="max-w-[560px]">
          <h2 className="font-display text-[30px] font-bold leading-tight text-white sm:text-[34px]">
            Votre site peut être en ligne. Votre formulaire, lui, peut être cassé.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-secondary">
            Un monitoring classique vérifie qu&rsquo;une page répond. Reachly va plus loin : il
            vérifie que la demande arrive vraiment.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-canvas p-7">
            <p className="text-[13px] font-semibold text-ink-muted">Monitoring classique</p>
            <ol className="mt-5 space-y-3 font-mono text-[13.5px] text-ink-secondary">
              {basic.map((line, i) => (
                <li key={line} className="flex items-center gap-3">
                  <span className="text-ink-muted">{i + 1}</span>
                  {line}
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-xl border border-brand/30 bg-canvas p-7">
            <p className="text-[13px] font-semibold text-brand-text">Reachly</p>
            <ol className="mt-5 space-y-3 font-mono text-[13.5px] text-ink-primary">
              {deep.map((line, i) => (
                <li key={line} className="flex items-center gap-3">
                  <span className="text-brand">{i + 1}</span>
                  {line}
                </li>
              ))}
              <li className="flex items-center gap-3 pt-1 text-success">
                <span>✓</span>
                Fonctionne réellement
              </li>
            </ol>
          </div>
        </div>
      </Container>
    </section>
  )
}
