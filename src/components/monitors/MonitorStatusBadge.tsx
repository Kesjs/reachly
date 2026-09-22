import { cn } from '~/lib/utils'
import type { MonitorStatus } from '~/lib/monitors/types'

const STATUS_CONFIG: Record<MonitorStatus, { label: string; dot: string; text: string; bg: string }> = {
  ok: { label: 'Fonctionne', dot: 'bg-success', text: 'text-success', bg: 'bg-success/10' },
  broken: { label: 'Problème détecté', dot: 'bg-danger', text: 'text-danger', bg: 'bg-danger/10' },
  testing: { label: 'Test en cours', dot: 'bg-brand animate-pulse', text: 'text-brand-text', bg: 'bg-brand/10' },
  paused: { label: 'Suspendu', dot: 'bg-ink-muted', text: 'text-ink-secondary', bg: 'bg-ink-muted/10' },
}

export function MonitorStatusBadge({ status }: { status: MonitorStatus }) {
  const c = STATUS_CONFIG[status]
  return (
    <div className={cn('inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium', c.bg, c.text)}>
      <span className={cn('size-1.5 rounded-full', c.dot)} />
      {c.label}
    </div>
  )
}
