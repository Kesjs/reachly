import { motion } from 'framer-motion'
import { CheckCircle2, XCircle } from 'lucide-react'

const trail = [
  { text: 'GET / → 200', ok: true },
  { text: 'Navigation chargée', ok: true },
  { text: 'Page /contact accessible', ok: true },
  { text: 'Formulaire visible', ok: true },
  { text: 'POST /api/contact → 500', ok: false },
]

const problems = [
  {
    title: 'Un formulaire cassé',
    description: "La page s'affiche, le formulaire a l'air normal — mais la soumission échoue.",
  },
  {
    title: 'Un lien mort',
    description: "Un bouton ou un menu renvoie vers une page qui n'existe plus.",
  },
  {
    title: 'Un mobile qui déborde',
    description: 'Le site fonctionne sur desktop, mais un élément casse la mise en page sur téléphone.',
  },
]

export function Problem() {
  return (
    <section id="produit" className="py-20 sm:py-28 bg-canvas">
      <div className="mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-16 items-start">
          <div className="space-y-10">
            <div className="space-y-5 max-w-lg">
              <h2 className="text-3xl font-semibold text-ink-primary sm:text-4xl font-display leading-tight">
                Un site peut répondre correctement et être cassé quand même.
              </h2>
              <p className="text-lg text-ink-secondary leading-relaxed">
                Un ping ou un simple chargement de page ne révèle rien. Les vrais problèmes
                apparaissent seulement quand quelqu'un clique, remplit et navigue — ce que fait
                Reachly, et ce qu'un test de disponibilité ne fait pas.
              </p>
            </div>

            <div className="space-y-6">
              {problems.map((problem) => (
                <div key={problem.title} className="flex gap-4 border-t border-hairline border-border pt-6 first:border-t-0 first:pt-0">
                  <div className="pt-1">
                    <span className="block h-1.5 w-1.5 rounded-full bg-brand" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink-primary">{problem.title}</h3>
                    <p className="mt-1 text-sm text-ink-secondary leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-lg border border-hairline border-border-strong bg-surface overflow-hidden"
          >
            <div className="border-b border-hairline border-border px-5 py-3">
              <span className="text-xs font-mono text-ink-muted">journal du test — acme-agence.com</span>
            </div>
            <div className="p-5 space-y-3 font-mono text-sm">
              {trail.map((step) => (
                <div key={step.text} className="flex items-center gap-2.5">
                  {step.ok ? (
                    <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                  ) : (
                    <XCircle className="h-4 w-4 text-danger shrink-0" />
                  )}
                  <span className={step.ok ? 'text-ink-secondary' : 'text-ink-primary font-medium'}>
                    {step.text}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-hairline border-border px-5 py-3.5">
              <p className="text-xs text-ink-muted">
                Un test de disponibilité se serait arrêté à la première ligne — la page répond.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
