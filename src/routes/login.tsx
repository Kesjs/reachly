import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { getSupabaseBrowserClient } from '~/lib/supabase/client'
import { signUpWithGuard } from '~/lib/queries/auth'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { AuthLayout, GlassInputWrapper } from '~/components/auth/AuthLayout'
import { OtpInput } from '~/components/auth/otp-input'
import { useOtpAuth } from '~/hooks/useOtpAuth'
import { cn } from '~/lib/utils'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>): { mode?: AuthMode } => ({
    mode: search.mode as AuthMode | undefined,
  }),
  component: LoginPage,
})

type AuthMode = 'password' | 'register' | 'forgot' | 'otp' | 'otp-verify'

const COPY: Record<AuthMode, { title: string; description: string }> = {
  password: {
    title: 'Content de vous revoir',
    description: 'Connectez-vous pour retrouver vos sites et vos rapports QA.',
  },
  register: {
    title: 'Créer un compte',
    description: 'Créez votre espace Reachly et testez votre premier site gratuitement.',
  },
  forgot: {
    title: 'Mot de passe oublié',
    description: 'Entrez votre email, nous vous envoyons un lien de réinitialisation.',
  },
  otp: {
    title: 'Connexion rapide',
    description: 'Recevez un code de connexion temporaire sur votre email.',
  },
  'otp-verify': {
    title: 'Vérification du code',
    description: 'Saisissez le code reçu par email pour vous connecter.',
  },
}

function LoginPage() {
  const navigate = useNavigate()
  const search = Route.useSearch()
  const [mode, setMode] = useState<AuthMode>((search.mode as AuthMode) || 'password')
  const { isLoading: otpLoading, requestOtp, verifyOtp } = useOtpAuth()

  useEffect(() => {
    if (search.mode) setMode(search.mode as AuthMode)
  }, [search.mode])

  const [checkingSession, setCheckingSession] = useState(true)
  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    supabase.auth.getSession().then(({ data }) => {
      if (data?.session?.user) {
        window.location.href = '/dashboard'
      } else {
        setCheckingSession(false)
      }
    }).catch(() => setCheckingSession(false))
  }, [])

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpEmail, setOtpEmail] = useState('')

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error
      toast.success('Connexion réussie')
      setTimeout(() => { window.location.href = '/dashboard' }, 300)
    } catch (err: any) {
      toast.error(err?.message === 'Invalid login credentials' ? 'Email ou mot de passe incorrect' : err?.message || 'Erreur de connexion')
    } finally {
      setIsLoading(false)
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Veuillez remplir tous les champs')
      return
    }
    setIsLoading(true)
    try {
      await signUpWithGuard({ data: { email, password } })
      toast.success('Compte créé ! Vérifiez vos emails pour valider votre inscription.')
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de l'inscription")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      toast.error('Veuillez entrer votre adresse email')
      return
    }
    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/reset-password',
      })
      if (error) throw error
      toast.success('Email de réinitialisation envoyé')
      setMode('password')
    } catch (err: any) {
      toast.error(err?.message || "Erreur lors de l'envoi")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleOtpRequest(e: React.FormEvent) {
    e.preventDefault()
    const success = await requestOtp(email)
    if (success) {
      setOtpEmail(email)
      setMode('otp-verify')
    }
  }

  async function handleOtpVerify(code: string) {
    const success = await verifyOtp(otpEmail, code)
    if (success) {
      setTimeout(() => { window.location.href = '/dashboard' }, 300)
    } else {
      setOtpCode('')
    }
  }

  async function handleGoogleAuth() {
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin + '/dashboard' },
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err?.message || 'Connexion Google indisponible')
    }
  }

  function switchMode(next: AuthMode) {
    setMode(next)
    navigate({ to: '/login', search: next === 'password' ? {} : { mode: next }, replace: true })
  }

  if (checkingSession) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="size-6 animate-spin rounded-full border-2 border-ink-muted/30 border-t-brand" />
      </div>
    )
  }

  const copy = COPY[mode]

  return (
    <AuthLayout title={copy.title} description={copy.description}>
      <AnimatePresence mode="wait" initial={false}>
        {mode === 'password' && (
          <motion.div key="password" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <form className="space-y-5" onSubmit={handlePasswordLogin}>
              <div>
                <label className="text-sm font-medium text-ink-secondary">Adresse email</label>
                <GlassInputWrapper>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    className="w-full rounded-xl bg-transparent p-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              <div>
                <label className="text-sm font-medium text-ink-secondary">Mot de passe</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Votre mot de passe"
                      className="w-full rounded-xl bg-transparent p-4 pr-12 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center text-ink-muted hover:text-ink-primary"
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                    >
                      {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="size-4 rounded border-border accent-brand"
                  />
                  <span className="text-ink-secondary">Rester connecté</span>
                </label>
                <button type="button" onClick={() => switchMode('forgot')} className="text-brand-text transition-colors hover:underline">
                  Mot de passe oublié ?
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full rounded-xl bg-brand py-4 text-sm font-medium text-canvas transition-colors hover:bg-brand-hover',
                  isLoading && 'opacity-60',
                )}
              >
                {isLoading ? 'Connexion…' : 'Se connecter'}
              </button>
            </form>

            <div className="relative flex items-center justify-center">
              <span className="w-full border-t border-border" />
              <span className="absolute bg-canvas px-4 text-sm text-ink-muted">ou</span>
            </div>

            <button
              onClick={handleGoogleAuth}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border py-4 text-sm text-ink-secondary transition-colors hover:bg-elevated hover:text-ink-primary"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>

            <button
              onClick={() => switchMode('otp')}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border py-4 text-sm text-ink-secondary transition-colors hover:bg-elevated hover:text-ink-primary"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Connexion par code email
            </button>

            <p className="text-center text-sm text-ink-muted">
              Pas encore de compte ?{' '}
              <button onClick={() => switchMode('register')} className="text-brand-text hover:underline">
                Créer un compte
              </button>
              {' '}·{' '}
              <button onClick={() => switchMode('otp')} className="text-brand-text hover:underline">
                Connexion rapide
              </button>
            </p>
          </motion.div>
        )}

        {mode === 'register' && (
          <motion.div key="register" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <button
              onClick={handleGoogleAuth}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-border py-4 text-sm text-ink-secondary transition-colors hover:bg-elevated hover:text-ink-primary"
            >
              <GoogleIcon />
              Continuer avec Google
            </button>
            <div className="relative flex items-center justify-center">
              <span className="w-full border-t border-border" />
              <span className="absolute bg-canvas px-4 text-sm text-ink-muted">ou</span>
            </div>

            <form className="space-y-5" onSubmit={handleRegister}>
              <div>
                <label className="text-sm font-medium text-ink-secondary">Adresse email</label>
                <GlassInputWrapper>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    className="w-full rounded-xl bg-transparent p-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>
              <div>
                <label className="text-sm font-medium text-ink-secondary">Mot de passe</label>
                <GlassInputWrapper>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimum 8 caractères"
                    className="w-full rounded-xl bg-transparent p-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full rounded-xl bg-brand py-4 text-sm font-medium text-canvas transition-colors hover:bg-brand-hover',
                  isLoading && 'opacity-60',
                )}
              >
                {isLoading ? 'Création…' : 'Créer mon compte'}
              </button>
            </form>

            <p className="text-center text-sm text-ink-muted">
              Déjà un compte ?{' '}
              <button onClick={() => switchMode('password')} className="text-brand-text hover:underline">
                Se connecter
              </button>
            </p>
          </motion.div>
        )}

        {mode === 'forgot' && (
          <motion.div key="forgot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <form className="space-y-5" onSubmit={handleForgotPassword}>
              <div>
                <label className="text-sm font-medium text-ink-secondary">Adresse email</label>
                <GlassInputWrapper>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    className="w-full rounded-xl bg-transparent p-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  'w-full rounded-xl bg-brand py-4 text-sm font-medium text-canvas transition-colors hover:bg-brand-hover',
                  isLoading && 'opacity-60',
                )}
              >
                {isLoading ? 'Envoi…' : 'Envoyer le lien'}
              </button>
            </form>
            <p className="text-center text-sm text-ink-muted">
              <button onClick={() => switchMode('password')} className="text-brand-text hover:underline">
                ← Retour à la connexion
              </button>
            </p>
          </motion.div>
        )}

        {mode === 'otp' && (
          <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <form className="space-y-5" onSubmit={handleOtpRequest}>
              <div>
                <label className="text-sm font-medium text-ink-secondary">Adresse email</label>
                <GlassInputWrapper>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="vous@entreprise.com"
                    className="w-full rounded-xl bg-transparent p-4 text-sm text-ink-primary placeholder:text-ink-muted focus:outline-none"
                  />
                </GlassInputWrapper>
              </div>
              <button
                type="submit"
                disabled={otpLoading}
                className={cn(
                  'w-full rounded-xl bg-brand py-4 text-sm font-medium text-canvas transition-colors hover:bg-brand-hover',
                  otpLoading && 'opacity-60',
                )}
              >
                {otpLoading ? 'Envoi…' : 'Recevoir le code'}
              </button>
            </form>
            <p className="text-center text-sm text-ink-muted">
              <button onClick={() => switchMode('password')} className="text-brand-text hover:underline">
                ← Retour à la connexion
              </button>
            </p>
          </motion.div>
        )}

        {mode === 'otp-verify' && (
          <motion.div key="otp-verify" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-ink-secondary mb-4">
                Code envoyé à <span className="font-medium text-ink-primary">{otpEmail}</span>
              </p>
              
              <div className="mb-6">
                <OtpInput
                  length={6}
                  onComplete={handleOtpVerify}
                  disabled={otpLoading}
                  error={false}
                  success={false}
                />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => {
                  setMode('otp')
                  // Reset l'email pour permettre de modifier si nécessaire
                }}
                className="w-full rounded-xl border border-border py-3 text-sm text-ink-secondary transition-colors hover:bg-elevated hover:text-ink-primary disabled:opacity-50"
              >
                Renvoyer le code
              </button>
              
              <p className="text-center text-sm text-ink-muted">
                <button onClick={() => switchMode('otp')} className="text-brand-text hover:underline">
                  ← Modifier l'email
                </button>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthLayout>
  )
}

function GoogleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="size-4" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}
