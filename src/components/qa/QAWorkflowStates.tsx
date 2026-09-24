import { motion } from 'framer-motion'
import { 
  Globe, 
  TestTube2, 
  Monitor, 
  Camera, 
  FileCheck,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react'
import type { ScanStatus } from '~/lib/qa/types'

interface QAWorkflowStatesProps {
  status: ScanStatus
  progress?: number
  currentStep?: string
  className?: string
}

export function QAWorkflowStates({ status, progress = 0, currentStep, className = "" }: QAWorkflowStatesProps) {
  const getStepConfig = (stepStatus: ScanStatus) => {
    switch (stepStatus) {
      case 'created':
        return {
          label: 'En attente',
          description: 'Prêt à lancer le QA',
          icon: Clock,
          color: 'text-ink-muted',
          bg: 'bg-ink-muted/10'
        }
      case 'discovering':
        return {
          label: 'Découverte des pages',
          description: 'Analyse de la structure du site...',
          icon: Globe,
          color: 'text-info',
          bg: 'bg-info/10',
          loading: true
        }
      case 'crawling':
        return {
          label: 'Exploration du site',
          description: 'Parcours des pages et vérification des liens...',
          icon: TestTube2,
          color: 'text-info',
          bg: 'bg-info/10',
          loading: true
        }
      case 'browser_testing':
        return {
          label: 'Tests navigateur',
          description: 'Validation des formulaires et des erreurs JS/réseau...',
          icon: Monitor,
          color: 'text-info',
          bg: 'bg-info/10',
          loading: true
        }
      case 'analyzing':
        return {
          label: 'Analyse',
          description: 'Analyse visuelle et vérifications des résultats...',
          icon: Camera,
          color: 'text-info',
          bg: 'bg-info/10',
          loading: true
        }
      case 'reporting':
        return {
          label: 'Finalisation',
          description: 'Génération du rapport...',
          icon: FileCheck,
          color: 'text-info',
          bg: 'bg-info/10',
          loading: true
        }
      case 'completed':
        return {
          label: 'QA terminé',
          description: 'Rapport disponible',
          icon: CheckCircle,
          color: 'text-success',
          bg: 'bg-success/10'
        }
      case 'partial':
        return {
          label: 'QA partiellement terminé',
          description: 'Certains tests ont échoué',
          icon: AlertTriangle,
          color: 'text-warning',
          bg: 'bg-warning/10'
        }
      case 'failed':
        return {
          label: 'QA échoué',
          description: 'Le processus a rencontré une erreur',
          icon: XCircle,
          color: 'text-danger',
          bg: 'bg-danger/10'
        }
      case 'blocked':
        return {
          label: 'Site inaccessible',
          description: 'Le site ne peut pas être testé',
          icon: XCircle,
          color: 'text-danger',
          bg: 'bg-danger/10'
        }
      default:
        return {
          label: 'Statut inconnu',
          description: '',
          icon: Clock,
          color: 'text-ink-muted',
          bg: 'bg-ink-muted/10'
        }
    }
  }

  const config = getStepConfig(status)
  const Icon = config.icon
  const isLoading = config.loading && (status !== 'completed' && status !== 'failed' && status !== 'blocked')

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border border-border bg-surface p-6 ${className}`}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${config.bg}`}>
          {isLoading ? (
            <Loader2 className={`h-6 w-6 animate-spin ${config.color}`} />
          ) : (
            <Icon className={`h-6 w-6 ${config.color}`} />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold ${config.color}`}>
            {config.label}
          </h3>
          <p className="text-sm text-ink-muted">
            {currentStep || config.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {isLoading && progress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-ink-muted">Progression</span>
            <span className="font-medium text-ink-primary">{progress}%</span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-brand h-2 rounded-full"
            />
          </div>
        </div>
      )}
    </motion.div>
  )
}

// Composant pour afficher l'historique des étapes
interface QAStepsTimelineProps {
  status: ScanStatus
  startTime: string
  endTime?: string
  className?: string
}

export function QAStepsTimeline({ status, startTime, endTime, className = "" }: QAStepsTimelineProps) {
  const steps = [
    { key: 'discovering', label: 'Découverte', duration: '~2min' },
    { key: 'crawling', label: 'Exploration du site', duration: '~3min' },
    { key: 'browser_testing', label: 'Tests navigateur', duration: '~2min' },
    { key: 'analyzing', label: 'Analyse', duration: '~1min' },
    { key: 'reporting', label: 'Finalisation', duration: '~30s' },
  ]

  const getStepStatus = (stepKey: string): 'completed' | 'current' | 'pending' => {
    const stepOrder = ['discovering', 'crawling', 'browser_testing', 'analyzing', 'reporting']
    const currentIndex = stepOrder.indexOf(status)
    const stepIndex = stepOrder.indexOf(stepKey)
    
    if (status === 'completed') return 'completed'
    if (stepIndex < currentIndex) return 'completed'
    if (stepIndex === currentIndex) return 'current'
    return 'pending'
  }

  return (
    <div className={`rounded-xl border border-border bg-surface p-6 ${className}`}>
      <h3 className="font-semibold text-ink-primary mb-4">Étapes du QA</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => {
          const stepStatus = getStepStatus(step.key)
          
          return (
            <div key={step.key} className="flex items-center gap-3">
              {/* Step indicator */}
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                stepStatus === 'completed' 
                  ? 'bg-success text-canvas' 
                  : stepStatus === 'current'
                  ? 'bg-brand text-canvas'
                  : 'bg-border text-ink-muted'
              }`}>
                {stepStatus === 'completed' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : stepStatus === 'current' ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <span className="text-xs font-medium">{index + 1}</span>
                )}
              </div>
              
              {/* Step content */}
              <div className="flex-1">
                <div className={`font-medium ${
                  stepStatus === 'completed' ? 'text-success' :
                  stepStatus === 'current' ? 'text-brand' : 'text-ink-muted'
                }`}>
                  {step.label}
                </div>
                <div className="text-sm text-ink-muted">
                  {step.duration}
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Duration */}
      <div className="mt-6 pt-4 border-t border-border text-sm text-ink-muted">
        {endTime ? (
          <span>Terminé en {calculateDuration(startTime, endTime)}</span>
        ) : (
          <span>Démarré {new Date(startTime).toLocaleTimeString('fr')}</span>
        )}
      </div>
    </div>
  )
}

function calculateDuration(start: string, end: string): string {
  const diff = new Date(end).getTime() - new Date(start).getTime()
  const minutes = Math.floor(diff / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)
  return `${minutes}m ${seconds}s`
}