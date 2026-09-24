import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Globe, Mail, Clock, Play, Check, X, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

export const Route = createFileRoute('/app/forms/new')({
  component: AddFormPage,
})

interface DetectedForm {
  id: string
  name: string
  action: string
  fields: string[]
}

interface TestResult {
  success: boolean
  steps: {
    name: string
    status: 'pending' | 'success' | 'error'
    message?: string
  }[]
  error?: string
}

function AddFormPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState<'input' | 'detecting' | 'forms' | 'testing' | 'result'>('input')
  const [url, setUrl] = useState('')
  const [alertEmail, setAlertEmail] = useState('')
  const [frequency, setFrequency] = useState('24h')
  const [detectedForms, setDetectedForms] = useState<DetectedForm[]>([])
  const [selectedForm, setSelectedForm] = useState<string>('')
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleDetectForms() {
    if (!url.trim()) {
      toast.error('Please enter a website URL')
      return
    }

    setIsLoading(true)
    setStep('detecting')

    // Simulation de la détection - à remplacer par l'API réelle
    await new Promise(resolve => setTimeout(resolve, 2000))

    const mockForms: DetectedForm[] = [
      {
        id: '1',
        name: 'Contact form',
        action: '/contact',
        fields: ['name', 'email', 'message'],
      },
      {
        id: '2', 
        name: 'Newsletter signup',
        action: '/newsletter',
        fields: ['email'],
      },
    ]

    setDetectedForms(mockForms)
    
    if (mockForms.length === 1) {
      setSelectedForm(mockForms[0].id)
      handleTestForm(mockForms[0])
    } else {
      setStep('forms')
    }
    
    setIsLoading(false)
  }

  async function handleTestForm(form?: DetectedForm) {
    const formToTest = form || detectedForms.find(f => f.id === selectedForm)
    if (!formToTest) return

    setStep('testing')
    setIsLoading(true)

    const steps: { name: string; status: 'pending' | 'success' | 'error'; message?: string }[] = [
      { name: 'Page is reachable', status: 'pending' },
      { name: 'Form detected', status: 'pending' },
      { name: 'Fields identified', status: 'pending' },
      { name: 'Test data generated', status: 'pending' },
      { name: 'Submitting form', status: 'pending' },
      { name: 'Checking response', status: 'pending' },
      { name: 'Checking network', status: 'pending' },
    ]

    setTestResult({ success: false, steps })

    // Simulation du test étape par étape
    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const newSteps = [...steps]
      newSteps[i].status = Math.random() > 0.2 ? 'success' : 'error'
      
      if (newSteps[i].status === 'error') {
        newSteps[i].message = 'HTTP 500 - Server error'
        setTestResult({ success: false, steps: newSteps, error: 'Form submission failed' })
        setStep('result')
        setIsLoading(false)
        return
      }
      
      setTestResult({ success: false, steps: newSteps })
    }

    // Test réussi
    setTestResult({ 
      success: true, 
      steps: steps.map(s => ({ ...s, status: 'success' as const }))
    })
    setStep('result')
    setIsLoading(false)
  }

  function handleStartMonitoring() {
    toast.success('Form monitoring started!')
    navigate({ to: '/app' })
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Header */}
      <header className="border-b border-border bg-surface/40 backdrop-blur">
        <div className="mx-auto max-w-2xl px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate({ to: '/app' })}
              className="flex items-center gap-2 text-sm text-ink-secondary hover:text-ink-primary"
            >
              <ArrowLeft className="size-4" />
              Forms
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-8">
        <AnimatePresence mode="wait">
          {step === 'input' && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-2xl font-semibold text-ink-primary mb-2">Add a form</h1>
                <p className="text-ink-secondary">Monitor a new form</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Globe className="inline size-4 mr-1" />
                    Website URL
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://acme.com/contact"
                    className="w-full rounded-lg border border-border bg-elevated px-4 py-3 text-ink-primary placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Mail className="inline size-4 mr-1" />
                    Alert email
                  </label>
                  <input
                    type="email"
                    value={alertEmail}
                    onChange={(e) => setAlertEmail(e.target.value)}
                    placeholder="hello@acme.com"
                    className="w-full rounded-lg border border-border bg-elevated px-4 py-3 text-ink-primary placeholder:text-ink-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-ink-secondary mb-2">
                    <Clock className="inline size-4 mr-1" />
                    Monitoring
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: '1h', label: 'Every hour' },
                      { value: '6h', label: 'Every 6 hours' },
                      { value: '24h', label: 'Every 24 hours' },
                    ].map((option) => (
                      <label key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          value={option.value}
                          checked={frequency === option.value}
                          onChange={(e) => setFrequency(e.target.value)}
                          className="mr-3"
                        />
                        <span className="text-ink-primary">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={handleDetectForms}
                disabled={!url.trim() || isLoading}
                className="w-full rounded-lg bg-brand px-4 py-3 font-medium text-canvas transition-colors hover:bg-brand-hover disabled:opacity-50"
              >
                Test form
              </button>
            </motion.div>
          )}

          {step === 'detecting' && (
            <motion.div
              key="detecting"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center space-y-6"
            >
              <div>
                <div className="size-8 animate-spin rounded-full border-2 border-brand/30 border-t-brand mx-auto mb-4" />
                <h2 className="text-xl font-medium text-ink-primary">Detecting forms...</h2>
                <p className="text-ink-secondary">Analyzing {url}</p>
              </div>
            </motion.div>
          )}

          {step === 'forms' && (
            <motion.div
              key="forms"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-xl font-medium text-ink-primary mb-2">
                  We found {detectedForms.length} form{detectedForms.length > 1 ? 's' : ''}
                </h2>
              </div>

              <div className="space-y-3">
                {detectedForms.map((form) => (
                  <label key={form.id} className="flex items-center p-4 border border-border rounded-lg cursor-pointer hover:bg-elevated">
                    <input
                      type="radio"
                      value={form.id}
                      checked={selectedForm === form.id}
                      onChange={(e) => setSelectedForm(e.target.value)}
                      className="mr-4"
                    />
                    <div>
                      <div className="font-medium text-ink-primary">{form.name}</div>
                      <div className="text-sm text-ink-muted">{form.action}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={() => handleTestForm()}
                disabled={!selectedForm || isLoading}
                className="w-full rounded-lg bg-brand px-4 py-3 font-medium text-canvas transition-colors hover:bg-brand-hover disabled:opacity-50"
              >
                Continue
              </button>
            </motion.div>
          )}

          {step === 'testing' && (
            <TestingStep testResult={testResult} />
          )}

          {step === 'result' && testResult && (
            <TestResultStep 
              result={testResult} 
              onStartMonitoring={handleStartMonitoring}
              onRetry={() => handleTestForm()}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function TestingStep({ testResult }: { testResult: TestResult | null }) {
  if (!testResult) return null

  return (
    <motion.div
      key="testing"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="text-xl font-medium text-ink-primary mb-2">Testing your form...</h2>
      </div>

      <div className="space-y-3">
        {testResult.steps.map((step, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-elevated">
            {step.status === 'pending' && (
              <div className="size-4 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
            )}
            {step.status === 'success' && <Check className="size-4 text-success" />}
            {step.status === 'error' && <X className="size-4 text-danger" />}
            
            <span className={`flex-1 ${step.status === 'error' ? 'text-danger' : 'text-ink-primary'}`}>
              {step.name}
            </span>
            
            {step.message && (
              <span className="text-sm text-danger">{step.message}</span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function TestResultStep({ 
  result, 
  onStartMonitoring, 
  onRetry 
}: { 
  result: TestResult
  onStartMonitoring: () => void
  onRetry: () => void
}) {
  return (
    <motion.div
      key="result"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      {result.success ? (
        <>
          <div className="text-center">
            <div className="size-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <Check className="size-6 text-success" />
            </div>
            <h2 className="text-xl font-medium text-ink-primary mb-2">✓ Your form works</h2>
            <p className="text-ink-secondary">Test completed just now.</p>
          </div>

          <div className="p-4 border border-border rounded-lg bg-elevated">
            <div className="space-y-2">
              <div className="font-medium text-ink-primary">Contact form</div>
              <div className="text-sm text-ink-muted">https://acme.com/contact</div>
              <div className="space-y-1 mt-3">
                <div className="flex items-center gap-2 text-sm text-success">
                  <Check className="size-3" />
                  <span>Page accessible</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <Check className="size-3" />
                  <span>Form detected</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <Check className="size-3" />
                  <span>Submission successful</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <Check className="size-3" />
                  <span>Confirmation detected</span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onStartMonitoring}
            className="w-full rounded-lg bg-brand px-4 py-3 font-medium text-canvas transition-colors hover:bg-brand-hover"
          >
            Start monitoring
          </button>
        </>
      ) : (
        <>
          <div className="text-center">
            <div className="size-12 rounded-full bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="size-6 text-danger" />
            </div>
            <h2 className="text-xl font-medium text-ink-primary mb-2">⚠ We found a problem</h2>
          </div>

          <div className="p-4 border border-danger/20 rounded-lg bg-danger/5">
            <div className="space-y-2">
              <div className="font-medium text-ink-primary">Contact form</div>
              <div className="text-sm text-ink-muted">https://acme.com/contact</div>
              <div className="mt-3">
                <div className="text-danger font-medium">HTTP 500</div>
                <div className="text-sm text-ink-muted">POST /api/contact</div>
                <p className="text-sm text-ink-secondary mt-2">
                  The form loads correctly, but the server returns an error when the request is submitted.
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onRetry}
              className="flex-1 rounded-lg border border-border bg-elevated px-4 py-3 font-medium text-ink-primary transition-colors hover:bg-surface"
            >
              View diagnosis
            </button>
            <button
              onClick={onStartMonitoring}
              className="flex-1 rounded-lg bg-brand px-4 py-3 font-medium text-canvas transition-colors hover:bg-brand-hover"
            >
              Start monitoring anyway
            </button>
          </div>
        </>
      )}
    </motion.div>
  )
}