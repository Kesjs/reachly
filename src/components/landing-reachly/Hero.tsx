import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { CheckCircle2, XCircle, Terminal, ArrowUpRight } from 'lucide-react'
import { BeamsBackground } from './BeamsBackground'
// import { gsap, useMagnetic } from '~/lib/landing-gsap'

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
      note: "Détecté en remplissant réellement le formulaire, pas en vérifiant seulement qu'il s'affiche.",
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

/** Ligne de progression qui balaie le panneau de haut en bas pendant le scan. */
function SweepLine({ reducedMotion }: { reducedMotion: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reducedMotion || !ref.current) return
    // const tween = gsap.fromTo(
    //   ref.current,
    //   { top: '0%' },
    //   { top: '100%', duration: pipeline.length * 0.22 + 0.3, ease: 'none' },
    // )
    // return () => {
    //   tween.kill()
    // }
  }, [reducedMotion])

  if (reducedMotion) return null
  return <div ref={ref} className="pointer-events-none absolute left-0 right-0 h-px bg-brand/40" />
}

function ScanPhase({ reducedMotion }: { reducedMotion: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const items = Array.from(el.querySelectorAll<HTMLElement>('[data-pipeline-item]'))
    const dots = Array.from(el.querySelectorAll<HTMLElement>('[data-pipeline-dot]'))

    // const tl = gsap.timeline()
    // tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.2 })
    // tl.fromTo(
    //   items,
    //   { opacity: 0.25 },
    //   { opacity: 1, duration: 0.2, stagger: reducedMotion ? 0 : 0.22 },
    //   0,
    // )
    // tl.fromTo(
    //   dots,
    //   { scale: 0 },
    //   { scale: 1, duration: 0.15, stagger: reducedMotion ? 0 : 0.22, ease: 'back.out(2)' },
    //   reducedMotion ? 0 : 0.08,
    // )

    // return () => {
    //   tl.kill()
    // }
  }, [reducedMotion])

  return (
    <div ref={containerRef} className="space-y-2.5">
      {pipeline.map((step) => (
        <div key={step} data-pipeline-item className="flex items-center gap-2.5 text-sm">
          <span data-pipeline-dot className="inline-flex">
            <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
          </span>
          <span className="text-ink-secondary font-mono text-[13px]">{step}</span>
        </div>
      ))}
    </div>
  )
}

function ResultPhase({ run }: { run: Run }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    // const tween = gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 })
    // return () => {
    //   tween.kill()
    // }
  }, [])

  return (
    <div ref={containerRef} className="space-y-5">
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
    </div>
  )
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

      {phase === 'scanning' && <SweepLine reducedMotion={reducedMotion} />}

      <div className="relative p-5 min-h-[290px]">
        {phase === 'scanning' ? (
          <ScanPhase key={`scan-${run.site}`} reducedMotion={reducedMotion} />
        ) : (
          <ResultPhase key={`result-${run.site}`} run={run} />
        )}
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

  const panelStackRef = useRef<HTMLDivElement>(null)
  // const ctaRef = useMagnetic<HTMLAnchorElement>(0.25)

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
        }, 3400),
      )
    }
    return () => timers.forEach(clearTimeout)
  }, [animatedPhase, reducedMotion])

  // Entrée en pile de la colonne de droite : panneau principal + panneau décalé.
  useEffect(() => {
    const el = panelStackRef.current
    if (!el) return
    const main = el.querySelector<HTMLElement>('[data-panel="main"]')
    const offset = el.querySelector<HTMLElement>('[data-panel="offset"]')
    // const tl = gsap.timeline()
    // if (main) tl.fromTo(main, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, 0)
    // if (offset) tl.fromTo(offset, { opacity: 0, x: 20 }, { opacity: 0.6, x: 10, duration: 0.8 }, 0.3)
    // return () => {
    //   tl.kill()
    // }
  }, [])

  return (
    <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32">
      <BeamsBackground intensity="medium">
        <div className="landing-grain pointer-events-none absolute inset-0 opacity-60" />

        <div className="relative mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-[1.05fr_1fr] lg:gap-12 items-center">
            {/* Left column */}
            <div className="hero-reveal space-y-8">
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
                  // ref={ctaRef}
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

            {/* Right column — multiple report panels */}
            <div ref={panelStackRef} className="relative">
              <div data-panel="main" className="relative z-10">
                <ReportPanel run={animatedRun} phase={animatedPhase} reducedMotion={reducedMotion} />
              </div>

              <div className="absolute inset-0 -translate-x-4 -translate-y-4 scale-95 opacity-40">
                <StaticReportPanel run={runs[1]} />
              </div>

              <div className="absolute inset-0 translate-x-4 translate-y-4 scale-95 opacity-30">
                <StaticReportPanel run={runs[0]} />
              </div>

              <div
                data-panel="offset"
                className="absolute inset-0 translate-x-6 translate-y-6 scale-90 z-0"
              >
                <ReportPanel
                  run={runs[(animatedRunIndex + 1) % runs.length]}
                  phase={animatedPhase === 'scanning' ? 'result' : 'scanning'}
                  reducedMotion={reducedMotion}
                />
              </div>
            </div>
          </div>
        </div>
      </BeamsBackground>
    </section>
  )
}
