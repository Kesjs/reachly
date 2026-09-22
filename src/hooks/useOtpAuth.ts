import { useState } from 'react'
import { getSupabaseBrowserClient } from '~/lib/supabase/client'
import { toast } from 'sonner'

interface UseOtpAuthReturn {
  isLoading: boolean
  requestOtp: (email: string) => Promise<boolean>
  verifyOtp: (email: string, code: string) => Promise<boolean>
}

export function useOtpAuth(): UseOtpAuthReturn {
  const [isLoading, setIsLoading] = useState(false)

  const requestOtp = async (email: string): Promise<boolean> => {
    if (!email) {
      toast.error('Veuillez entrer votre adresse email')
      return false
    }

    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          shouldCreateUser: false, // Ne crée pas de nouveaux utilisateurs
          data: {
            // Métadonnées optionnelles
            login_method: 'otp',
          },
        },
      })

      if (error) {
        throw error
      }

      toast.success('Code de connexion envoyé ! Vérifiez votre boîte email.')
      return true
    } catch (err: any) {
      const message = err?.message || "Erreur lors de l'envoi du code"
      
      // Messages d'erreur spécifiques
      if (message.includes('User not found')) {
        toast.error('Aucun compte associé à cette adresse email')
      } else if (message.includes('Email rate limit exceeded')) {
        toast.error('Trop de tentatives. Veuillez patienter avant de réessayer.')
      } else {
        toast.error(message)
      }
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const verifyOtp = async (email: string, code: string): Promise<boolean> => {
    if (!email || !code) {
      toast.error('Email et code requis')
      return false
    }

    setIsLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.replace(/\s/g, ''), // Supprime les espaces
        type: 'email',
      })

      if (error) {
        throw error
      }

      toast.success('Connexion réussie !')
      return true
    } catch (err: any) {
      const message = err?.message || 'Erreur de vérification'
      
      // Messages d'erreur spécifiques
      if (message.includes('Token has expired')) {
        toast.error('Le code a expiré. Demandez un nouveau code.')
      } else if (message.includes('Invalid token')) {
        toast.error('Code invalide. Vérifiez votre saisie.')
      } else if (message.includes('Too many requests')) {
        toast.error('Trop de tentatives. Veuillez patienter.')
      } else {
        toast.error(message)
      }
      
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    requestOtp,
    verifyOtp,
  }
}