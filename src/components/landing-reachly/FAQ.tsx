import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      question: "Reachly teste-t-il réellement le site ?",
      answer: "Oui. Reachly utilise un navigateur automatisé pour ouvrir les pages et exécuter des interactions réelles lorsque le parcours le permet."
    },
    {
      question: "Que vérifie Reachly ?",
      answer: "Les pages, liens, formulaires, CTA, erreurs navigateur, requêtes réseau, responsive, SEO technique de base, assets, accessibilité de base, performance et certains problèmes visuels."
    },
    {
      question: "Est-ce seulement un audit SEO ?",
      answer: "Non. Le SEO n'est qu'une catégorie parmi plusieurs contrôles. Reachly est conçu comme un QA de livraison complet pour détecter tous les problèmes qui pourraient gêner vos utilisateurs."
    },
    {
      question: "Puis-je relancer le test après avoir corrigé les problèmes ?",
      answer: "Oui. Le retest permet de vérifier que les problèmes précédemment détectés ont réellement disparu et qu'aucun nouveau problème n'est apparu."
    },
    {
      question: "Puis-je partager le rapport ?",
      answer: "Oui. Le rapport peut être consulté et partagé avec les personnes impliquées dans la livraison du site. Il inclut des preuves visuelles et techniques."
    },
    {
      question: "Dois-je installer quelque chose ?",
      answer: "Non. Reachly fonctionne entièrement depuis le web. Il suffit d'entrer l'URL de votre site pour lancer le QA."
    },
    {
      question: "Combien de temps prend un QA ?",
      answer: "Cela dépend de la taille du site, mais généralement entre 5 et 15 minutes pour un site classique. Vous recevez des mises à jour en temps réel pendant le processus."
    },
    {
      question: "Que se passe-t-il si mon site nécessite une authentification ?",
      answer: "Reachly peut tester les parties publiques de votre site. Pour les zones privées, contactez-nous pour discuter des options disponibles."
    }
  ]

  return (
    <section className="py-16 sm:py-24 bg-elevated/30">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-ink-primary sm:text-4xl font-display mb-4">
              Questions fréquentes
            </h2>
            <p className="text-lg text-ink-secondary">
              Tout ce que vous devez savoir sur le QA automatisé avec Reachly
            </p>
          </motion.div>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="rounded-xl border border-border bg-surface overflow-hidden"
            >
              <button
                className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-elevated transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-ink-primary pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`h-5 w-5 text-ink-muted transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-5">
                      <div className="pt-2 border-t border-border">
                        <p className="text-ink-secondary leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Additional help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-ink-secondary mb-4">
            Une autre question ?
          </p>
          <a 
            href="mailto:contact@reachly.fr" 
            className="text-brand-text hover:underline font-medium"
          >
            Contactez notre équipe →
          </a>
        </motion.div>
      </div>
    </section>
  )
}