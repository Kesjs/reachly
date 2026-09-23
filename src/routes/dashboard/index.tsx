import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, AlertTriangle, CheckCircle, Clock, ExternalLink } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { getUserSites } from '~/lib/api/qa'
import { NewQAModal } from '~/components/qa/NewQAModal'
import type { Site } from '~/lib/types/qa'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const [websites, setWebsites] = useState<Site[]>([])
  const [loading, setLoading] = useState(true)
  const [isNewQAModalOpen, setIsNewQAModalOpen] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    // Récupérer l'ID utilisateur depuis l'auth Supabase
    const fetchSites = async () => {
      try {
        // Pour l'instant, utiliser un ID utilisateur fictif
        // Dans une vraie implémentation, récupérer depuis auth
        const mockUserId = 'mock-user-id'
        setUserId(mockUserId)
        
        const sites = await getUserSites(mockUserId)
        
        // Transformer les données Supabase en format Site
        const transformedSites = sites.map(site => ({
          id: site.id,
          name: site.name || new URL(site.url).hostname,
          url: site.url,
          createdAt: site.created_at,
          lastScan: site.scans?.[0] ? {
            id: site.scans[0].id,
            siteId: site.id,
            status: site.scans[0].status as any,
            startTime: site.scans[0].created_at,
            endTime: site.scans[0].completed_at || undefined,
            duration: site.scans[0].completed_at 
              ? `${Math.round((new Date(site.scans[0].completed_at).getTime() - new Date(site.scans[0].created_at).getTime()) / 60000)}m`
              : undefined,
            pagesDiscovered: site.scans[0].pages_discovered,
            totalChecks: site.scans[0].checks_total,
            passed: site.scans[0].checks_passed,
            warnings: site.scans[0].checks_warning,
            issues: site.scans[0].critical_count + site.scans[0].major_count,
            pages: [],
            allIssues: [],
            checks: []
          } : undefined,
          scanHistory: []
        }))
        
        setWebsites(transformedSites)
      } catch (error) {
        console.error('Erreur lors de la récupération des sites:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSites()
  }, [])

  const needsAttention = websites.filter(w => w.lastScan?.issues && w.lastScan.issues > 0).length
  const totalSites = websites.length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-ink-muted">Chargement...</div>
      </div>
    )
  }

  if (websites.length === 0) {
    return <EmptyDashboard onNewQA={() => setIsNewQAModalOpen(true)} />
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink-primary font-display">
            Vos sites
          </h1>
          {needsAttention > 0 ? (
            <p className="text-sm text-danger mt-1">
              {needsAttention} site{needsAttention > 1 ? 's' : ''} avec des problèmes à corriger
            </p>
          ) : (
            <p className="text-sm text-ink-secondary mt-1">
              {totalSites} site{totalSites > 1 ? 's' : ''} testé{totalSites > 1 ? 's' : ''} · Tous opérationnels
            </p>
          )}
        </div>
        
        <NewQAButton onNewQA={() => setIsNewQAModalOpen(true)} />
      </div>

      {/* Sites Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {websites.map((website, index) => (
          <SiteCard key={website.id} website={website} index={index} />
        ))}
        
        {/* Add Site Card */}
        <AddSiteCard onNewQA={() => setIsNewQAModalOpen(true)} />
      </div>

      {/* New QA Modal */}
      <NewQAModal 
        isOpen={isNewQAModalOpen}
        onClose={() => setIsNewQAModalOpen(false)}
        onSuccess={(siteId) => {
          // Refresh the sites list
          getUserSites(userId || 'mock-user-id').then(sites => {
            const transformedSites = sites.map(site => ({
              id: site.id,
              name: site.name || new URL(site.url).hostname,
              url: site.url,
              createdAt: site.created_at,
              lastScan: site.scans?.[0] ? {
                id: site.scans[0].id,
                siteId: site.id,
                status: site.scans[0].status as any,
                startTime: site.scans[0].created_at,
                endTime: site.scans[0].completed_at || undefined,
                duration: site.scans[0].completed_at 
                  ? `${Math.round((new Date(site.scans[0].completed_at).getTime() - new Date(site.scans[0].created_at).getTime()) / 60000)}m`
                  : undefined,
                pagesDiscovered: site.scans[0].pages_discovered,
                totalChecks: site.scans[0].checks_total,
                passed: site.scans[0].checks_passed,
                warnings: site.scans[0].checks_warning,
                issues: site.scans[0].critical_count + site.scans[0].major_count,
                pages: [],
                allIssues: [],
                checks: []
              } : undefined,
              scanHistory: []
            }))
            setWebsites(transformedSites)
          })
          setIsNewQAModalOpen(false)
        }}
        userId={userId || undefined}
      />
    </div>
  )
}

function SiteCard({ website, index }: { website: Site; index: number }) {
  const qa = website.lastScan
  
  const getStatusConfig = (qa: Site['lastScan']) => {
    if (!qa) return { color: 'text-ink-muted', bg: 'bg-ink-muted/10', label: 'Aucun QA', icon: Clock }
    
    if (qa.issues > 0) {
      return { color: 'text-danger', bg: 'bg-danger/10', label: `${qa.issues} problème${qa.issues > 1 ? 's' : ''}`, icon: AlertTriangle }
    }
    
    if (qa.warnings > 0) {
      return { color: 'text-warning', bg: 'bg-warning/10', label: `${qa.warnings} attention${qa.warnings > 1 ? 's' : ''}`, icon: AlertTriangle }
    }
    
    return { color: 'text-success', bg: 'bg-success/10', label: 'Prêt à livrer', icon: CheckCircle }
  }
  
  const statusConfig = getStatusConfig(qa)
  const StatusIcon = statusConfig.icon

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group rounded-xl border border-border bg-surface p-6 transition-all hover:border-border-strong hover:shadow-lg"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-ink-primary mb-1 truncate">
            {website.name}
          </h3>
          <div className="flex items-center gap-1 text-sm text-ink-muted">
            <ExternalLink className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{website.url.replace('https://', '')}</span>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${statusConfig.bg} ${statusConfig.color} mb-4`}>
        <StatusIcon className="h-3 w-3" />
        {statusConfig.label}
      </div>

      {/* QA Summary */}
      {qa && (
        <div className="space-y-3 mb-4">
          <div className="text-sm text-ink-muted">
            Dernier QA · {new Date(qa.endTime!).toLocaleDateString('fr')}
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-ink-secondary">{qa.passed}</span>
            </div>
            {qa.warnings > 0 && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <span className="text-ink-secondary">{qa.warnings}</span>
              </div>
            )}
            {qa.issues > 0 && (
              <div className="flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-danger" />
                <span className="text-ink-secondary">{qa.issues}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <Link
        to={`/app/sites/${website.id}`}
        className="inline-flex items-center justify-center w-full rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-ink-primary transition-colors hover:bg-surface hover:border-border-strong"
      >
        Ouvrir workspace
      </Link>
    </motion.div>
  )
}

function AddSiteCard({ onNewQA }: { onNewQA: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="flex items-center justify-center rounded-xl border-2 border-dashed border-border bg-elevated/50 p-6 transition-all hover:border-brand/50 hover:bg-brand/5"
    >
      <div className="text-center">
        <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-brand/10">
          <Plus className="h-6 w-6 text-brand" />
        </div>
        <h3 className="font-medium text-ink-primary mb-1">
          Tester un nouveau site
        </h3>
        <p className="text-sm text-ink-muted mb-4">
          Lancez votre premier QA
        </p>
        <NewQAButton variant="full" onNewQA={onNewQA} />
      </div>
    </motion.div>
  )
}

function NewQAButton({ variant = 'compact', onNewQA }: { variant?: 'compact' | 'full'; onNewQA: () => void }) {
  if (variant === 'full') {
    return (
      <button 
        onClick={onNewQA}
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-canvas hover:bg-brand-hover transition-colors"
      >
        <Plus className="h-4 w-4" />
        Nouveau QA
      </button>
    )
  }

  return (
    <button 
      onClick={onNewQA}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-ink-primary hover:bg-surface hover:border-border-strong transition-colors"
    >
      <Plus className="h-4 w-4" />
      Nouveau QA
    </button>
  )
}

function EmptyDashboard({ onNewQA }: { onNewQA: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10">
        <Plus className="h-8 w-8 text-brand" />
      </div>
      
      <h2 className="text-xl font-semibold text-ink-primary mb-2 font-display">
        Aucun site testé pour le moment
      </h2>
      
      <p className="text-ink-secondary mb-2">
        Commencez par tester votre premier site web.
      </p>
      
      <p className="text-sm text-ink-muted mb-8 max-w-md">
        Entrez simplement l'URL de votre site et Reachly effectuera un QA complet 
        pour détecter les problèmes avant la livraison.
      </p>
      
      <button 
        onClick={onNewQA}
        className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-canvas hover:bg-brand-hover transition-colors"
      >
        <Plus className="h-5 w-5" />
        Tester mon premier site
      </button>
    </div>
  )
}