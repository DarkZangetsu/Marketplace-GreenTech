/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Gift, PiggyBank, Recycle, MapPin } from "lucide-react";

// Mock data for listings
const featuredListings = [
  {
    id: 1,
    title: "Briques de construction",
    description: "Lot de 100 briques rouges récupérées d'un chantier, en excellent état",
    category: "Construction",
    image: "/images/bricks.jpg",
    location: "Antananarivo",
    date: "18/05/2023",
    price: 150000,
  },
  {
    id: 2,
    title: "Poutres en bois",
    description: "Ensemble de poutres en bois dur de diverses tailles, idéal pour la construction ou l'artisanat",
    category: "Bois",
    image: "/images/wood.jpg",
    location: "Tamatave",
    date: "15/05/2023",
    price: 0,
  },
  {
    id: 3,
    title: "Panneaux solaires usagés",
    description: "Panneaux solaires fonctionnels mais avec quelques rayures. Puissance totale: 200W",
    category: "Électricité",
    image: "/images/solar.jpg",
    location: "Mahajanga",
    date: "12/05/2023",
    price: 75000,
  },
  {
    id: 4,
    title: "Tissus pour artisanat",
    description: "Chutes de tissus colorés, parfaits pour l'artisanat et la couture",
    category: "Textile",
    image: "/images/textile.jpg",
    location: "Fianarantsoa",
    date: "10/05/2023",
    price: 25000,
  },
];

// Mock data for categories
const categories = [
  { id: 1, name: "Construction", count: 24 },
  { id: 2, name: "Bois", count: 18 },
  { id: 3, name: "Métaux", count: 12 },
  { id: 4, name: "Électricité", count: 9 },
  { id: 5, name: "Plomberie", count: 7 },
  { id: 6, name: "Textile", count: 15 },
];

// Helper to format price
const formatPrice = (price) => {
  if (price === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-MG", { style: "currency", currency: "MGA" }).format(price);
};

export default function Home() {
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
                  {categories.map(category => (
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
            {featuredListings.map(listing => (
              <div key={listing.id} className="card hover:shadow-lg transition-shadow">
                <div className="relative h-48 w-full bg-gray-200">
                  {/* This would be an actual image in production */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500 text-xs">[Image: {listing.title}]</span>
                  </div>
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
                    <div className="text-xs text-gray-400">{listing.date}</div>
                  </div>
                </div>
                <div className="px-4 py-3 bg-gray-50 border-t">
                  <Link href={`/listings/${listing.id}`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                    Voir les détails
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Parcourir par catégorie</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map(category => (
              <Link 
                key={category.id} 
                href={`/categories/${category.id}`}
                className="bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">{category.count} annonces</p>
              </Link>
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
