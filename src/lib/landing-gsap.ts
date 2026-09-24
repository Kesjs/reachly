import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

// SSR (TanStack Start) : registerPlugin ne touche pas le DOM, mais on
// garde le guard par prudence — jamais de ScrollTrigger côté serveur.
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export { gsap, ScrollTrigger }

/**
 * Effet magnetic : l'élément suit légèrement le curseur au survol et
 * revient à sa position au repos à la sortie. Utilisé sur les CTA et
 * les liens de nav. Désactivé sur tactile (pas de curseur à suivre).
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3): RefObject<T | null> {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return
    if (window.matchMedia('(pointer: coarse)').matches) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3.out' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3.out' })

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      xTo((e.clientX - (rect.left + rect.width / 2)) * strength)
      yTo((e.clientY - (rect.top + rect.height / 2)) * strength)
    }
    const handleLeave = () => {
      xTo(0)
      yTo(0)
    }

    el.addEventListener('mousemove', handleMove)
    el.addEventListener('mouseleave', handleLeave)
    return () => {
      el.removeEventListener('mousemove', handleMove)
      el.removeEventListener('mouseleave', handleLeave)
    }
  }, [strength])

  return ref
}

/**
 * Reveal scroll-driven générique : anime les enfants directs d'un
 * conteneur les uns après les autres à l'entrée dans le viewport.
 * Remplace, section par section, les `motion.div whileInView` de
 * framer-motion encore présents dans landing-reachly/.
 */
export function useScrollRevealChildren<T extends HTMLElement>(
  options: { stagger?: number; y?: number; start?: string } = {},
): RefObject<T | null> {
  const ref = useRef<T | null>(null)
  const { stagger = 0.1, y = 24, start = 'top 80%' } = options

  useEffect(() => {
    const el = ref.current
    if (!el || typeof window === 'undefined') return

    const children = Array.from(el.children)
    const ctx = gsap.context(() => {
      gsap.set(children, { opacity: 0, y })
      gsap.to(children, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger,
        scrollTrigger: { trigger: el, start },
      })
    }, el)

    return () => ctx.revert()
  }, [stagger, y, start])

  return ref
}
