import { Link } from '@tanstack/react-router'

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link to="/" className="text-sm font-bold text-ink-primary font-display">
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
          © {new Date().getFullYear()} Reachly. Tous droits réservés.
        </p>
      </div>
    </footer>
  )
}
