import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Globe, Play, AlertCircle } from 'lucide-react'
import { QAWorkflowStates } from './QAWorkflowStates'
import { Checkbox } from '~/components/ui/checkbox'
import type { ScanStatus } from '~/lib/qa/types'
import { createSite, startQAScan, getScanStatus } from '~/lib/api/qa'
import { validateUrl } from '~/lib/qa/utils'

interface NewQAModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: (siteId: string) => void
  userId?: string
}

export function NewQAModal({ isOpen, onClose, onSuccess, userId }: NewQAModalProps) {
  const [step, setStep] = useState<'input' | 'scanning' | 'success' | 'error'>('input')
  const [url, setUrl] = useState('')
  const [scanStatus, setScanStatus] = useState<ScanStatus>('created')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [siteId, setSiteId] = useState<string | null>(null)
  const [scanId, setScanId] = useState<string | null>(null)
  // Consentement légal (spec §6.5) — obligatoire avant tout scan réel.
  // Le timestamp est figé au moment où la case est cochée, pas au
  // moment du submit, pour tracer précisément quand l'utilisateur a
  // donné son accord.
  const [consentGiven, setConsentGiven] = useState(false)
  const [consentConfirmedAt, setConsentConfirmedAt] = useState<string | null>(null)

  const toggleConsent = (checked: boolean) => {
    setConsentGiven(checked)
    setConsentConfirmedAt(checked ? new Date().toISOString() : null)
  }

  const handleStartQA = async () => {
    if (!url.trim()) return

    // Valider l'URL
    const validation = validateUrl(url)
    if (!validation.valid) {
      setError(validation.error || 'URL invalide')
      setStep('error')
      return
    }

    if (!userId) {
      setError('Utilisateur non connecté')
      setStep('error')
      return
    }

    if (!consentGiven || !consentConfirmedAt) {
      setError('Vous devez confirmer être autorisé(e) à tester ce site avant de lancer le QA.')
      setStep('error')
      return
    }

    try {
      setStep('scanning')
      setScanStatus('discovering')
      setProgress(0)
      setError(null)

      // Créer le site
      const site = await createSite(userId, url)
      setSiteId(site.id)

      // Lancer le scan
      const { scanId: newScanId } = await startQAScan(site.id, userId, url, 'full', consentConfirmedAt)
      setScanId(newScanId)

      // Polling du statut du scan
      const pollInterval = setInterval(async () => {
        try {
          const status = await getScanStatus(newScanId)
          if (status) {
            setScanStatus(status)
            
            // Calculer la progression basée sur le statut
            const progressMap: Record<string, number> = {
              'created': 0,
              'discovering': 10,
              'crawling': 30,
              'browser_testing': 60,
              'analyzing': 80,
              'reporting': 90,
              'completed': 100,
              'partial': 100,
              'failed': 0,
              'blocked': 0
            }
            setProgress(progressMap[status] || 0)

            if (status === 'completed') {
              clearInterval(pollInterval)
              setStep('success')
              onSuccess?.(site.id)
            } else if (status === 'failed' || status === 'blocked') {
              clearInterval(pollInterval)
              setError('Le scan a échoué. Veuillez réessayer.')
              setStep('error')
            }
          }
        } catch (err) {
          clearInterval(pollInterval)
          console.error('Erreur lors du polling:', err)
        }
      }, 2000)

      // Timeout après 10 minutes
      setTimeout(() => {
        clearInterval(pollInterval)
        if (step === 'scanning') {
          setError('Le scan prend trop de temps. Veuillez réessayer.')
          setStep('error')
        }
      }, 600000)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du QA. Veuillez réessayer.')
      setStep('error')
    }
  }

  const handleReset = () => {
    setStep('input')
    setUrl('')
    setScanStatus('created')
    setProgress(0)
    setError(null)
    setSiteId(null)
    setScanId(null)
    setConsentGiven(false)
    setConsentConfirmedAt(null)
  }

  const handleClose = () => {
    if (step === 'scanning') return // Prevent closing during scan
    handleReset()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-canvas/80 backdrop-blur-sm"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md bg-surface rounded-xl border border-border shadow-xl mx-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-ink-primary font-display">
            {step === 'input' && 'Nouveau QA'}
            {step === 'scanning' && 'QA en cours'}
            {step === 'success' && 'QA terminé'}
            {step === 'error' && 'Erreur'}
          </h2>
          
          {step !== 'scanning' && (
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-elevated transition-colors"
            >
              <X className="h-4 w-4 text-ink-muted" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            {step === 'input' && (
              <motion.div
                key="input"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <p className="text-ink-secondary mb-4">
                    Entrez l'URL du site que vous souhaitez tester
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-ink-secondary mb-2">
                        URL du site web
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                        <input
                          type="url"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full pl-10 pr-4 py-3 rounded-lg border border-border bg-elevated text-ink-primary placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand"
                          autoFocus
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <label className="flex items-start gap-3 text-sm text-ink-secondary cursor-pointer select-none">
                  <Checkbox
                    checked={consentGiven}
                    onCheckedChange={toggleConsent}
                    required
                  />
                  <span>
                    Je confirme être autorisé(e) à tester ce site (propriétaire
                    du site, mandaté par le propriétaire, ou environnement de
                    test m'appartenant). Reachly décline toute responsabilité
                    en cas de fausse déclaration.
                  </span>
                </label>

                <div className="flex gap-3">
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 rounded-lg border border-border bg-elevated text-ink-primary hover:bg-surface transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleStartQA}
                    disabled={!url.trim() || !consentGiven}
                    className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-brand text-canvas hover:bg-brand-hover transition-colors disabled:opacity-50 disabled:hover:bg-brand"
                  >
                    <Play className="h-4 w-4" />
                    Lancer QA
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'scanning' && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="text-center">
                  <p className="text-ink-secondary mb-4">
                    Test en cours pour <span className="font-medium text-ink-primary">{url}</span>
                  </p>
                </div>

                <QAWorkflowStates 
                  status={scanStatus}
                  progress={progress}
                />

                <div className="text-center">
                  <p className="text-sm text-ink-muted">
                    Cette opération peut prendre plusieurs minutes...
                  </p>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <Play className="h-8 w-8 text-success" />
                  </motion.div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-ink-primary mb-2">
                    QA terminé avec succès !
                  </h3>
                  <p className="text-ink-secondary">
                    Votre site a été analysé. Consultez les résultats dans le workspace.
                  </p>
                </div>

                <button
                  onClick={handleClose}
                  className="w-full py-3 px-4 rounded-lg bg-brand text-canvas hover:bg-brand-hover transition-colors"
                >
                  Voir les résultats
                </button>
              </motion.div>
            )}

            {step === 'error' && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 text-center"
              >
                <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto">
                  <AlertCircle className="h-8 w-8 text-danger" />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-ink-primary mb-2">
                    Erreur lors du QA
                  </h3>
                  <p className="text-ink-secondary">
                    {error}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 py-3 px-4 rounded-lg border border-border bg-elevated text-ink-primary hover:bg-surface transition-colors"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={handleClose}
                    className="flex-1 py-3 px-4 rounded-lg bg-brand text-canvas hover:bg-brand-hover transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}