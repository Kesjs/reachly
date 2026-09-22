import { Container, Button } from './ui'

export function FinalCTA() {
  return (
    <section id="tester" className="border-b border-border py-24">
      <Container className="text-center">
        <h2 className="mx-auto max-w-[520px] font-display text-[30px] font-bold leading-tight text-white sm:text-[34px]">
          Votre formulaire fonctionne-t-il vraiment ?
        </h2>
        <p className="mt-4 text-[16px] text-ink-secondary">
          Testez-le maintenant. Reachly s&rsquo;occupe du reste.
        </p>
        <div className="mt-8 flex justify-center">
          <Button href="#">Tester mon formulaire</Button>
        </div>
        <p className="mt-3 text-[13px] text-ink-muted">Gratuit pour votre premier test.</p>
      </Container>
    </section>
  )
}

export function Footer() {
  return (
    <footer className="py-14">
      <Container className="flex flex-col items-start justify-between gap-8 sm:flex-row">
        <div>
          <p className="font-display text-[16px] font-bold text-white">Reachly</p>
          <p className="mt-2 max-w-[260px] text-[13.5px] text-ink-muted">
            Monitoring automatique des formulaires.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-10 text-[13.5px] text-ink-secondary sm:grid-cols-3">
          <div className="space-y-2.5">
            <p className="text-ink-muted">Produit</p>
            <a href="#comment-ca-marche" className="block transition-colors hover:text-white">
              Comment ça marche
            </a>
            <a href="#prix" className="block transition-colors hover:text-white">
              Prix
            </a>
          </div>
          <div className="space-y-2.5">
            <p className="text-ink-muted">Entreprise</p>
            <a href="#" className="block transition-colors hover:text-white">
              À propos
            </a>
            <a href="#" className="block transition-colors hover:text-white">
              Contact
            </a>
          </div>
          <div className="space-y-2.5">
            <p className="text-ink-muted">Légal</p>
            <a href="#" className="block transition-colors hover:text-white">
              Confidentialité
            </a>
            <a href="#" className="block transition-colors hover:text-white">
              Conditions
            </a>
          </div>
        </div>
      </Container>
      <Container className="mt-10 border-t border-border pt-6 text-[12.5px] text-ink-muted">
        © 2026 Reachly
      </Container>
    </footer>
  )
}
