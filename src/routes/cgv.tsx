import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '~/components/landing-reachly/Nav'
import { Footer } from '~/components/landing-reachly/Footer'

export const Route = createFileRoute('/cgv')({
  component: CgvPage,
})

function CgvPage() {
  return (
    <main className="theme-landing min-h-screen bg-canvas">
      <Nav />

      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink-primary sm:text-5xl">
            Conditions Générales de Vente
          </h1>
          <div className="mt-8 space-y-8 text-sm text-ink-secondary leading-relaxed">
            <ol className="list-decimal list-inside space-y-4">
              <li>
                <strong>Offre.</strong> Reachly propose un contrôle qualité (QA) automatisé à l'unité, "Full QA", au prix de 19 € par site testé, décrit en détail sur la page tarifs. Il n'y a pas d'abonnement ni d'engagement récurrent : chaque achat correspond à un QA sur un site donné.
              </li>
              <li>
                <strong>Contenu de l'offre.</strong> Le Full QA à 19 € inclut l'exécution du contrôle qualité complet et un retest (relance du QA après correction) sur ce même site, sans frais supplémentaire.
              </li>
              <li>
                <strong>Prix.</strong> Les prix sont indiqués en euros, toutes taxes comprises lorsque applicable. Le prix en vigueur au moment de l'achat vous est communiqué avant tout paiement.
              </li>
              <li>
                <strong>Paiement.</strong> Les paiements sont traités par un prestataire de paiement tiers (FedaPay). Reachly ne stocke pas les données de votre carte bancaire.
              </li>
              <li>
                <strong>Facturation.</strong> Chaque QA est facturé au moment de l'achat, en une fois. Il n'y a pas de renouvellement automatique ni de prélèvement récurrent pour l'offre Full QA à l'unité.
              </li>
              <li>
                <strong>Droit de rétractation.</strong> Conformément aux règles applicables aux services numériques fournis immédiatement, le droit de rétractation de 14 jours ne s'applique pas une fois que vous avez expressément demandé le lancement du QA et reconnu que cette exécution démarre l'exécution du contrat avant la fin du délai de rétractation.
              </li>
              <li>
                <strong>Remboursement.</strong> En dehors des cas prévus par la loi, un QA déjà exécuté n'est pas remboursable. Si le contrôle n'a techniquement pas pu être mené à son terme du fait de Reachly (scan en échec imputable au service), contactez-nous à contact@reachly.fr pour un nouvel essai ou un remboursement.
              </li>
              <li>
                <strong>Réclamations.</strong> Pour toute question relative à la facturation, contactez contact@reachly.fr.
              </li>
            </ol>

            <p className="text-xs text-ink-muted mt-12">
              Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
