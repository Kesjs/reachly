import { useEffect, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { SelectField } from '~/components/ui/select-field'
import type { Monitor } from '~/lib/monitors/types'

const FREQUENCY_OPTIONS = [
  { value: '30', label: 'Toutes les 30 minutes', hint: 'Pro / Agency' },
  { value: '60', label: 'Toutes les heures' },
  { value: '360', label: 'Toutes les 6 heures' },
  { value: '1440', label: 'Une fois par jour' },
] as const

export function MonitorSettingsModal({
  monitor,
  onClose,
  onSave,
}: {
  monitor: Monitor | null
  onClose: () => void
  onSave: (id: string, changes: { label: string; alertEmails: string[]; frequencyMinutes: number }) => void
}) {
  const [label, setLabel] = useState('')
  const [emails, setEmails] = useState('')
  const [frequency, setFrequency] = useState<string>('60')

  useEffect(() => {
    if (!monitor) return
    setLabel(monitor.label ?? '')
    setEmails(monitor.alertEmails.join(', '))
    setFrequency(String(monitor.frequencyMinutes))
  }, [monitor])

  if (!monitor) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSave(monitor!.id, {
      label: label.trim(),
      alertEmails: emails.split(',').map((e) => e.trim()).filter(Boolean),
      frequencyMinutes: Number(frequency),
    })
  }

  return (
    <Dialog.Root open onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-canvas p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-sm font-semibold text-ink-primary">Réglages</Dialog.Title>
            <Dialog.Close aria-label="Fermer" className="text-ink-muted hover:text-ink-primary">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-1 truncate font-mono text-xs text-ink-muted">
            {monitor.url}
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label htmlFor="monitor-label" className="text-xs font-medium text-ink-secondary">
                Nom du formulaire
              </label>
              <input
                id="monitor-label"
                type="text"
                placeholder="Ex. Formulaire de contact"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>

            <div>
              <p className="text-xs font-medium text-ink-secondary">Fréquence de test</p>
              <SelectField
                className="mt-1"
                ariaLabel="Fréquence de test"
                value={frequency}
                onChange={setFrequency}
                options={FREQUENCY_OPTIONS as unknown as { value: string; label: string; hint?: string }[]}
              />
            </div>

            <div>
              <label htmlFor="monitor-emails" className="text-xs font-medium text-ink-secondary">
                Email(s) d'alerte
              </label>
              <input
                id="monitor-emails"
                type="text"
                placeholder="contact@entreprise.com, autre@entreprise.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
              <p className="mt-1 text-[11px] text-ink-muted">Séparez plusieurs adresses par une virgule.</p>
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-brand px-3 py-2 text-sm font-medium text-canvas hover:bg-brand-hover"
            >
              Enregistrer
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
