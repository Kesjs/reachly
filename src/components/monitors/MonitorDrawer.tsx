import { X, CheckCircle2, XCircle, Settings2 } from 'lucide-react'
import { cn } from '~/lib/utils'
import type { Monitor } from '~/lib/monitors/types'
import { MonitorStatusBadge } from './MonitorStatusBadge'

function formatDateTime(iso: string | null): string {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function MonitorDrawer({
  monitor,
  onClose,
  onRetest,
  onTogglePause,
  onDelete,
  onOpenSettings,
}: {
  monitor: Monitor | null
  onClose: () => void
  onRetest: (id: string) => void
  onTogglePause: (id: string) => void
  onDelete: (id: string) => void
  onOpenSettings: (id: string) => void
}) {
  if (!monitor) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l border-border bg-canvas shadow-2xl">
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-ink-primary">
              {monitor.label ?? monitor.url}
            </p>
            <p className="truncate font-mono text-xs text-ink-muted">{monitor.url}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-muted hover:bg-elevated hover:text-ink-primary"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <MonitorStatusBadge status={monitor.status} />
              <p className="text-xs text-ink-muted">Dernier test · {formatDateTime(monitor.lastTestedAt)}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-ink-muted">Résultat du dernier test</p>
              <ol className="mt-2 space-y-2">
                {monitor.lastSteps.map((step, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-sm">
                    {step.ok ? (
                      <CheckCircle2 className="size-4 shrink-0 text-success" />
                    ) : (
                      <XCircle className="size-4 shrink-0 text-danger" />
                    )}
                    <span className={cn(step.ok ? 'text-ink-secondary' : 'text-ink-primary')}>{step.label}</span>
                  </li>
                ))}
              </ol>
            </div>

            {monitor.status === 'broken' && monitor.aiDiagnosis && (
              <div className="rounded-lg border border-danger/30 bg-danger/5 p-4">
                <p className="text-xs font-semibold text-danger">Diagnostic</p>
                <p className="mt-1.5 text-sm text-ink-primary">{monitor.aiDiagnosis}</p>
              </div>
            )}

            {monitor.screenshotUrl && (
              <div>
                <p className="text-xs font-medium text-ink-muted">Preuve</p>
                <img
                  src={monitor.screenshotUrl}
                  alt="Capture d'écran de l'échec"
                  className="mt-2 w-full rounded-md border border-border"
                />
              </div>
            )}

            <div>
              <p className="text-xs font-medium text-ink-muted">Historique des incidents</p>
              {monitor.incidents.length === 0 ? (
                <p className="mt-2 text-sm text-ink-muted">Aucun incident pour ce formulaire.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {monitor.incidents.map((incident) => (
                    <li key={incident.id} className="rounded-md border border-border bg-elevated p-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-ink-primary">
                          Incident confirmé {formatDateTime(incident.startedAt)}
                        </span>
                        <span className={incident.resolvedAt ? 'text-success' : 'text-danger'}>
                          {incident.resolvedAt ? `Résolu ${formatDateTime(incident.resolvedAt)}` : 'En cours'}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-ink-secondary">{incident.errorSummary}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-border p-5">
          <button
            type="button"
            onClick={() => onRetest(monitor.id)}
            className="flex-1 rounded-md bg-brand px-3 py-2 text-sm font-medium text-canvas hover:bg-brand-hover"
          >
            Relancer un test
          </button>
          <button
            type="button"
            onClick={() => onOpenSettings(monitor.id)}
            aria-label="Réglages"
            className="flex size-9 items-center justify-center rounded-md border border-border text-ink-secondary hover:bg-elevated"
          >
            <Settings2 className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => onTogglePause(monitor.id)}
            className="rounded-md border border-border px-3 py-2 text-sm text-ink-secondary hover:bg-elevated"
          >
            {monitor.status === 'paused' ? 'Reprendre' : 'Suspendre'}
          </button>
          <button
            type="button"
            onClick={() => onDelete(monitor.id)}
            className="rounded-md border border-danger/30 px-3 py-2 text-sm text-danger hover:bg-danger/10"
          >
            Supprimer
          </button>
        </div>
      </aside>
    </>
  )
}
