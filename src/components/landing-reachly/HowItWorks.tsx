import { motion } from 'framer-motion'
import { Globe, TestTube2, RotateCcw } from 'lucide-react'

export function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Entrez votre URL",
      description: "Donnez simplement l'URL du site que vous êtes sur le point de livrer.",
      icon: Globe,
      color: "text-brand"
    },
    {
      number: "02", 
      title: "Reachly teste réellement le site",
      description: "Notre navigateur automatise les parcours, vérifie les pages, les formulaires, les liens, le responsive et les erreurs techniques.",
      icon: TestTube2,
      color: "text-info"
    },
    {
      number: "03",
      title: "Corrigez puis relancez",
      description: "Chaque problème est accompagné de preuves. Corrigez-le puis relancez le QA pour vérifier qu'il a bien disparu.",
      icon: RotateCcw,
      color: "text-success"
    }
  ]

  return (
    <section id="comment-ca-marche" className="py-16 sm:py-24 bg-elevated/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-ink-primary sm:text-4xl font-display mb-4">
              Comment ça marche
            </h2>
            <p className="text-lg text-ink-secondary max-w-2xl mx-auto">
              Trois étapes simples pour s'assurer que votre site est prêt à être livré
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                {/* Connector Line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-px bg-border -translate-x-1/2 z-0" />
                )}
                
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-surface border border-border shadow-sm`}>
                    <IconComponent className={`h-7 w-7 ${step.color}`} />
                  </div>
                  
                  {/* Step Number */}
                  <div className="mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-brand/10 text-sm font-bold text-brand">
                      {step.number}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-ink-primary mb-3 font-display">
                    {step.title}
                  </h3>
                  <p className="text-ink-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a 
            href="/signup"
            className="inline-flex items-center justify-center rounded-lg bg-brand px-8 py-4 text-lg font-medium text-canvas hover:bg-brand-hover transition-colors"
          >
            Démarrer maintenant
          </a>
        </motion.div>
      </div>
    </section>
  )
}