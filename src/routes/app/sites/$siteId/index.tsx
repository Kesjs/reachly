import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  AlertTriangle, 
  XCircle, 
  Clock, 
  ExternalLink,
  RotateCcw,
  FileText,
  Share
} from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { getSiteById } from '~/lib/mock-data/qa-data'
import type { Site, QAScan, Issue } from '~/lib/types/qa'

export const Route = createFileRoute('/app/sites/$siteId/')({
  component: SiteWorkspace,
})

function SiteWorkspace() {
  const { siteId } = Route.useParams()
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'checks' | 'pages' | 'evidence' | 'history'>('overview')
  
  // Mock: récupérer le site par ID
  const site = getSiteById(siteId)
  
  if (!site) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-ink-primary mb-2">Site non trouvé</h2>
          <Link to="/dashboard" className="text-brand-text hover:underline">
            ← Retour au dashboard
          </Link>
        </div>
      </div>
    )
  }
  
  const lastScan = site.lastScan
  const isReadyToShip = lastScan && lastScan.issues === 0
  
  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <div className="border-b border-border bg-surface/40 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 text-ink-muted hover:text-ink-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
              
              <div className="border-l border-border pl-4">
                <h1 className="text-xl font-semibold text-ink-primary font-display">
                  {site.name}
                </h1>
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <ExternalLink className="h-3 w-3" />
                  <span>{site.url}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-ink-primary hover:bg-surface transition-colors">
                <Share className="h-4 w-4" />
                Partager
              </button>
              <button className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-4 py-2 text-sm font-medium text-ink-primary hover:bg-surface transition-colors">
                <FileText className="h-4 w-4" />
                Rapport
              </button>
              <button className="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-canvas hover:bg-brand-hover transition-colors">
                <RotateCcw className="h-4 w-4" />
                Relancer QA
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-b border-border bg-surface/20">
        <div className="mx-auto max-w-6xl px-6">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview' },
              { key: 'issues', label: 'Issues', count: lastScan?.issues },
              { key: 'checks', label: 'Checks' },
              { key: 'pages', label: 'Pages', count: lastScan?.pagesDiscovered },
              { key: 'evidence', label: 'Evidence' },
              { key: 'history', label: 'History' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`border-b-2 px-1 py-4 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'border-brand text-brand'
                    : 'border-transparent text-ink-muted hover:text-ink-primary hover:border-border'
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-2 rounded-full bg-elevated px-2 py-0.5 text-xs">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-6 py-8">
        {activeTab === 'overview' && <OverviewTab site={site} />}
        {activeTab === 'issues' && <IssuesTab site={site} />}
        {activeTab === 'checks' && <ChecksTab site={site} />}
        {activeTab === 'pages' && <PagesTab site={site} />}
        {activeTab === 'evidence' && <EvidenceTab site={site} />}
        {activeTab === 'history' && <HistoryTab site={site} />}
      </div>
    </div>
  )
}

function OverviewTab({ site }: { site: Site }) {
  const lastScan = site.lastScan
  const isReadyToShip = lastScan && lastScan.issues === 0
  
  if (!lastScan) {
    return (
      <div className="text-center py-16">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand/10">
          <Play className="h-8 w-8 text-brand" />
        </div>
        <h2 className="text-xl font-semibold text-ink-primary mb-2 font-display">
          Aucun QA effectué
        </h2>
        <p className="text-ink-secondary mb-6">
          Lancez votre premier QA pour ce site
        </p>
        <button className="inline-flex items-center gap-2 rounded-lg bg-brand px-6 py-3 font-medium text-canvas hover:bg-brand-hover transition-colors">
          <Play className="h-5 w-5" />
          Lancer le premier QA
        </button>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* QA Status */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-ink-primary font-display">
            Statut QA
          </h2>
          <div className="text-sm text-ink-muted">
            {lastScan.duration} · {new Date(lastScan.endTime!).toLocaleDateString('fr')}
          </div>
        </div>
        
        <div className={`inline-flex items-center gap-3 rounded-lg px-4 py-3 ${
          isReadyToShip 
            ? 'bg-success/10 text-success' 
            : 'bg-danger/10 text-danger'
        }`}>
          {isReadyToShip ? (
            <>
              <CheckCircle className="h-6 w-6" />
              <div>
                <div className="font-medium">✓ Prêt à livrer</div>
                <div className="text-sm opacity-80">Aucun problème critique détecté</div>
              </div>
            </>
          ) : (
            <>
              <XCircle className="h-6 w-6" />
              <div>
                <div className="font-medium">✕ {lastScan.issues} problème{lastScan.issues > 1 ? 's' : ''} à corriger</div>
                <div className="text-sm opacity-80">Correction nécessaire avant livraison</div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Pages"
          value={lastScan.pagesDiscovered.toString()}
          icon={ExternalLink}
          color="text-info"
        />
        <StatCard
          label="Checks"
          value={lastScan.totalChecks.toString()}
          icon={CheckCircle}
          color="text-ink-primary"
        />
        <StatCard
          label="Durée"
          value={lastScan.duration!}
          icon={Clock}
          color="text-ink-secondary"
        />
        <StatCard
          label="Score"
          value={`${Math.round((lastScan.passed / lastScan.totalChecks) * 100)}%`}
          icon={CheckCircle}
          color="text-success"
        />
      </div>

      {/* Results Breakdown */}
      <div className="rounded-xl border border-border bg-surface p-6">
        <h3 className="text-lg font-semibold text-ink-primary mb-4 font-display">
          Résultats détaillés
        </h3>
        
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-success" />
            <div>
              <div className="font-medium text-ink-primary">{lastScan.passed}</div>
              <div className="text-sm text-ink-muted">Tests réussis</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <div>
              <div className="font-medium text-ink-primary">{lastScan.warnings}</div>
              <div className="text-sm text-ink-muted">Avertissements</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <XCircle className="h-5 w-5 text-danger" />
            <div>
              <div className="font-medium text-ink-primary">{lastScan.issues}</div>
              <div className="text-sm text-ink-muted">Problèmes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Issues Preview */}
      {lastScan.allIssues.length > 0 && (
        <div className="rounded-xl border border-border bg-surface p-6">
          <h3 className="text-lg font-semibold text-ink-primary mb-4 font-display">
            Problèmes critiques
          </h3>
          
          <div className="space-y-3">
            {lastScan.allIssues.filter(i => i.severity === 'critical').slice(0, 3).map((issue) => (
              <div key={issue.id} className="flex items-center gap-3 p-3 rounded-lg bg-danger/5 border border-danger/20">
                <XCircle className="h-4 w-4 text-danger flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium text-ink-primary">{issue.title}</div>
                  <div className="text-sm text-ink-muted">{issue.url}</div>
                </div>
              </div>
            ))}
            
            {lastScan.allIssues.filter(i => i.severity === 'critical').length > 3 && (
              <button 
                onClick={() => setActiveTab('issues')}
                className="text-sm text-brand-text hover:underline"
              >
                Voir tous les problèmes critiques →
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, icon: Icon, color }: {
  label: string
  value: string
  icon: any
  color: string
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-center gap-3">
        <Icon className={`h-5 w-5 ${color}`} />
        <div>
          <div className="text-2xl font-bold text-ink-primary">{value}</div>
          <div className="text-sm text-ink-muted">{label}</div>
        </div>
      </div>
    </div>
  )
}

// Placeholder components pour les autres tabs
function IssuesTab({ site }: { site: Site }) {
  return <div className="text-center py-16 text-ink-muted">Issues tab - À implémenter</div>
}

function ChecksTab({ site }: { site: Site }) {
  return <div className="text-center py-16 text-ink-muted">Checks tab - À implémenter</div>
}

function PagesTab({ site }: { site: Site }) {
  return <div className="text-center py-16 text-ink-muted">Pages tab - À implémenter</div>
}

function EvidenceTab({ site }: { site: Site }) {
  return <div className="text-center py-16 text-ink-muted">Evidence tab - À implémenter</div>
}

function HistoryTab({ site }: { site: Site }) {
  return <div className="text-center py-16 text-ink-muted">History tab - À implémenter</div>
}