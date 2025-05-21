/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import { Recycle, Heart, Globe, ShieldCheck, Users, BadgeCheck, Truck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-green-700 text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">À propos de GreenTech</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
            Une plateforme innovante pour la réutilisation et le recyclage des matériaux à Madagascar
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 100%)' }}></div>
      </div>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
              <p className="text-lg text-gray-700 mb-8">
                GreenTech Marketplace a pour mission de réduire les déchets et de promouvoir l'économie circulaire à Madagascar
                en facilitant la réutilisation des matériaux de construction et d'artisanat. Nous créons une plateforme où les citoyens, 
                artisans et ONG peuvent donner, récupérer ou vendre à prix réduit des matériaux encore utilisables.
              </p>
              <div className="flex justify-center">
                <div className="w-24 h-1 bg-green-500 rounded-full"></div>
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Vision</h2>
              <p className="text-lg text-gray-700">
                Nous envisageons un Madagascar où chaque matériau a une seconde vie, où les déchets sont réduits au minimum, 
                et où l'économie circulaire est intégrée dans la vie quotidienne. Notre plateforme contribue à un avenir plus durable
                pour Madagascar et ses générations futures.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Ces principes fondamentaux guident notre travail et nos décisions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
                <Recycle className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Durabilité</h3>
              <p className="text-gray-600">Nous promouvons des pratiques qui réduisent l'impact environnemental et préservent les ressources naturelles.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
                <Heart className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Communauté</h3>
              <p className="text-gray-600">Nous créons des liens entre les individus et organisations pour renforcer le tissu social local.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
                <Globe className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Innovation</h3>
              <p className="text-gray-600">Nous cherchons constamment de nouvelles solutions pour répondre aux défis environnementaux.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mb-4">
                <ShieldCheck className="text-amber-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Intégrité</h3>
              <p className="text-gray-600">Nous agissons avec honnêteté, transparence et responsabilité dans toutes nos actions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Une équipe passionnée et dédiée à la mission de GreenTech
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">RAKOTOSALAMA Fitahiana Florent</h3>
              <p className="text-green-600 mb-2">Fondateur & Directeur</p>
              <p className="text-gray-600 text-sm">Ingénieur logiciel avec une expertise en développement de plateformes web et d'applications mobiles.</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">A rechercher </h3>
              <p className="text-green-600 mb-2">Responsable des Opérations</p>
              <p className="text-gray-600 text-sm">Spécialiste en logistique et chaîne d'approvisionnement avec une passion pour l'économie circulaire.</p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-300 rounded-full mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold">A rechercher</h3>
              <p className="text-green-600 mb-2">Responsable</p>
              <p className="text-gray-600 text-sm">Expert en développement durable avec plus de 10 ans d'expérience dans la gestion de projets environnementaux.</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link href="/contact" className="btn btn-primary">
              Rejoindre notre équipe
            </Link>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Impact</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Des résultats concrets pour l'environnement et la communauté
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">00+</div>
              <p className="text-gray-700">Tonnes de matériaux réutilisés</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">00+</div>
              <p className="text-gray-700">Utilisateurs actifs</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">00+</div>
              <p className="text-gray-700">Organisations partenaires</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">00+</div>
              <p className="text-gray-700">Emplois locaux créés</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment Ça Marche</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Un processus simple pour donner une seconde vie aux matériaux
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Users className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Inscription</h3>
              <p className="text-gray-600">Créez un compte gratuitement et rejoignez notre communauté engagée.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <BadgeCheck className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Publication</h3>
              <p className="text-gray-600">Publiez vos annonces de matériaux à donner ou à vendre à prix réduit.</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Truck className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Échange</h3>
              <p className="text-gray-600">Entrez en contact avec les acheteurs ou vendeurs et finalisez vos échanges.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Partenaires</h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              Des organisations qui partagent notre vision d'un Madagascar plus durable
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-4 h-24 flex items-center justify-center rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-400">Partenaire 1</div>
            </div>
            <div className="bg-white p-4 h-24 flex items-center justify-center rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-400">Partenaire 2</div>
            </div>
            <div className="bg-white p-4 h-24 flex items-center justify-center rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-400">Partenaire 3</div>
            </div>
            <div className="bg-white p-4 h-24 flex items-center justify-center rounded-lg shadow-sm">
              <div className="text-lg font-semibold text-gray-400">Partenaire 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Rejoignez le Mouvement</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Ensemble, nous pouvons construire un avenir plus durable pour Madagascar. 
            Rejoignez GreenTech Marketplace aujourd'hui et faites partie du changement.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-green-700 hover:bg-gray-100 px-6 py-3">
              Créer un compte
            </Link>
            <Link href="/contact" className="btn bg-green-600 border border-white hover:bg-green-800 px-6 py-3">
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
} 