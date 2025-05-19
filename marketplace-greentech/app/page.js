'use client';

/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import { useQuery } from '@apollo/client';
import { GET_LISTINGS, GET_CATEGORIES } from '@/lib/graphql/queries';
import { ArrowRight, Search, Gift, PiggyBank, Recycle, MapPin } from "lucide-react";

// Helper to format price
const formatPrice = (price) => {
  if (price === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-MG", { style: "currency", currency: "MGA" }).format(price);
};

export default function Home() {
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: listingsData, loading: listingsLoading } = useQuery(GET_LISTINGS, {
    variables: {
      limit: 4,
      status: 'active'
    }
  });

  // Partenaires
  const partners = [
    {
      id: 1,
      name: 'Eco-Construction',
      logo: '/partners/eco-construction.png',
      description: 'Leader en construction durable'
    },
    {
      id: 2,
      name: 'Green Materials',
      logo: '/partners/green-materials.png',
      description: 'Fournisseur de matériaux écologiques'
    },
    {
      id: 3,
      name: 'Sustainable Build',
      logo: '/partners/sustainable-build.png',
      description: 'Expert en rénovation durable'
    },
    {
      id: 4,
      name: 'Eco-Renov',
      logo: '/partners/eco-renov.png',
      description: 'Solutions de rénovation écologique'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Donnez une seconde vie aux matériaux
              </h1>
              <p className="text-lg md:text-xl mb-6">
                Plateforme de réutilisation de matériaux de construction et d'artisanat à Madagascar.
                Donnez, récupérez ou achetez à prix réduit des matériaux encore utilisables.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/listings" className="btn btn-accent">
                  Voir les annonces
                </Link>
                <Link href="/auth/register" className="btn bg-white text-green-700 hover:bg-gray-100">
                  Créer un compte
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-xl">
                <div className="absolute inset-0 bg-gray-900 opacity-20 z-10 rounded-lg"></div>
                <div className="absolute inset-0 flex items-center justify-center z-20">
                  <div className="bg-white/90 p-6 rounded-lg shadow-lg max-w-sm">
                    <h3 className="text-green-700 font-semibold text-xl mb-2">Réduisez les déchets</h3>
                    <p className="text-gray-700">Contribuez à l'économie circulaire en donnant une nouvelle vie aux matériaux inutilisés</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="bg-white py-8 shadow-md">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg p-6">
            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-grow">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Que cherchez-vous?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Briques, bois, métal..."
                    className="input pl-10"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>
              <div className="w-full md:w-1/4">
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Catégorie
                </label>
                <select id="category" className="input">
                  <option value="">Toutes les catégories</option>
                  {categoriesData?.categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-full md:w-1/4">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Localisation
                </label>
                <select id="location" className="input">
                  <option value="">Toute l'île</option>
                  <option value="Antananarivo">Antananarivo</option>
                  <option value="Tamatave">Tamatave</option>
                  <option value="Mahajanga">Mahajanga</option>
                  <option value="Fianarantsoa">Fianarantsoa</option>
                  <option value="Toliara">Toliara</option>
                </select>
              </div>
              <button className="btn btn-primary py-3">
                Rechercher
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Comment ça marche</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              GreenTech Marketplace facilite l'échange de matériaux entre particuliers, artisans, et ONG à Madagascar.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="text-green-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Donnez ou Vendez</h3>
              <p className="text-gray-600">
                Publiez gratuitement vos annonces pour donner ou vendre à prix réduit vos matériaux inutilisés.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="text-blue-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Réutilisez</h3>
              <p className="text-gray-600">
                Trouvez des matériaux d'occasion pour vos projets de construction ou d'artisanat.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PiggyBank className="text-amber-600" size={28} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Économisez</h3>
              <p className="text-gray-600">
                Réduisez vos coûts tout en contribuant à l'économie circulaire et à la protection de l'environnement.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Listings */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Annonces Récentes</h2>
            <Link href="/listings" className="text-green-600 hover:text-green-700 flex items-center">
              Voir tout <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listingsLoading ? (
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow animate-pulse">
                  <div className="relative h-48 w-full bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : listingsData?.listings?.length ? (
              listingsData.listings.map(listing => (
                <div key={listing.id} className="card hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full bg-gray-200">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0].image}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 text-xs">[Image: {listing.title}]</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <span className="text-sm font-bold text-green-600">{formatPrice(listing.price)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin size={14} className="mr-1" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t">
                    <Link href={`/listings/${listing.id}`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Voir les détails
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="bg-green-50 p-6 rounded-full mb-4 flex items-center justify-center">
                  <Gift className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune annonce disponible pour le moment</h3>
                <p className="text-gray-500 mb-4">Soyez le premier à publier une annonce ou revenez plus tard !</p>
                <Link href="/listings/create" className="btn bg-green-600 text-white hover:bg-green-700">Déposer une annonce</Link>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Parcourir par catégorie</h2>
          
          {categoriesData?.categories?.length ? (
            <div className="flex flex-wrap justify-center gap-8">
              {categoriesData.categories.map(category => (
                <Link 
                  key={category.id} 
                  href={`/categories/${category.slug}`}
                  className="bg-white rounded-2xl shadow p-8 w-64 text-center hover:shadow-lg transition-shadow flex flex-col items-center"
                >
                  <div className="mb-3 flex items-center justify-center w-14 h-14 rounded-full bg-green-50">
                    <Gift className="h-7 w-7 text-green-500" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">Voir les annonces</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="bg-green-50 p-6 rounded-full mb-4 flex items-center justify-center">
                <Gift className="h-12 w-12 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune catégorie disponible</h3>
              <p className="text-gray-500">Les catégories seront bientôt disponibles.</p>
            </div>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nos partenaires</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Des entreprises engagées pour une construction durable
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {partners.map(partner => (
              <div key={partner.id} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 mx-auto mb-4 relative">
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-2">{partner.name}</h3>
                <p className="text-gray-600 text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à contribuer à l'économie circulaire?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez GreenTech Marketplace aujourd'hui et commencez à donner une seconde vie aux matériaux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register" className="btn bg-white text-green-700 hover:bg-gray-100">
              Créer un compte
            </Link>
            <Link href="/listings/create" className="btn bg-green-600 border border-white hover:bg-green-800">
              Déposer une annonce
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
