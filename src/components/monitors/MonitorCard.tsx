import { RefreshCw } from 'lucide-react'
import { cn } from '~/lib/utils'
import type { Monitor } from '~/lib/monitors/types'
import { MonitorStatusBadge } from './MonitorStatusBadge'

function formatRelative(iso: string | null, kind: 'past' | 'future'): string {
  if (!iso) return '—'
  const diffMs = new Date(iso).getTime() - Date.now()
  const diffMin = Math.round(Math.abs(diffMs) / 60000)
  if (kind === 'past') {
    if (diffMin < 1) return 'à l\u2019instant'
    if (diffMin < 60) return `il y a ${diffMin} min`
    return `il y a ${Math.round(diffMin / 60)} h`
  }
  if (diffMin < 1) return 'imminent'
  if (diffMin < 60) return `dans ${diffMin} min`
  return `dans ${Math.round(diffMin / 60)} h`
}

export function MonitorCard({
  monitor,
  onOpen,
  onRetest,
}: {
  monitor: Monitor
  onOpen: (id: string) => void
  onRetest: (id: string) => void
}) {
  const isBroken = monitor.status === 'broken'

  return (
    <button
      type="button"
      onClick={() => onOpen(monitor.id)}
      className={cn(
        'flex w-full flex-col gap-3 rounded-lg border bg-surface p-4 text-left transition-colors hover:bg-elevated sm:flex-row sm:items-center sm:justify-between',
        isBroken ? 'border-danger/40' : 'border-border',
      )}
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="truncate font-display text-sm font-semibold text-ink-primary">
            {monitor.label ?? monitor.url}
          </p>
          <MonitorStatusBadge status={monitor.status} />
        </div>
        <p className="mt-0.5 truncate font-mono text-xs text-ink-muted">{monitor.url}</p>
        {isBroken && monitor.lastErrorSummary && (
          <p className="mt-1.5 text-xs text-danger">{monitor.lastErrorSummary}</p>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4 text-xs text-ink-muted">
        <div className="text-right">
          <p>Dernier test</p>
          <p className="text-ink-secondary">{formatRelative(monitor.lastTestedAt, 'past')}</p>
        </div>
        <div className="text-right">
          <p>Prochain test</p>
          <p className="text-ink-secondary">
            {monitor.status === 'paused' ? 'suspendu' : formatRelative(monitor.nextTestAt, 'future')}
          </p>
        </div>
        <span
          role="button"
          aria-label="Relancer un test"
          onClick={(e) => {
            e.stopPropagation()
            onRetest(monitor.id)
          }}
          className="flex size-8 items-center justify-center rounded-md text-ink-muted hover:bg-canvas hover:text-ink-primary"
        >
          <RefreshCw className="size-3.5" />
        </span>
      </div>
    </button>
  )
}
