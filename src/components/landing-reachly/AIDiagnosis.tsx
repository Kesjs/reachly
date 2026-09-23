import { motion } from 'framer-motion'
import { Brain, Search, Lightbulb } from 'lucide-react'

export function AIDiagnosis() {
  return (
    <section className="py-16 sm:py-24 bg-elevated/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-ink-primary sm:text-4xl font-display mb-4">
              Des preuves d'abord. Une explication ensuite.
            </h2>
            <p className="text-lg text-ink-secondary max-w-3xl mx-auto">
              Reachly observe réellement ce qui se passe, puis utilise l'IA pour vous expliquer le problème et suggérer une solution.
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
          {/* Left Column - Observed Evidence */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-border bg-surface p-6">
              <div className="mb-4 flex items-center gap-2">
                <Search className="h-5 w-5 text-brand" />
                <span className="font-semibold text-ink-primary">Observed</span>
              </div>
              
              <div className="space-y-3 font-mono text-sm bg-elevated rounded-lg p-4">
                <div className="text-ink-muted">POST /api/contact</div>
                <div className="text-danger font-medium">HTTP 500</div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - AI Explanation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-brand/20 bg-surface p-6">
              <div className="mb-4 flex items-center gap-2">
                <Brain className="h-5 w-5 text-brand" />
                <span className="font-semibold text-ink-primary">Reachly diagnosis</span>
              </div>
              
              <div className="space-y-4">
                <p className="text-ink-secondary leading-relaxed">
                  The contact form submits the request, but the server fails while processing it.
                </p>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-ink-primary">Check:</p>
                  <p className="text-sm text-ink-secondary font-mono bg-elevated rounded px-2 py-1">
                    /api/contact
                  </p>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-warning" />
                    <p className="text-sm font-medium text-ink-primary">Suggested investigation:</p>
                  </div>
                  <p className="text-sm text-ink-secondary">
                    server logs and latest API changes.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Process Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-8 rounded-full border border-border bg-surface px-8 py-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-brand" />
              <span className="text-sm font-medium text-ink-primary">Test réel</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-brand" />
              <span className="text-sm font-medium text-ink-primary">Analyse IA</span>
            </div>
            <div className="h-4 w-px bg-border"></div>
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-brand" />
              <span className="text-sm font-medium text-ink-primary">Solution suggérée</span>
            </div>
          </div>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-ink-muted max-w-2xl mx-auto">
            L'IA n'invente pas les problèmes — elle explique ce que Reachly a réellement observé lors des tests automatisés.
          </p>
        </motion.div>
      </div>
    </section>
  )
}