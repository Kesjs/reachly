import { useEffect, useRef, useState } from 'react'
import { Plus } from 'lucide-react'
import { gsap } from '~/lib/landing-gsap'

const faqs = [
  {
    question: 'Reachly teste-t-il réellement le site ?',
    answer: 'Oui. Un navigateur automatisé ouvre les pages et exécute des interactions réelles — clics, saisies, navigation — chaque fois que le parcours le permet.',
  },
  {
    question: 'Que vérifie Reachly ?',
    answer: "Les pages, les liens, les formulaires, les boutons, les erreurs navigateur, les requêtes réseau, le responsive, le SEO technique de base, les assets, l'accessibilité et la performance de base.",
  },
  {
    question: 'Est-ce seulement un audit SEO ?',
    answer: "Non. Le SEO n'est qu'une catégorie parmi d'autres. Reachly est conçu comme un QA de livraison complet, pas comme un outil SEO.",
  },
  {
    question: 'Puis-je relancer le test après avoir corrigé les problèmes ?',
    answer: "Oui. Le retest est inclus et confirme que les problèmes détectés ont bien disparu, sans qu'un nouveau problème soit apparu entre-temps.",
  },
  {
    question: 'Puis-je partager le rapport avec mon client ?',
    answer: 'Oui. Le rapport inclut les preuves visuelles et techniques et peut être consulté par toute personne impliquée dans la livraison.',
  },
  {
    question: 'Dois-je installer quelque chose ?',
    answer: "Non. Reachly fonctionne depuis le web. Il suffit d'entrer l'URL de votre site pour lancer le test.",
  },
  {
    question: 'Combien de temps prend un QA ?',
    answer: 'Généralement entre 5 et 15 minutes selon la taille du site, avec des mises à jour en temps réel pendant le test.',
  },
  {
    question: 'Et si mon site nécessite une authentification ?',
    answer: 'Reachly teste les parties publiques du site. Pour les zones privées, contactez-nous pour en discuter.',
  },
]

function FAQItem({ question, answer, isOpen, onToggle }: { question: string; answer: string; isOpen: boolean; onToggle: () => void }) {
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = bodyRef.current
    if (!el) return

    if (isOpen) {
      const targetHeight = el.scrollHeight
      gsap.fromTo(
        el,
        { height: 0, opacity: 0 },
        { height: targetHeight, opacity: 1, duration: 0.25, ease: 'power2.out', onComplete: () => gsap.set(el, { height: 'auto' }) },
      )
    } else {
      gsap.to(el, { height: 0, opacity: 0, duration: 0.2, ease: 'power2.in' })
    }
  }, [isOpen])

  return (
    <div>
      <button className="w-full py-5 text-left flex items-center justify-between gap-4" onClick={onToggle}>
        <span className="text-base font-medium text-ink-primary">{question}</span>
        <Plus
          className={`h-4 w-4 text-ink-muted shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}
        />
      </button>
      <div ref={bodyRef} className="overflow-hidden" style={{ height: 0, opacity: 0 }}>
        <p className="pb-5 text-ink-secondary leading-relaxed max-w-xl">{answer}</p>
      </div>
    </div>
  )
}

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)
  const sectionTitleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sectionTitleRef.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, scrollTrigger: { trigger: el, start: 'top 80%' } },
    )
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <section className="py-20 sm:py-28 bg-surface border-t border-hairline border-border">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div ref={sectionTitleRef}>
          <h2 className="text-3xl font-semibold text-ink-primary sm:text-4xl font-display mb-12">
            Questions fréquentes
          </h2>

          <div className="divide-y divide-border border-t border-b border-hairline border-border">
            {faqs.map((faq, index) => (
              <FAQItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
              />
            ))}
          </div>
        </div>

        <p className="mt-10 text-ink-secondary">
          Une autre question ?{' '}
          <a href="mailto:contact@reachly.fr" className="text-brand-text hover:underline font-medium">
            Écrivez à l'équipe
          </a>
        </p>
      </div>
    </section>
  )
}
