import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Menu, X } from 'lucide-react'

const links = [
  { href: '#produit', label: 'Le problème' },
  { href: '#comment-ca-marche', label: 'Comment ça marche' },
  { href: '#prix', label: 'Tarif' },
]

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline border-border bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-base font-semibold text-ink-primary font-display">
            <span className="flex h-6 w-6 items-center justify-center rounded-sm bg-brand text-[11px] font-bold text-canvas">
              R
            </span>
            Reachly
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-ink-secondary hover:text-ink-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/login" className="text-sm text-ink-secondary hover:text-ink-primary transition-colors">
              Connexion
            </Link>
            <Link
              to="/signup"
              className="rounded-md border border-hairline border-border-strong bg-surface px-4 py-2 text-sm font-medium text-ink-primary hover:bg-elevated transition-colors"
            >
              Tester mon site
            </Link>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-ink-secondary hover:text-ink-primary"
            aria-label="Menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden border-t border-hairline border-border space-y-1 px-1 pb-4 pt-3">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="block rounded-md px-3 py-2 text-sm text-ink-secondary hover:text-ink-primary hover:bg-elevated transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="my-2 border-t border-hairline border-border" />
            <Link
              to="/login"
              className="block rounded-md px-3 py-2 text-sm text-ink-secondary hover:text-ink-primary hover:bg-elevated transition-colors"
              onClick={() => setIsOpen(false)}
            >
              Connexion
            </Link>
            <Link
              to="/signup"
              className="block rounded-md px-3 py-2 text-sm font-medium text-ink-primary bg-elevated"
              onClick={() => setIsOpen(false)}
            >
              Tester mon site
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
