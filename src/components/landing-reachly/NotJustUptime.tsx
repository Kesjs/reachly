import { motion } from 'framer-motion'
import { CheckCircle, Globe } from 'lucide-react'

export function NotJustUptime() {
  const simpleChecks = [
    "GET /",
    "HTTP 200",
    "✓ Considéré comme « en ligne »"
  ]

  const reachlyChecks = [
    "Crawl website",
    "Open pages", 
    "Test navigation",
    "Test buttons",
    "Test forms",
    "Check console",
    "Check network", 
    "Check mobile",
    "Check technical SEO",
    "Capture evidence"
  ]

  return (
    <section className="py-16 sm:py-24 bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-ink-primary sm:text-4xl font-display mb-4">
              Un site qui répond n'est pas forcément un site prêt à être livré
            </h2>
            <p className="text-lg text-ink-secondary max-w-3xl mx-auto">
              La différence entre un simple test de disponibilité et un vrai QA de livraison
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column - Simple Check */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl border border-border bg-surface p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-lg bg-warning/10 px-3 py-1 text-warning">
                  <Globe className="h-4 w-4" />
                  <span className="text-sm font-medium">Simple page check</span>
                </div>
              </div>
              
              <div className="space-y-3 font-mono text-sm">
                {simpleChecks.map((check, index) => (
                  <div key={index} className="text-ink-muted">
                    {check}
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <p className="text-sm text-ink-secondary">
                  Limité à la disponibilité de base
                </p>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Reachly */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-2xl border border-brand/20 bg-surface p-8">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-1 text-brand">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Reachly</span>
                </div>
              </div>
              
              <div className="space-y-2">
                {reachlyChecks.map((check, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    viewport={{ once: true }}
                    className="flex items-center gap-2 text-sm text-ink-secondary"
                  >
                    <CheckCircle className="h-3 w-3 text-success" />
                    <span>{check}</span>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm font-medium text-success">
                  <CheckCircle className="h-4 w-4" />
                  <span>Tested like a real user</span>
                </div>
              </div>
            </div>

            {/* Highlight badge */}
            <div className="absolute -top-3 -right-3 rounded-full bg-brand px-3 py-1">
              <span className="text-xs font-bold text-canvas">COMPLET</span>
            </div>
          </motion.div>
        </div>

        {/* Bottom message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-lg text-ink-secondary">
            Avec Reachly, vous testez vraiment votre site avant que vos clients ne le fassent.
          </p>
        </motion.div>
      </div>
    </section>
  )
}