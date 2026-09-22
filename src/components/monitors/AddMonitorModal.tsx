import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { X, Loader2 } from 'lucide-react'

export function AddMonitorModal({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (input: { url: string; email: string }) => void
  isSubmitting?: boolean
}) {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!url.trim() || !email.trim()) return
    onSubmit({ url: url.trim(), email: email.trim() })
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border border-border bg-canvas p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <Dialog.Title className="font-display text-sm font-semibold text-ink-primary">
              Tester un formulaire
            </Dialog.Title>
            <Dialog.Close aria-label="Fermer" className="text-ink-muted hover:text-ink-primary">
              <X className="size-4" />
            </Dialog.Close>
          </div>
          <Dialog.Description className="mt-1 text-xs text-ink-muted">
            Reachly ouvre la page, remplit le formulaire et vérifie que la demande part réellement.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <div>
              <label htmlFor="monitor-url" className="text-xs font-medium text-ink-secondary">
                URL du formulaire
              </label>
              <input
                id="monitor-url"
                type="url"
                required
                placeholder="https://monsite.com/contact"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 font-mono text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <div>
              <label htmlFor="monitor-email" className="text-xs font-medium text-ink-secondary">
                Email pour les alertes
              </label>
              <input
                id="monitor-email"
                type="email"
                required
                placeholder="contact@entreprise.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-medium text-canvas hover:bg-brand-hover disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              Tester mon formulaire
            </button>
            <p className="text-center text-[11px] text-ink-muted">Test gratuit · Aucune carte bancaire</p>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
