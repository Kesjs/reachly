import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { MonitorCard } from '~/components/monitors/MonitorCard'
import { MonitorDrawer } from '~/components/monitors/MonitorDrawer'
import { MonitorStateView } from '~/components/monitors/MonitorStateView'
import { AddMonitorModal } from '~/components/monitors/AddMonitorModal'
import { MonitorSettingsModal } from '~/components/monitors/MonitorSettingsModal'
import type { Monitor } from '~/lib/monitors/types'

export const Route = createFileRoute('/dashboard/')({
  component: MonitorsWorkspace,
})

// TODO backend : ces formulaires sont en mémoire (state local), le temps
// que la table `monitors` existe côté Supabase. Une fois le schéma créé,
// remplacer par une query réelle (comme fetchCurrentBrand côté Reflet) —
// aucune donnée simulée ne doit rester en prod.
const SEED_MONITORS: Monitor[] = []

function MonitorsWorkspace() {
  const [monitors, setMonitors] = useState<Monitor[]>(SEED_MONITORS)
  const [isLoading] = useState(false)
  const [openMonitorId, setOpenMonitorId] = useState<string | null>(null)
  const [settingsMonitorId, setSettingsMonitorId] = useState<string | null>(null)
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [isSubmittingTest, setIsSubmittingTest] = useState(false)

  const openMonitor = monitors.find((m) => m.id === openMonitorId) ?? null
  const settingsMonitor = monitors.find((m) => m.id === settingsMonitorId) ?? null
  const brokenCount = monitors.filter((m) => m.status === 'broken').length

  function handleAddMonitor({ url, email }: { url: string; email: string }) {
    setIsSubmittingTest(true)
    // Simule le premier test (Playwright côté serveur dans la vraie version) :
    // état "testing" immédiat, puis résultat après un court délai.
    const id = crypto.randomUUID()
    const newMonitor: Monitor = {
      id,
      url,
      label: null,
      status: 'testing',
      lastTestedAt: null,
      nextTestAt: null,
      lastSteps: [
        { label: 'Page accessible', ok: true },
        { label: 'Formulaire détecté', ok: true },
        { label: 'Champs remplis', ok: true },
        { label: 'Soumission en cours', ok: true },
      ],
      lastErrorSummary: null,
      aiDiagnosis: null,
      screenshotUrl: null,
      incidents: [],
      alertEmails: [email],
      frequencyMinutes: 60,
    }
    setMonitors((prev) => [newMonitor, ...prev])
    setIsAddOpen(false)
    setIsSubmittingTest(false)
    setOpenMonitorId(id)

    setTimeout(() => {
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                status: 'ok',
                lastTestedAt: new Date().toISOString(),
                nextTestAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
                lastSteps: [...m.lastSteps.slice(0, -1), { label: 'Soumission réussie', ok: true }, { label: 'Confirmation reçue', ok: true }],
              }
            : m,
        ),
      )
    }, 1800)
  }

  function handleRetest(id: string) {
    setMonitors((prev) => prev.map((m) => (m.id === id ? { ...m, status: 'testing' } : m)))
    setTimeout(() => {
      setMonitors((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, status: 'ok', lastTestedAt: new Date().toISOString(), nextTestAt: new Date(Date.now() + m.frequencyMinutes * 60 * 1000).toISOString() }
            : m,
        ),
      )
    }, 1500)
  }

  function handleTogglePause(id: string) {
    setMonitors((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status: m.status === 'paused' ? 'ok' : 'paused' } : m)),
    )
  }

  function handleDelete(id: string) {
    setMonitors((prev) => prev.filter((m) => m.id !== id))
    setOpenMonitorId(null)
  }

  function handleSaveSettings(id: string, changes: { label: string; alertEmails: string[]; frequencyMinutes: number }) {
    setMonitors((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, label: changes.label || null, alertEmails: changes.alertEmails, frequencyMinutes: changes.frequencyMinutes }
          : m,
      ),
    )
    setSettingsMonitorId(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-lg font-semibold text-ink-primary">Formulaires surveillés</h1>
          <p className="mt-0.5 text-sm text-ink-muted">
            {monitors.length === 0
              ? 'Aucun formulaire pour le moment.'
              : brokenCount > 0
                ? `${brokenCount} problème${brokenCount > 1 ? 's' : ''} détecté${brokenCount > 1 ? 's' : ''}`
                : `${monitors.length}/${monitors.length} formulaires OK`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-1.5 rounded-md bg-brand px-3 py-2 text-sm font-medium text-canvas hover:bg-brand-hover"
        >
          <Plus className="size-4" />
          Ajouter
        </button>
      </div>

      {isLoading ? (
        <MonitorStateView state="loading" />
      ) : monitors.length === 0 ? (
        <MonitorStateView
          state="empty"
          action={
            <button
              type="button"
              onClick={() => setIsAddOpen(true)}
              className="rounded-md bg-brand px-3 py-1.5 text-xs font-medium text-canvas hover:bg-brand-hover"
            >
              Tester mon premier formulaire
            </button>
          }
        />
      ) : (
        <div className="space-y-2.5">
          {monitors.map((monitor) => (
            <MonitorCard key={monitor.id} monitor={monitor} onOpen={setOpenMonitorId} onRetest={handleRetest} />
          ))}
        </div>
      )}

      <MonitorDrawer
        monitor={openMonitor}
        onClose={() => setOpenMonitorId(null)}
        onRetest={handleRetest}
        onTogglePause={handleTogglePause}
        onDelete={handleDelete}
        onOpenSettings={(id) => {
          setOpenMonitorId(null)
          setSettingsMonitorId(id)
        }}
      />

      <MonitorSettingsModal
        monitor={settingsMonitor}
        onClose={() => setSettingsMonitorId(null)}
        onSave={handleSaveSettings}
      />

      <AddMonitorModal
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSubmit={handleAddMonitor}
        isSubmitting={isSubmittingTest}
      />
    </div>
  )
}
