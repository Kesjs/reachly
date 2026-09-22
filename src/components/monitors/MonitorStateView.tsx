import type { LucideIcon } from 'lucide-react'
import {
  Loader2,
  Search,
  CheckCircle2,
  Inbox,
  XCircle,
  PauseCircle,
  Clock,
} from 'lucide-react'
import { cn } from '~/lib/utils'
import { Skeleton } from '~/components/ui/skeleton'

// États visuels d'un moniteur Reachly. Contrairement au système Reflet
// (11 états, pensé pour des pages d'analyse), Reachly n'a qu'un objet —
// le formulaire surveillé — donc un système réduit à 7 états couvre tout
// l'écran unique du workspace (liste + drawer détail).
export type MonitorStateKind =
  | 'loading'
  | 'empty'
  | 'testing'
  | 'ok'
  | 'broken'
  | 'paused'
  | 'stale'

interface StateConfig {
  icon: LucideIcon
  defaultTitle: string
  defaultDescription: string
  tone: 'neutral' | 'brand' | 'warning' | 'danger' | 'success'
  spin?: boolean
}

const STATE_CONFIG: Record<MonitorStateKind, StateConfig> = {
  loading: {
    icon: Loader2,
    defaultTitle: 'Chargement…',
    defaultDescription: 'Récupération de vos formulaires surveillés.',
    tone: 'neutral',
    spin: true,
  },
  empty: {
    icon: Inbox,
    defaultTitle: 'Aucun formulaire surveillé',
    defaultDescription: 'Ajoutez l\u2019URL d\u2019un formulaire pour lancer votre premier test.',
    tone: 'neutral',
  },
  testing: {
    icon: Search,
    defaultTitle: 'Test en cours…',
    defaultDescription: 'Reachly ouvre la page, remplit le formulaire et vérifie la soumission.',
    tone: 'brand',
    spin: true,
  },
  ok: {
    icon: CheckCircle2,
    defaultTitle: 'Votre formulaire fonctionne',
    defaultDescription: 'Dernière soumission testée avec succès.',
    tone: 'success',
  },
  broken: {
    icon: XCircle,
    defaultTitle: 'Problème détecté',
    defaultDescription: 'La soumission du formulaire échoue.',
    tone: 'danger',
  },
  paused: {
    icon: PauseCircle,
    defaultTitle: 'Surveillance suspendue',
    defaultDescription: 'Ce formulaire n\u2019est plus testé automatiquement.',
    tone: 'neutral',
  },
  stale: {
    icon: Clock,
    defaultTitle: 'Aucun test récent',
    defaultDescription: 'Le dernier test date de plusieurs jours — relancez un test pour vérifier.',
    tone: 'warning',
  },
}

const TONE_CLASSES: Record<StateConfig['tone'], string> = {
  neutral: 'text-ink-muted',
  brand: 'text-brand-text',
  warning: 'text-warning',
  danger: 'text-danger',
  success: 'text-success',
}

export interface MonitorStateViewProps {
  state: MonitorStateKind
  title?: string
  description?: string
  /** Compact = ligne inline (dans une card déjà existante, ex. le drawer). Par défaut : bloc centré. */
  compact?: boolean
  /** false quand l'appelant fournit déjà sa propre card. */
  card?: boolean
  className?: string
  action?: React.ReactNode
}

export function MonitorStateView({
  state,
  title,
  description,
  compact = false,
  card = true,
  className,
  action,
}: MonitorStateViewProps) {
  const config = STATE_CONFIG[state]
  const Icon = config.icon

  if (compact) {
    return (
      <div className={cn('flex items-start gap-2.5 py-2', className)}>
        <Icon className={cn('mt-0.5 size-4 shrink-0', TONE_CLASSES[config.tone], config.spin && 'animate-spin')} />
        <div>
          <p className="text-sm font-medium text-ink-primary">{title ?? config.defaultTitle}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{description ?? config.defaultDescription}</p>
        </div>
      </div>
    )
  }

  const wrapperClass = cn(
    'flex min-h-[40vh] flex-col items-center justify-center gap-2 text-center',
    card && 'rounded-lg border border-border bg-surface p-8',
    className,
  )

  if (state === 'loading') {
    return (
      <div className={cn(wrapperClass, 'gap-4')}>
        <Icon className={cn('size-6', TONE_CLASSES[config.tone], config.spin && 'animate-spin')} />
        <div className="flex w-full max-w-sm flex-col items-center space-y-3">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  return (
    <div className={wrapperClass}>
      <Icon className={cn('size-6', TONE_CLASSES[config.tone], config.spin && 'animate-spin')} />
      <p className="font-display text-lg font-semibold text-ink-primary">{title ?? config.defaultTitle}</p>
      <p className="max-w-sm text-sm text-ink-muted">{description ?? config.defaultDescription}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

// Dérive l'état temporel d'un moniteur à partir de son dernier test —
// distingue OK / Stale (pas testé depuis longtemps), même logique que
// deriveRunFreshness côté Reflet mais seuil plus court (produit temps réel,
// pas hebdomadaire).
export function deriveMonitorFreshness(lastTestedAt: string | null, staleAfterHours = 6): 'ok' | 'stale' {
  if (!lastTestedAt) return 'stale'
  const hours = (Date.now() - new Date(lastTestedAt).getTime()) / (1000 * 60 * 60)
  return hours > staleAfterHours ? 'stale' : 'ok'
}
