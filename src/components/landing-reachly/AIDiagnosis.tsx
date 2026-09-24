import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

export function AIDiagnosis() {
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

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid items-stretch gap-0 rounded-lg border border-hairline border-border-strong bg-canvas overflow-hidden lg:grid-cols-[1fr_auto_1.3fr]"
        >
          <div className="p-7">
            <p className="text-xs font-mono text-ink-muted mb-4">observé pendant le test</p>
            <div className="space-y-2 font-mono text-sm rounded-md bg-surface border border-hairline border-border p-4">
              <div className="text-ink-muted">POST /api/contact</div>
              <div className="text-danger font-medium">HTTP 500</div>
              <div className="text-ink-muted">3 tentatives, même résultat</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center justify-center border-x border-hairline border-border px-4">
            <ArrowRight className="h-5 w-5 text-ink-muted" />
          </div>

          <div className="p-7 border-t lg:border-t-0 border-hairline border-border">
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
        </motion.div>
      </div>
    </section>
  )
}
