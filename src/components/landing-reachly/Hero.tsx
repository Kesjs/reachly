import { Link } from '@tanstack/react-router'
import { Terminal } from 'lucide-react'
import { BeamsBackground } from './BeamsBackground'

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <BeamsBackground intensity="medium">
        <div className="landing-grain pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="hero-reveal flex flex-col items-center space-y-8">
            <span className="inline-block font-mono text-xs uppercase tracking-[0.2em] text-brand-text">
              QA avant livraison
            </span>

            <h1 className="text-5xl font-semibold tracking-tight text-ink-primary sm:text-6xl lg:text-[4.2rem] font-display leading-[0.98]">
              Votre site
              <br />
              est fini.
              <br />
              <span className="text-ink-muted">Pas encore testé.</span>
            </h1>

            <p className="max-w-lg text-lg text-ink-secondary leading-relaxed">
              Reachly ouvre votre site comme le ferait un vrai visiteur : il clique, remplit les
              formulaires, change de page, teste le mobile — et vous montre précisément ce qui
              casse avant que votre client ne le découvre.
            </p>

            <div className="flex items-center gap-3 rounded-md border border-hairline border-border bg-surface px-4 py-3 font-mono text-sm text-ink-secondary max-w-md">
              <Terminal className="h-4 w-4 text-brand shrink-0" />
              <span className="text-ink-muted">$</span>
              <span className="text-ink-primary">reachly test https://votre-site.com</span>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3.5 text-base font-medium text-white hover:bg-brand-hover transition-colors"
              >
                Tester mon site
              </Link>
              <a
                href="#comment-ca-marche"
                className="inline-flex items-center justify-center rounded-md border border-hairline border-border px-6 py-3.5 text-base font-medium text-ink-primary hover:bg-elevated transition-colors"
              >
                Voir comment ça marche
              </a>
            </div>

            <button
              onClick={() => {
                localStorage.setItem('simulation_mode', 'true')
                window.location.href = '/dashboard'
              }}
              className="text-xs text-ink-muted hover:text-ink-primary transition-colors"
            >
              🧪 Accès direct dashboard (dev)
            </button>

            <p className="text-sm text-ink-muted">
              Premier test offert · Rapport en moins de 15 minutes · Aucune installation
            </p>
          </div>
        </div>
      </BeamsBackground>
    </section>
  )
}
