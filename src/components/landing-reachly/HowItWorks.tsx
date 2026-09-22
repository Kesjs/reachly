import { Container } from './ui'

const steps = [
  {
    n: '01',
    title: 'Connectez votre formulaire',
    body: "Indiquez simplement l'URL de la page qui contient votre formulaire.",
  },
  {
    n: '02',
    title: 'Reachly le teste',
    body: 'Reachly ouvre votre site, remplit les champs et effectue une vraie soumission.',
  },
  {
    n: '03',
    title: 'Nous vous prévenons',
    body: "Si quelque chose échoue, vous recevez une alerte avec le diagnostic complet.",
  },
]

export function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="border-b border-border py-24">
      <Container>
        <h2 className="font-display text-[30px] font-bold text-white sm:text-[34px]">
          Comment ça marche
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((s, i) => (
            <div key={s.n} className="relative">
              <span className="font-display text-[13px] font-bold tracking-wide text-brand">
                {s.n}
              </span>
              <h3 className="mt-3 font-display text-[19px] font-bold text-white">{s.title}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-secondary">{s.body}</p>
              {i < steps.length - 1 && (
                <span className="absolute right-[-1.75rem] top-1 hidden text-border-strong md:block">
                  —
                </span>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
