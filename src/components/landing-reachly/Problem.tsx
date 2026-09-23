import { motion } from 'framer-motion'
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react'

export function Problem() {
  const checkSteps = [
    { icon: CheckCircle, text: "Site accessible", status: "success" },
    { icon: CheckCircle, text: "Navigation chargée", status: "success" },
    { icon: CheckCircle, text: "Pages principales accessibles", status: "success" },
    { icon: CheckCircle, text: "Formulaire visible", status: "success" },
    { icon: XCircle, text: "Soumission échoue", status: "error" },
  ]

  const problems = [
    {
      title: "Formulaire cassé",
      description: "La soumission échoue alors que le formulaire semble fonctionner.",
      icon: "🔧"
    },
    {
      title: "Lien cassé", 
      description: "Une page ou un CTA renvoie vers une URL inexistante.",
      icon: "🔗"
    },
    {
      title: "Responsive cassé",
      description: "Le site fonctionne sur desktop mais un élément déborde ou devient inutilisable sur mobile.",
      icon: "📱"
    }
  ]

  return (
    <section id="produit" className="py-16 sm:py-24 bg-canvas">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl font-bold text-ink-primary sm:text-4xl font-display">
                Un site peut sembler terminé et pourtant avoir encore plusieurs problèmes.
              </h2>
              
              <p className="text-lg text-ink-secondary">
                Une page peut s'afficher correctement et masquer pourtant un formulaire cassé, 
                un lien mort, une erreur JavaScript, un problème mobile ou un bouton qui ne 
                mène nulle part. Ces petits problèmes apparaissent souvent après la mise en ligne.
              </p>
            </motion.div>

            {/* Problems List */}
            <div className="space-y-6">
              {problems.map((problem, index) => (
                <motion.div
                  key={problem.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex gap-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-elevated text-lg">
                    {problem.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-ink-primary mb-2">
                      {problem.title}
                    </h3>
                    <p className="text-ink-secondary">
                      {problem.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column - Visual Trail */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border bg-surface p-8 shadow-lg"
            >
              <h3 className="text-xl font-semibold text-ink-primary mb-6 font-display">
                Check trail
              </h3>
              
              <div className="space-y-4">
                {checkSteps.map((step, index) => {
                  const IconComponent = step.icon
                  const isError = step.status === "error"
                  
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className={`flex items-center gap-3 ${isError ? 'text-danger' : 'text-success'}`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className={`text-sm ${isError ? 'text-ink-primary font-medium' : 'text-ink-secondary'}`}>
                        {step.text}
                      </span>
                    </motion.div>
                  )
                })}
              </div>

              {/* Visual indicator */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex items-center gap-2 text-sm text-ink-muted">
                  <AlertTriangle className="h-4 w-4 text-warning" />
                  <span>Un test superficiel n'aurait pas détecté le problème</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}