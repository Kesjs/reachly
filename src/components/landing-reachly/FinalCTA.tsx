import { motion } from 'framer-motion'
import { Link } from '@tanstack/react-router'
import { Zap, CheckCircle } from 'lucide-react'

export function FinalCTA() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-brand/5 via-canvas to-canvas">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <h2 className="text-3xl font-bold text-ink-primary sm:text-4xl lg:text-5xl font-display">
            Votre site est terminé. Est-il vraiment prêt à être livré ?
          </h2>
          
          <p className="text-xl text-ink-secondary max-w-2xl mx-auto">
            Lancez un Full QA et découvrez les problèmes avant votre client.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              to="/signup"
              className="inline-flex items-center justify-center gap-3 rounded-xl bg-brand px-8 py-4 text-lg font-medium text-canvas hover:bg-brand-hover transition-colors shadow-lg hover:shadow-xl"
            >
              <Zap className="h-6 w-6" />
              Tester mon site
            </Link>
            
            <div className="flex items-center gap-2 text-ink-muted">
              <CheckCircle className="h-5 w-5 text-success" />
              <span>Gratuit pour votre premier test</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = {
    product: [
      { name: 'Comment ça marche', href: '#comment-ca-marche' },
      { name: 'Prix', href: '#prix' },
      { name: 'FAQ', href: '#faq' }
    ],
    legal: [
      { name: 'Mentions légales', href: '/mentions-legales' },
      { name: 'Confidentialité', href: '/confidentialite' },
      { name: 'CGV', href: '/cgv' }
    ],
    support: [
      { name: 'Contact', href: 'mailto:contact@reachly.fr' },
      { name: 'Documentation', href: '#' },
      { name: 'Statut', href: '#' }
    ]
  }

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <span className="text-xl font-bold text-ink-primary font-display">
                Reachly
              </span>
            </div>
            <p className="text-sm text-ink-muted leading-relaxed">
              QA automatisé de sites web avant livraison.
            </p>
          </div>

          {/* Links */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-ink-primary mb-3">Produit</h3>
              <ul className="space-y-2">
                {links.product.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-sm text-ink-muted hover:text-ink-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink-primary mb-3">Support</h3>
              <ul className="space-y-2">
                {links.support.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-sm text-ink-muted hover:text-ink-primary transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-ink-primary mb-3">Légal</h3>
              <ul className="space-y-2">
                {links.legal.map((link) => (
                  <li key={link.name}>
                    <Link 
                      to={link.href}
                      className="text-sm text-ink-muted hover:text-ink-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <p className="text-center text-sm text-ink-muted">
            © {currentYear} Reachly. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}