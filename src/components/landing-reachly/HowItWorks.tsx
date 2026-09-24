import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    title: 'Donnez l\'URL',
    description: "L'adresse du site que vous êtes sur le point de livrer, rien d'autre à installer.",
  },
  {
    number: '02',
    title: 'Reachly le parcourt réellement',
    description: 'Un navigateur automatisé ouvre les pages, remplit les formulaires, clique les boutons, teste le mobile et relève les erreurs techniques.',
  },
  {
    number: '03',
    title: 'Corrigez, puis relancez',
    description: 'Chaque problème arrive avec sa preuve. Le retest confirme qu\'il a vraiment disparu.',
  },
]

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="py-20 sm:py-28 bg-surface border-y border-hairline border-border">
      <div className="mx-auto max-w-1200 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mb-16">
          <h2 className="text-3xl font-semibold text-ink-primary sm:text-4xl font-display">
            Comment ça marche
          </h2>
        </div>

        <div className="grid gap-x-8 gap-y-14 md:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="border-t border-hairline border-border-strong pt-6"
            >
              <span className="block text-4xl font-display font-semibold text-ink-muted/40 mb-4">
                {step.number}
              </span>
              <h3 className="text-lg font-semibold text-ink-primary mb-2 font-display">
                {step.title}
              </h3>
              <p className="text-ink-secondary leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-16">
          <a
            href="/signup"
            className="inline-flex items-center justify-center rounded-md bg-brand px-6 py-3.5 text-base font-medium text-white hover:bg-brand-hover transition-colors"
          >
            Démarrer un test
          </a>
        </div>
      </div>
    </section>
  )
}
