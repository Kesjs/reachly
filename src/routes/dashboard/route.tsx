import { createFileRoute, Outlet } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '~/components/ui/tooltip'
import { RefreshCw } from 'lucide-react'
import { AccountMenu } from '~/components/dashboard/AccountMenu'
import { ThemeToggle } from '~/components/ui/theme-toggle'
import { getSupabaseBrowserClient } from '~/lib/supabase/client'
import { cn } from '~/lib/utils'

// Layout Reachly : pas de sidebar, pas de multi-pages — le produit tient sur
// un seul écran (liste des formulaires surveillés + drawer détail au clic).
// Cf. doc produit §6 "Pas besoin d'un dashboard" : léger, l'utilisateur n'a
// pas à y revenir tous les jours.
export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('simulation_mode')) {
      setIsAuthenticated(true)
      return
    }

    const supabase = getSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        window.location.href = '/login'
      }
    }).catch(() => {
      setIsAuthenticated(false)
      window.location.href = '/login'
    })
  }, [])

  if (isAuthenticated === null) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="size-5 animate-spin rounded-full border-2 border-ink-muted/30 border-t-brand" />
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen w-full flex-col bg-canvas text-ink-primary font-sans">
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-surface/90 px-4 sm:px-6 backdrop-blur-md">
        <span className="font-display text-sm font-bold text-white">Reachly</span>

        <div className="flex items-center gap-2 sm:gap-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => {
                  setIsRefreshing(true)
                  window.location.reload()
                }}
                disabled={isRefreshing}
                aria-label="Actualiser"
                className="flex size-8 items-center justify-center rounded-md border border-border bg-surface text-ink-secondary hover:text-ink-primary hover:bg-elevated transition-colors disabled:opacity-60"
              >
                <RefreshCw className={cn('size-4', isRefreshing && 'animate-spin')} />
              </button>
            </TooltipTrigger>
            <TooltipContent>Actualiser</TooltipContent>
          </Tooltip>
          <ThemeToggle />
          <AccountMenu variant="header" />
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}
