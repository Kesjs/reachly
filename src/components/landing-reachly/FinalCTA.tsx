import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'

export function FinalCTA() {
  return (
    <section className="py-20 sm:py-28 bg-canvas">
      <div className="mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="rounded-lg border border-hairline border-border-strong bg-surface px-8 py-14 sm:px-14 sm:py-16 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8"
        >
          <div className="max-w-xl">
            <h2 className="text-3xl font-semibold text-ink-primary sm:text-4xl font-display leading-tight">
              Votre site est terminé. Est-il vraiment prêt à être livré ?
            </h2>
            <p className="mt-4 text-lg text-ink-secondary">
              Lancez un Full QA et découvrez les problèmes avant votre client.
            </p>
          </div>

          <div className="flex flex-col items-start gap-3 shrink-0">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center rounded-md bg-brand px-7 py-3.5 text-base font-medium text-white hover:bg-brand-hover transition-colors"
            >
              Tester mon site
            </Link>
            <span className="text-sm text-ink-muted">Premier test offert</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-hairline border-border bg-canvas">
      <div className="mx-auto max-w-1200 px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-sm font-semibold text-ink-primary font-display">
            Reachly
          </Link>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-secondary">
            <Link to="/tarifs" className="hover:text-ink-primary transition-colors">
              Tarifs
            </Link>
            <Link to="/mentions-legales" className="hover:text-ink-primary transition-colors">
              Mentions légales
            </Link>
            <Link to="/cgv" className="hover:text-ink-primary transition-colors">
              CGV
            </Link>
            <Link to="/confidentialite" className="hover:text-ink-primary transition-colors">
              Confidentialité
            </Link>
          </nav>
        </div>

        <p className="mt-6 text-center sm:text-left text-xs text-ink-muted">
          © {currentYear} Reachly. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
