import { Container } from './ui'

const qa = [
  {
    q: 'Est-ce que Reachly envoie réellement le formulaire ?',
    a: 'Oui. Il reproduit une soumission réelle dans un navigateur automatisé, exactement comme le ferait un visiteur.',
  },
  {
    q: 'Est-ce que je dois installer quelque chose ?',
    a: "Non. Il vous suffit d'indiquer l'URL de votre formulaire.",
  },
  {
    q: 'Reachly peut-il surveiller mon formulaire en permanence ?',
    a: 'Oui. Une fois la surveillance activée, les tests sont exécutés automatiquement à intervalle régulier.',
  },
  {
    q: 'Que se passe-t-il si mon formulaire tombe en panne ?',
    a: "Vous recevez une alerte avec un diagnostic clair de ce qui s'est passé et une piste pour le résoudre.",
  },
  {
    q: 'Est-ce que je dois créer un compte pour tester ?',
    a: "Non, le premier test est disponible immédiatement, sans inscription.",
  },
]

export function FAQ() {
  return (
    <section className="border-b border-border py-24">
      <Container className="max-w-[720px]">
        <h2 className="font-display text-[30px] font-bold text-white sm:text-[34px]">
          Questions fréquentes
        </h2>
        <div className="mt-10 divide-y divide-border border-t border-border">
          {qa.map((item) => (
            <details key={item.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[15.5px] font-semibold text-white">
                {item.q}
                <span className="shrink-0 text-ink-muted transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-[14.5px] leading-relaxed text-ink-secondary">{item.a}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  )
}
