import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '~/components/landing-reachly/Nav'
import { Footer } from '~/components/landing-reachly/Footer'

export const Route = createFileRoute('/mentions-legales')({
  component: MentionsLegalesPage,
})

function MentionsLegalesPage() {
  return (
    <main className="theme-landing min-h-screen bg-canvas">
      <Nav />

      <section className="px-6 py-24 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-4xl font-medium tracking-tight text-ink-primary sm:text-5xl">
            Mentions légales
          </h1>
          <div className="mt-8 space-y-8 text-sm text-ink-secondary leading-relaxed">
            <section>
              <h2 className="text-lg font-semibold text-ink-primary mb-4">Éditeur du site</h2>
              <p className="mb-2">
                Le site <strong>reachly.fr</strong> (ci-après "Reachly") est édité par :
              </p>
              <p className="mb-2">
                <strong>Ken Babatoundé</strong>, entrepreneur individuel, basé à Abomey-Calavi, Bénin. Contact : contact@reachly.fr
              </p>
              <p>
                Reachly est actuellement édité en tant que personne physique, sans structure juridique enregistrée. Cette information est mise à jour si l'éditeur enregistre une structure juridique.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink-primary mb-4">Hébergement</h2>
              <ul className="list-disc list-inside space-y-1">
                <li>Hébergement du site : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA</li>
                <li>Hébergement des données : Supabase Inc.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-ink-primary mb-4">Conditions générales d'utilisation</h2>
              <p className="mb-4">
                En accédant à Reachly et en créant un compte, vous acceptez les présentes conditions.
              </p>
              <ol className="list-decimal list-inside space-y-3">
                <li>
                  <strong>Objet du service.</strong> Reachly permet de lancer un contrôle qualité (QA) automatisé d'un site web avant sa livraison : exploration des pages, tests de navigation, de formulaires, de boutons/CTA, vérification du responsive, du référencement technique de base, de l'accessibilité de base et détection d'erreurs techniques (JavaScript, réseau). Le résultat est présenté sous forme de rapport avec preuves (evidence) et captures d'écran.
                </li>
                <li>
                  <strong>Compte utilisateur.</strong> Vous êtes responsable de la confidentialité de vos identifiants et de toute activité effectuée depuis votre compte. Vous devez fournir des informations exactes lors de l'inscription.
                </li>
                <li>
                  <strong>Autorisation de tester le site soumis.</strong> Vous devez être autorisé(e) à soumettre l'URL indiquée à un contrôle automatisé (site vous appartenant ou site d'un client pour lequel vous êtes mandaté). Reachly n'exécute aucune action sensible ou destructrice (achat, suppression, publication, paiement) sans consentement explicite de votre part.
                </li>
                <li>
                  <strong>Usage autorisé.</strong> Vous vous engagez à ne pas utiliser Reachly pour contourner ses limites techniques (scripts automatisés, extraction massive de données, tentative d'accès aux comptes d'autres utilisateurs), pour tester un site que vous n'êtes pas autorisé(e) à tester, ni à des fins illégales.
                </li>
                <li>
                  <strong>Disponibilité du service.</strong> Reachly est fourni "en l'état". Des interruptions ponctuelles pour maintenance ou liées à la disponibilité de services tiers (hébergeur, prestataire de paiement) peuvent survenir. Nous nous efforçons de maintenir un service disponible mais ne garantissons pas une disponibilité continue à 100 %.
                </li>
                <li>
                  <strong>Limites du contrôle.</strong> Reachly signale les problèmes qu'il a pu observer et exécuter de façon fiable. Certains éléments (authentification privée, CAPTCHA, paiement réel, actions nécessitant des identifiants internes) ne sont pas vérifiés et sont signalés comme tels plutôt que déclarés en échec. L'absence de problème détecté ne constitue pas une garantie d'absence totale de dysfonctionnement.
                </li>
                <li>
                  <strong>Propriété intellectuelle.</strong> Le contenu du site Reachly (marque, design, code, textes) est la propriété de son éditeur. Les rapports générés à partir des sites que vous soumettez vous appartiennent ; vous pouvez demander leur suppression à tout moment.
                </li>
                <li>
                  <strong>Résiliation.</strong> Vous pouvez supprimer votre compte à tout moment en nous contactant à contact@reachly.fr. En cas de manquement grave à ces conditions, nous nous réservons le droit de suspendre ou clôturer un compte.
                </li>
                <li>
                  <strong>Modification des conditions.</strong> Ces conditions peuvent être mises à jour ; la date de dernière modification est indiquée en bas de page. Un changement substantiel vous sera notifié par email.
                </li>
                <li>
                  <strong>Droit applicable.</strong> Les présentes conditions sont soumises au droit béninois. Tout litige sera porté devant les juridictions compétentes du Bénin, sauf disposition impérative contraire applicable à votre lieu de résidence.
                </li>
              </ol>
            </section>

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
