import { motion } from 'framer-motion'
import { CheckCircle, Zap } from 'lucide-react'
import { Link } from '@tanstack/react-router'

export function Pricing() {
  const features = [
    "Full website QA",
    "Page & HTTP checks", 
    "Broken links detection",
    "Forms & submissions testing",
    "CTA checks",
    "Browser errors detection",
    "Network errors monitoring",
    "Mobile responsive checks",
    "Technical SEO basics",
    "Asset validation",
    "Accessibility basics",
    "Performance basics",
    "Visual QA & screenshots",
    "Evidence & proof capture",
    "Retest capability",
    "Client-ready report"
  ]

  return (
    <section id="prix" className="py-16 sm:py-24 bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-ink-primary sm:text-4xl font-display mb-4">
              Pricing simple et transparent
            </h2>
            <p className="text-lg text-ink-secondary max-w-2xl mx-auto">
              Testez vos sites avant livraison sans engagement
            </p>
          </motion.div>
        </div>

        <div className="max-w-lg mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative rounded-2xl border-2 border-brand/20 bg-surface p-8 shadow-xl"
          >
            {/* Popular badge */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-2 rounded-full bg-brand px-4 py-1">
                <Zap className="h-4 w-4 text-canvas" />
                <span className="text-sm font-bold text-canvas">RECOMMANDÉ</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-ink-primary font-display mb-2">
                Full QA
              </h3>
              <p className="text-ink-secondary mb-6">
                QA complet pour votre site web
              </p>
              
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold text-ink-primary">19€</span>
                <span className="text-ink-muted">/ site</span>
              </div>
              <p className="text-sm text-ink-muted mt-2">
                Un QA · Un rapport · Un retest inclus
              </p>
            </div>

            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: 10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.03 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="text-sm text-ink-secondary">{feature}</span>
                </motion.div>
              ))}
            </div>

            <Link 
              to="/signup"
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-brand px-6 py-4 text-lg font-medium text-canvas hover:bg-brand-hover transition-colors"
            >
              <Zap className="h-5 w-5" />
              Commencer maintenant
            </Link>

            <p className="text-center text-xs text-ink-muted mt-4">
              Aucun engagement · Paiement sécurisé
            </p>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-ink-secondary mb-4">
            Besoin de tester plusieurs sites régulièrement ?
          </p>
          <a 
            href="mailto:contact@reachly.fr" 
            className="text-brand-text hover:underline font-medium"
          >
            Contactez-nous pour un tarif adapté →
          </a>
        </motion.div>
      </div>
    </section>
  )
}