import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Play, Settings, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/forms/$id')({
  component: FormDetailPage,
})

interface FormDetail {
  id: string
  name: string
  url: string
  status: 'operational' | 'failing' | 'testing'
  lastChecked: string
  frequency: string
  totalChecks: number
  incidents: number
  currentIncident?: {
    firstDetected: string
    confirmed: string
    duration: string
    error: string
    description: string
  }
}

interface Check {
  time: string
  status: 'success' | 'error'
}

function FormDetailPage() {
  const navigate = useNavigate()
  const { id } = Route.useParams()
  
  // Mock data - à remplacer par les vraies données
  const [form] = useState<FormDetail>({
    id,
    name: 'Contact form',
    url: 'https://acme.com/contact',
    status: 'failing', // Changez en 'operational' pour voir l'état normal
    lastChecked: '4 minutes ago',
    frequency: 'Every hour',
    totalChecks: 247,
    incidents: 1,
    currentIncident: {
      firstDetected: '12:00',
      confirmed: '12:02',
      duration: '37 minutes',
      error: 'HTTP 500',
      description: 'The form loads correctly, but the server fails when processing the submission.',
    },
  })

  const [recentChecks] = useState<Check[]>([
    { time: '12:00', status: 'error' },
    { time: '11:00', status: 'success' },
    { time: '10:00', status: 'success' },
    { time: '09:00', status: 'success' },
    { time: '08:00', status: 'success' },
  ])

  const [isTestingNow, setIsTestingNow] = useState(false)

  async function handleTestNow() {
    setIsTestingNow(true)
    toast.loading('Testing form...')
    
    // Simulation du test
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.dismiss()
    toast.success('Test completed - Form is now working!')
    setIsTestingNow(false)
  }

  const isIncident = form.status === 'failing'

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-border bg-surface/40 backdrop-blur">
        <div className="mx-auto max-w-4xl px-6 py-4">
          <button
            onClick={() => navigate({ to: '/app' })}
            className="flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary"
          >
            <ArrowLeft className="size-4" />
            Forms
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="space-y-8">
          {/* Header avec statut */}
          <div>
            <h1 className="text-2xl font-semibold text-ink-primary mb-2">{form.name}</h1>
            
            {isIncident ? (
              <div className="flex items-center gap-2 mb-4">
                <span className="text-danger text-lg">🔴</span>
                <span className="font-medium text-danger">Incident detected</span>
              </div>
            ) : (
              <div className="flex items-center gap-3 mb-4">
                <span className="flex items-center gap-1.5 rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success">
                  ● Operational
                </span>
              </div>
            )}
            
            <div className="flex items-center gap-6 text-sm text-ink-secondary">
              <span>Last checked {form.lastChecked}</span>
              <span>{form.url}</span>
            </div>
          </div>

          {/* Incident details si actuel */}
          {isIncident && form.currentIncident && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-danger/20 bg-danger/5 p-6"
            >
              <h2 className="font-medium text-ink-primary mb-4">The form is currently failing.</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div>
                  <div className="text-xs font-medium text-ink-secondary uppercase tracking-wide mb-1">First detected</div>
                  <div className="text-ink-primary">{form.currentIncident.firstDetected}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-ink-secondary uppercase tracking-wide mb-1">Confirmed</div>
                  <div className="text-ink-primary">{form.currentIncident.confirmed}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-ink-secondary uppercase tracking-wide mb-1">Duration</div>
                  <div className="text-ink-primary">{form.currentIncident.duration}</div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-ink-primary mb-2">What happened?</h3>
                  <div className="space-y-1">
                    <div className="font-mono text-sm text-danger">{form.currentIncident.error}</div>
                    <div className="text-sm text-ink-muted">POST /api/contact</div>
                    <p className="text-sm text-ink-secondary">{form.currentIncident.description}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-ink-primary mb-2">Evidence</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="size-3" />
                      <span>Page accessible</span>
                    </div>
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="size-3" />
                      <span>Form detected</span>
                    </div>
                    <div className="flex items-center gap-2 text-success">
                      <CheckCircle className="size-3" />
                      <span>Fields filled</span>
                    </div>
                    <div className="flex items-center gap-2 text-danger">
                      <XCircle className="size-3" />
                      <span>Submission failed</span>
                    </div>
                  </div>
                  
                  <button className="mt-3 text-sm text-brand hover:underline">
                    View technical details
                  </button>
                </div>

                <div>
                  <h4 className="font-medium text-ink-primary mb-2">AI diagnosis</h4>
                  <div className="rounded-lg bg-elevated p-4">
                    <p className="text-sm text-ink-secondary mb-3">
                      The failure appears to originate from the /contact API endpoint.
                    </p>
                    <div className="text-sm">
                      <div className="font-medium text-ink-primary mb-1">Recommended action:</div>
                      <div className="text-ink-secondary">Check your server logs and recent changes to the endpoint.</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Monitoring overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-medium text-ink-primary mb-4">Monitoring</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">Frequency</span>
                  <span className="text-ink-primary">{form.frequency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">Total checks</span>
                  <span className="text-ink-primary">{form.totalChecks} successful</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-ink-secondary">Incidents</span>
                  <span className="text-ink-primary">{form.incidents} incident{form.incidents !== 1 ? 's' : ''}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-ink-primary mb-4">Recent checks</h3>
              <div className="space-y-2">
                {recentChecks.map((check, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-ink-secondary">{check.time}</span>
                    <div className="flex items-center gap-2">
                      {check.status === 'success' ? (
                        <>
                          <CheckCircle className="size-3 text-success" />
                          <span className="text-success">Passed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="size-3 text-danger" />
                          <span className="text-danger">Failed</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Incidents section */}
          <div>
            <h3 className="font-medium text-ink-primary mb-4">Incidents</h3>
            {!isIncident ? (
              <p className="text-ink-secondary">No active incidents.</p>
            ) : (
              <div className="rounded-lg border border-border bg-elevated p-4">
                <div className="flex items-center gap-3">
                  <div className="size-2 rounded-full bg-danger" />
                  <div>
                    <div className="font-medium text-ink-primary">Active incident</div>
                    <div className="text-sm text-ink-secondary">Started {form.currentIncident?.firstDetected}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={handleTestNow}
              disabled={isTestingNow}
              className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-4 py-2 font-medium text-ink-primary transition-colors hover:bg-surface disabled:opacity-50"
            >
              <Play className="size-4" />
              {isTestingNow ? 'Testing...' : 'Test now'}
            </button>
            
            <button className="flex items-center gap-2 rounded-lg border border-border bg-elevated px-4 py-2 font-medium text-ink-primary transition-colors hover:bg-surface">
              <Settings className="size-4" />
              Monitoring settings
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}