import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export function Nav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-white font-display">
              Reachly
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="flex items-center space-x-8">
              <a href="#produit" className="text-slate-400 hover:text-white transition-colors text-sm">
                Product
              </a>
              <a href="#comment-ca-marche" className="text-slate-400 hover:text-white transition-colors text-sm">
                How it works
              </a>
              <a href="#prix" className="text-slate-400 hover:text-white transition-colors text-sm">
                Pricing
              </a>
            </div>
          </div>

          {/* CTA & Login */}
          <div className="hidden md:flex items-center space-x-4">
            <Link 
              to="/login" 
              className="text-slate-400 hover:text-white transition-colors text-sm"
            >
              Log in
            </Link>
            <Link 
              to="/signup" 
              className="rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-hover transition-colors shadow-lg shadow-brand/20"
            >
              Test your site
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-400 hover:text-white"
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
            className="md:hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              <a
                href="#produit"
                className="block rounded-md px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Product
              </a>
              <a
                href="#comment-ca-marche"
                className="block rounded-md px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                How it works
              </a>
              <a
                href="#prix"
                className="block rounded-md px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Pricing
              </a>
              <hr className="border-slate-800" />
              <Link
                to="/login"
                className="block rounded-md px-3 py-2 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="block rounded-md px-3 py-2 bg-brand text-white font-medium hover:bg-brand-hover transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Test your site
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}