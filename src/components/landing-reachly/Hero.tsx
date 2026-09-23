import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-canvas py-16 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="hero-reveal space-y-8">
            {/* Eyebrow */}
            <div className="inline-flex items-center rounded-full border border-border bg-elevated px-4 py-2 text-sm text-ink-secondary">
              <span className="mr-2 h-2 w-2 rounded-full bg-brand"></span>
              Pre-delivery website QA
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl font-bold tracking-tight text-ink-primary sm:text-5xl lg:text-6xl font-display">
              Ne livrez pas un site avant de l'avoir testé.
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-ink-secondary sm:text-xl">
              Reachly ouvre votre site comme un vrai utilisateur, teste ses pages, ses liens, 
              ses formulaires, ses boutons, son mobile et ses erreurs techniques — puis vous 
              indique exactement ce qui doit être corrigé.
            </p>

            {/* CTA Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link 
                to="/signup"
                className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-4 text-lg font-medium text-canvas hover:bg-brand-hover transition-colors"
              >
                Tester mon site
              </Link>
              <div className="flex items-center gap-2 text-sm text-ink-muted">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Full QA · Rapport avec preuves</span>
              </div>
            </div>
          </div>

          {/* Right Column - Mockup */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="rounded-2xl border border-border bg-surface p-6 shadow-xl"
            >
              {/* Header */}
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink-primary font-display">Reachly</h3>
                  <p className="text-sm text-ink-muted">acme.com</p>
                </div>
                <div className="rounded-lg bg-success/10 px-3 py-1">
                  <span className="text-sm font-medium text-success">✓ QA complete</span>
                </div>
              </div>

              {/* Stats */}
              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-ink-primary">31</p>
                  <p className="text-sm text-ink-muted">pages</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-ink-primary">184</p>
                  <p className="text-sm text-ink-muted">checks</p>
                </div>
              </div>

              {/* Results Summary */}
              <div className="mb-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-sm text-ink-secondary">169 passed</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-warning" />
                    <span className="text-sm text-ink-secondary">11 warnings</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-danger" />
                    <span className="text-sm text-ink-secondary">4 issues</span>
                  </div>
                </div>
              </div>

              {/* Critical Issues */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-ink-primary">Critical issues</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-danger" />
                    <span className="text-sm text-ink-muted">Contact form fails</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-danger" />
                    <span className="text-sm text-ink-muted">/pricing → 404</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-danger" />
                    <span className="text-sm text-ink-muted">Mobile overflow</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-3 w-3 text-danger" />
                    <span className="text-sm text-ink-muted">JavaScript error</span>
                  </div>
                </div>
              </div>

              {/* Callout */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1, duration: 0.3 }}
                className="mt-4 rounded-lg border border-danger/20 bg-danger/5 p-3"
              >
                <div className="flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-danger mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-danger">Issue detected</p>
                    <p className="text-xs text-ink-muted">POST /api/contact → HTTP 500</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}