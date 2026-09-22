import { Link } from '@tanstack/react-router'
import { Container } from './ui'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-canvas/85 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#" className="font-display text-[19px] font-extrabold tracking-tight text-white">
          Reachly
        </a>
        <nav className="hidden items-center gap-8 text-[14px] text-ink-secondary md:flex">
          <a href="#produit" className="transition-colors hover:text-white">
            Produit
          </a>
          <a href="#comment-ca-marche" className="transition-colors hover:text-white">
            Comment ça marche
          </a>
          <a href="#prix" className="transition-colors hover:text-white">
            Prix
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden text-[14px] text-ink-secondary transition-colors hover:text-white sm:block"
          >
            Se connecter
          </Link>
          <a
            href="#tester"
            className="rounded-lg bg-brand px-4 py-2 text-[14px] font-semibold text-canvas transition-colors hover:bg-brand-hover"
          >
            Tester mon formulaire
          </a>
        </div>
      </Container>
    </header>
  )
}
