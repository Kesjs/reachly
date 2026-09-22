import { Container } from './ui'

export function AIDiagnosis() {
  return (
    <section className="border-b border-border py-24">
      <Container>
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <h2 className="font-display text-[30px] font-bold leading-tight text-white sm:text-[34px]">
              Pas seulement une alerte. Une explication.
            </h2>
            <p className="mt-4 max-w-[440px] text-[16px] leading-relaxed text-ink-secondary">
              Une erreur serveur ne dit rien à personne. Reachly traduit chaque panne en une
              explication claire, avec une piste concrète pour la résoudre.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-surface p-6">
            <div className="rounded-lg bg-canvas p-4 font-mono text-[13px] text-ink-muted">
              HTTP 500 — /api/contact
            </div>
            <div className="mt-4 flex items-center gap-2 text-[13px] text-brand-text">
              <span>↓</span> diagnostic Reachly
            </div>
            <div className="mt-4 rounded-lg border border-border-strong bg-canvas p-4">
              <p className="text-[14.5px] leading-relaxed text-ink-primary">
                Le formulaire accepte les données, mais le serveur échoue lors de leur
                traitement.
              </p>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-secondary">
                Le problème semble venir de{' '}
                <span className="font-mono text-ink-primary">/api/contact</span>. À vérifier :
                les logs serveur et les dernières modifications de l&rsquo;endpoint.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
