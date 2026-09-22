import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { SectionCard } from '~/components/ui/section-card'
import { getSupabaseBrowserClient } from '~/lib/supabase/client'

// Paramètres de COMPTE (email, abonnement) — distinct des réglages d'un
// formulaire (fréquence, alertes), qui vivent dans MonitorSettingsModal
// directement depuis le drawer. TODO backend : plan réel une fois la table
// de facturation/abonnement branchée.
export const Route = createFileRoute('/dashboard/parametres')({
  component: AccountSettings,
})

function AccountSettings() {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => setEmail(data?.user?.email ?? null))
  }, [])

  return (
    <div className="space-y-5">
      <h1 className="font-display text-lg font-semibold text-ink-primary">Paramètres du compte</h1>

      <SectionCard title="Compte" description="Informations de connexion.">
        <p className="text-sm text-ink-primary">{email ?? '—'}</p>
      </SectionCard>

      <SectionCard title="Abonnement" description="Plan actuel et limites.">
        <div className="flex items-center justify-between rounded-md border border-border bg-elevated p-4">
          <div>
            <p className="text-sm font-medium text-ink-primary">Test gratuit</p>
            <p className="mt-0.5 text-xs text-ink-muted">1 test manuel, sans surveillance automatique</p>
          </div>
          <span className="rounded-full bg-ink-muted/10 px-2 py-0.5 text-[11px] font-medium text-ink-secondary">
            Actuel
          </span>
        </div>
        <p className="mt-3 text-xs text-ink-muted">
          Passez à Monitor (9€/mois) pour activer la surveillance automatique.
        </p>
      </SectionCard>
    </div>
  )
}
