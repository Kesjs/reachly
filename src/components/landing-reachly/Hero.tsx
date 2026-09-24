import { useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, XCircle, Terminal, ArrowUpRight } from 'lucide-react'
import { BeamsBackground } from './BeamsBackground'

const pipeline = [
  'Découverte du site',
  'Crawl des pages',
  'Parcours navigateur réel',
  'Capture des preuves',
  'Diagnostic IA',
]

type Run = {
  site: string
  pages: number
  checks: number
  issues: number
  status: 'fail' | 'pass'
  issue?: { title: string; detail: string; note: string }
  fixedNote?: string
}

const runs: Run[] = [
  {
    site: 'agence-lumen.com',
    pages: 31,
    checks: 184,
    issues: 4,
    status: 'fail',
    issue: {
      title: 'Le formulaire de contact ne soumet pas',
      detail: 'POST /api/contact → HTTP 500',
      note: 'Détecté en remplissant réellement le formulaire, pas en vérifiant seulement qu\'il s\'affiche.',
    },
  },
  {
    site: 'boutique-nova.fr',
    pages: 18,
    checks: 142,
    issues: 2,
    status: 'fail',
    issue: {
      title: 'Le menu mobile reste ouvert au-dessus du contenu',
      detail: 'Débordement détecté à 375px de large',
      note: 'Le site fonctionne en desktop, pas encore sur mobile.',
    },
  },
]

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const listener = () => setReduced(mq.matches)
    mq.addEventListener('change', listener)
    return () => mq.removeEventListener('change', listener)
  }, [])
  return reduced
}

function ReportPanel({ run, phase, reducedMotion }: { run: Run; phase: 'scanning' | 'result'; reducedMotion: boolean }) {
  return (
    <div className="relative rounded-lg border border-hairline border-border-strong bg-surface shadow-2xl shadow-black/40 overflow-hidden">
      <div className="flex items-center justify-between border-b border-hairline border-border px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-ink-muted font-mono">
          <span className={`h-2 w-2 rounded-full ${run.status === 'fail' ? 'bg-danger' : 'bg-success'}`} />
          <span>{run.site}</span>
          <span className="text-ink-muted/60">· rapport #1847</span>
        </div>
        <span className="text-xs text-ink-muted font-mono tabular-nums">
          {phase === 'scanning' ? 'en cours…' : 'terminé'}
        </span>
      </div>

      {!reducedMotion && phase === 'scanning' && (
        <motion.div
          initial={{ top: '0%' }}
          animate={{ top: '100%' }}
          transition={{ duration: pipeline.length * 0.22 + 0.3, ease: 'linear' }}
          className="pointer-events-none absolute left-0 right-0 h-px bg-brand/40"
        />
      )}

      <div className="relative p-5 min-h-[290px]">
        <AnimatePresence mode="wait">
          {phase === 'scanning' ? (
            <motion.div
              key={`scan-${run.site}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2.5"
            >
              {pipeline.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.25 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: reducedMotion ? 0 : i * 0.22, duration: 0.2 }}
                  className="flex items-center gap-2.5 text-sm"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: reducedMotion ? 0 : i * 0.22 + 0.08, duration: 0.15 }}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                  </motion.span>
                  <span className="text-ink-secondary font-mono text-[13px]">{step}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={`result-${run.site}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="space-y-5"
            >
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Pages', value: run.pages },
                  { label: 'Vérifications', value: run.checks },
                  { label: 'Problèmes', value: run.issues, danger: run.issues > 0 },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`text-xl font-semibold font-display tabular-nums ${s.danger ? 'text-danger' : 'text-ink-primary'}`}>
                      {s.value}
                    </p>
                    <p className="text-[11px] text-ink-muted">{s.label}</p>
                  </div>
                ))}
              </div>

              {run.status === 'fail' && run.issue ? (
                <>
                  <div className="rounded-md border border-danger/25 bg-danger/5 p-3.5">
                    <div className="flex items-start gap-2.5">
                      <XCircle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-ink-primary">{run.issue.title}</p>
                        <p className="mt-1 text-xs text-ink-muted font-mono">{run.issue.detail}</p>
                        <p className="mt-2 text-xs text-ink-secondary">{run.issue.note}</p>
                        <button className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-brand-text hover:underline">
                          Voir la capture d'écran
                          <ArrowUpRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="rounded bg-danger/10 px-3 py-2 text-xs font-medium text-danger inline-block">
                    Pas encore livrable
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-md border border-success/25 bg-success/5 p-3.5 flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <p className="text-sm text-ink-secondary">{run.fixedNote}</p>
                  </div>
                  <div className="rounded bg-success/10 px-3 py-2 text-xs font-medium text-success inline-block">
                    Prêt à livrer
                  </div>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function StaticReportPanel({ run }: { run: Run }) {
  return (
    <div className="relative rounded-lg border border-hairline border-border-strong bg-surface/90 backdrop-blur-sm shadow-xl overflow-hidden opacity-60">
      <div className="flex items-center justify-between border-b border-hairline border-border px-4 py-3">
        <div className="flex items-center gap-2 text-xs text-ink-muted font-mono">
          <span className={`h-2 w-2 rounded-full ${run.status === 'fail' ? 'bg-danger' : 'bg-success'}`} />
          <span>{run.site}</span>
          <span className="text-ink-muted/60">· rapport #1846</span>
        </div>
        <span className="text-xs text-ink-muted font-mono tabular-nums">
          terminé
        </span>
      </div>

      <div className="relative p-5">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Pages', value: run.pages },
            { label: 'Vérifications', value: run.checks },
            { label: 'Problèmes', value: run.issues, danger: run.issues > 0 },
          ].map((s) => (
            <div key={s.label}>
              <p className={`text-xl font-semibold font-display tabular-nums ${s.danger ? 'text-danger' : 'text-ink-primary'}`}>
                {s.value}
              </p>
              <p className="text-[11px] text-ink-muted">{s.label}</p>
            </div>
          ))}
        </div>

        {run.status === 'fail' && run.issue ? (
          <div className="mt-4 rounded-md border border-danger/25 bg-danger/5 p-3.5">
            <div className="flex items-start gap-2.5">
              <XCircle className="h-4 w-4 text-danger mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink-primary">{run.issue.title}</p>
                <p className="mt-1 text-xs text-ink-muted font-mono">{run.issue.detail}</p>
              </div>
            </div>
          </div>
        ) : run.fixedNote ? (
          <div className="mt-4 rounded-md border border-success/25 bg-success/5 p-3.5 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-success mt-0.5 shrink-0" />
            <p className="text-sm text-ink-secondary">{run.fixedNote}</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function Hero() {
  const reducedMotion = usePrefersReducedMotion()
  const [animatedRunIndex, setAnimatedRunIndex] = useState(0)
  const [animatedPhase, setAnimatedPhase] = useState<'scanning' | 'result'>('scanning')
  const animatedRun = runs[animatedRunIndex]

  useEffect(() => {
    if (reducedMotion) return
    let timers: ReturnType<typeof setTimeout>[] = []

    if (animatedPhase === 'scanning') {
      timers.push(setTimeout(() => setAnimatedPhase('result'), pipeline.length * 220 + 300))
    } else {
      timers.push(
        setTimeout(() => {
          setAnimatedRunIndex((i) => (i + 1) % runs.length)
          setAnimatedPhase('scanning')
        }, 3400)
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [animatedPhase, reducedMotion])

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <BeamsBackground intensity="medium">
        <div className="landing-grain pointer-events-none absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 items-center">
          {/* Left column */}
          <div className="hero-reveal space-y-8">
            <h1 className="text-4xl font-semibold tracking-tight text-ink-primary sm:text-5xl lg:text-[3.4rem] font-display leading-[1.08]">
              Votre site est fini.
              <br />
              Il n'est pas encore testé.
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

            <p className="text-sm text-ink-muted">
              Premier test offert · Rapport en moins de 15 minutes · Aucune installation
            </p>
          </div>

          {/* Right column — multiple report panels */}
          <div className="relative">
            {/* Main animated panel */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative z-10"
            >
              <ReportPanel run={animatedRun} phase={animatedPhase} reducedMotion={reducedMotion} />
            </motion.div>

            {/* Static panels layered behind */}
            <div className="absolute inset-0 -translate-x-4 -translate-y-4 scale-95 opacity-40">
              <StaticReportPanel run={runs[1]} />
            </div>
            
            <div className="absolute inset-0 translate-x-4 translate-y-4 scale-95 opacity-30">
              <StaticReportPanel run={runs[0]} />
            </div>

            {/* Another animated panel offset */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.6, x: 10 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="absolute inset-0 translate-x-6 translate-y-6 scale-90 z-0"
            >
              <ReportPanel 
                run={runs[(animatedRunIndex + 1) % runs.length]} 
                phase={animatedPhase === 'scanning' ? 'result' : 'scanning'} 
                reducedMotion={reducedMotion} 
              />
            </motion.div>
          </div>
        </div>
      </div>
      </BeamsBackground>
    </section>
  )
}
