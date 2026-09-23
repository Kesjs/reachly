import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-ink-primary font-display">
              Reachly
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#produit" className="text-ink-secondary hover:text-ink-primary transition-colors">
                Produit
              </a>
              <a href="#comment-ca-marche" className="text-ink-secondary hover:text-ink-primary transition-colors">
                Comment ça marche
              </a>
              <a href="#prix" className="text-ink-secondary hover:text-ink-primary transition-colors">
                Prix
              </a>
            </div>
          </div>

          {/* CTA & Login */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-ink-secondary hover:text-ink-primary transition-colors"
            >
              Se connecter
            </Link>
            <Link 
              to="/signup" 
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-canvas hover:bg-brand-hover transition-colors"
            >
              Tester mon site
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-ink-secondary hover:text-ink-primary"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a
                href="#produit"
                className="block rounded-md px-3 py-2 text-ink-secondary hover:text-ink-primary hover:bg-elevated transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Produit
              </a>
              <a
                href="#comment-ca-marche"
                className="block rounded-md px-3 py-2 text-ink-secondary hover:text-ink-primary hover:bg-elevated transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Comment ça marche
              </a>
              <a
                href="#prix"
                className="block rounded-md px-3 py-2 text-ink-secondary hover:text-ink-primary hover:bg-elevated transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Prix
              </a>
              <hr className="border-border" />
              <Link
                to="/login"
                className="block rounded-md px-3 py-2 text-ink-secondary hover:text-ink-primary hover:bg-elevated transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Se connecter
              </Link>
              <Link
                to="/signup"
                className="block rounded-md px-3 py-2 bg-brand text-canvas font-medium hover:bg-brand-hover transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Tester mon site
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}