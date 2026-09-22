import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'

// Panneau droit : visuel produit statique (même mockup que le Hero de la
// landing) plutôt qu'une photo de stock + faux témoignages — Reachly n'a pas
// encore de clients à citer, et une photo externe (cdn.21st.dev) créerait
// une dépendance réseau inutile pour un écran d'auth.
function ProductVisual() {
  const checks = ['Page accessible', 'Champs fonctionnels', 'Soumission réussie', 'Confirmation reçue']
  return (
    <div className="relative flex h-full flex-col items-center justify-center overflow-hidden p-12">
      <div
        className="pointer-events-none absolute -top-24 right-0 h-[460px] w-[460px] rounded-full opacity-25 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #ff5c49 0%, transparent 70%)' }}
      />
      <div className="relative z-10 w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <span className="font-display text-[15px] font-bold text-white">Reachly</span>
            <span className="flex items-center gap-1.5 text-[12px] text-success">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Formulaire surveillé
            </span>
          </div>
          <p className="mt-4 font-mono text-[13px] text-ink-secondary">mycompany.com/contact</p>
          <ul className="mt-4 space-y-2.5">
            {checks.map((c) => (
              <li key={c} className="flex items-center gap-2.5 text-[14px] text-ink-primary">
                <CheckCircle2 className="size-4 shrink-0 text-success" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative z-10 mt-8 text-center font-display text-xl font-semibold leading-snug text-white">
          Ne perdez plus jamais un prospect à cause d&rsquo;un formulaire cassé.
        </p>
        <p className="relative z-10 mt-2 text-center text-sm text-ink-secondary">
          Reachly teste vos formulaires comme un vrai visiteur, 24h/24.
        </p>
      </div>
    </div>
  )
}

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: ReactNode
  description: ReactNode
  children: ReactNode
}) {
  return (
    <div className="grid min-h-screen bg-canvas lg:grid-cols-[1.02fr_0.98fr]">
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-ink-muted transition-colors hover:text-ink-primary"
          >
            <ArrowLeft className="size-4" />
            Reachly
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-6"
          >
            <div className="space-y-2">
              <h1 className="font-display text-3xl font-semibold leading-tight text-ink-primary">{title}</h1>
              <p className="text-sm text-ink-muted">{description}</p>
            </div>
            {children}
          </motion.div>
        </div>
      </section>

      <section className="hidden bg-surface/40 lg:block">
        <ProductVisual />
      </section>
    </div>
  )
}

export function GlassInputWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-white/5 backdrop-blur-sm transition-colors focus-within:border-brand/70 focus-within:bg-brand/5">
      {children}
    </div>
  )
}
