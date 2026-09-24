import { motion } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const features = [
  'QA complet du site',
  'Pages & codes HTTP',
  'Liens morts',
  'Formulaires & soumissions',
  'Boutons et appels à l\'action',
  'Erreurs navigateur',
  'Erreurs réseau',
  'Responsive mobile',
  'SEO technique de base',
  'Validation des assets',
  'Accessibilité de base',
  'Performance de base',
  'QA visuel & captures',
  'Preuves techniques',
  'Retest inclus',
  'Rapport prêt à partager',
]

export function Pricing() {
  return (
    <section id="prix" className="py-20 sm:py-28 bg-canvas">
      <div className="mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mb-14">
          <h2 className="text-3xl font-semibold text-ink-primary sm:text-4xl font-display">
            Un tarif, sans engagement
          </h2>
          <p className="mt-4 text-lg text-ink-secondary">
            Testez un site avant de le livrer. Payez au test, pas à l'abonnement.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="grid overflow-hidden rounded-lg border border-hairline border-border-strong bg-surface md:grid-cols-[1fr_1.4fr]"
        >
          <div className="p-8 border-b md:border-b-0 md:border-r border-hairline border-border flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-ink-primary font-display mb-1">Full QA</h3>
              <p className="text-sm text-ink-secondary mb-6">QA complet pour un site, avant livraison.</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-5xl font-semibold text-ink-primary font-display">19€</span>
                <span className="text-ink-muted">/ site</span>
              </div>
              <p className="mt-2 text-sm text-ink-muted">Un QA · un rapport · un retest inclus</p>
            </div>

            <div className="mt-8 space-y-3">
              <Link
                to="/signup"
                className="flex items-center justify-center rounded-md bg-brand px-6 py-3.5 text-base font-medium text-white hover:bg-brand-hover transition-colors"
              >
                Commencer maintenant
              </Link>
              <p className="text-center text-xs text-ink-muted">Paiement sécurisé · aucun engagement</p>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              {features.map((feature) => (
                <div key={feature} className="flex items-start gap-2.5 text-sm text-ink-secondary">
                  <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="mt-10">
          <p className="text-ink-secondary">
            Besoin de tester plusieurs sites régulièrement ?{' '}
            <a href="mailto:contact@reachly.fr" className="text-brand-text hover:underline font-medium">
              Contactez-nous
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
