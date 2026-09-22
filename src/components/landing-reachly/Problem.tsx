import { Container } from './ui'

const cases = [
  {
    title: 'Erreur serveur',
    body: "Votre API retourne une erreur et la demande n'est jamais enregistrée.",
  },
  {
    title: 'Modification du site',
    body: "Une mise à jour récente a cassé le champ ou le bouton d'envoi.",
  },
  {
    title: 'Notification perdue',
    body: 'Le formulaire accepte la demande mais votre équipe ne reçoit plus le lead.',
  },
]

const trail = [
  { label: 'Site accessible', ok: true },
  { label: 'Page contact accessible', ok: true },
  { label: 'Formulaire visible', ok: true },
  { label: 'Soumission échoue', ok: false },
]

export function Problem() {
  return (
    <section id="produit" className="border-b border-border py-24">
      <Container>
        <div className="max-w-[560px]">
          <h2 className="font-display text-[30px] font-bold leading-tight text-white sm:text-[34px]">
            Votre site peut être parfaitement en ligne — et pourtant votre formulaire ne
            fonctionne plus.
          </h2>
          <p className="mt-4 text-[16px] leading-relaxed text-ink-secondary">
            Un site accessible, une page contact visible, un formulaire qui s&rsquo;affiche
            normalement : tout semble en ordre. Sauf que la soumission, elle, échoue
            silencieusement.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-2.5 gap-y-2 rounded-lg border border-border bg-surface px-5 py-4 font-mono text-[13px]">
          {trail.map((t, i) => (
            <span key={t.label} className="flex items-center gap-2.5">
              {i > 0 && <span className="text-border-strong">→</span>}
              <span className={t.ok ? 'text-ink-secondary' : 'text-brand-text'}>
                {t.ok ? '✓' : '✕'} {t.label}
              </span>
            </span>
          ))}
        </div>

        <div className="mt-4 divide-y divide-border border-t border-border">
          {cases.map((c) => (
            <div
              key={c.title}
              className="flex flex-col gap-1.5 py-6 sm:flex-row sm:items-baseline sm:gap-10"
            >
              <p className="w-full shrink-0 font-display text-[16px] font-bold text-white sm:w-52">
                {c.title}
              </p>
              <p className="text-[14.5px] leading-relaxed text-ink-secondary">{c.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-[15px] text-ink-muted">
          Le plus souvent, vous ne le découvrez qu&rsquo;après avoir perdu un prospect.
        </p>
      </Container>
    </section>
  )
}
