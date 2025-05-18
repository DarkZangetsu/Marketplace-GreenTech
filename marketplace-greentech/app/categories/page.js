'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Hammer, Trees, Zap, Droplet, Scissors, Wrench, PaintBucket, Plus } from 'lucide-react';

// Categories with icons and counts
const categoriesData = [
  { 
    id: 'construction', 
    name: 'Construction', 
    count: 24, 
    description: 'Briques, ciment, carreaux, et autres matériaux de construction',
    icon: Hammer,
    color: 'bg-orange-50 text-orange-600', 
    borderColor: 'border-orange-200'
  },
  { 
    id: 'bois', 
    name: 'Bois', 
    count: 18, 
    description: 'Planches, poutres, portes, et autres matériaux en bois',
    icon: Trees,
    color: 'bg-amber-50 text-amber-600', 
    borderColor: 'border-amber-200'
  },
  { 
    id: 'electricite', 
    name: 'Électricité', 
    count: 12, 
    description: 'Câbles, prises, interrupteurs, et autres matériels électriques',
    icon: Zap,
    color: 'bg-yellow-50 text-yellow-600', 
    borderColor: 'border-yellow-200'
  },
  { 
    id: 'plomberie', 
    name: 'Plomberie', 
    count: 8, 
    description: 'Tuyaux, raccords, robinets, et autres matériels de plomberie',
    icon: Droplet,
    color: 'bg-blue-50 text-blue-600', 
    borderColor: 'border-blue-200'
  },
  { 
    id: 'textile', 
    name: 'Textile', 
    count: 15, 
    description: 'Tissus, fils, boutons, et autres matériaux textiles',
    icon: Scissors,
    color: 'bg-purple-50 text-purple-600', 
    borderColor: 'border-purple-200'
  },
  { 
    id: 'metal', 
    name: 'Métaux', 
    count: 10, 
    description: 'Acier, aluminium, fer, et autres matériaux métalliques',
    icon: Wrench,
    color: 'bg-gray-50 text-gray-600', 
    borderColor: 'border-gray-300'
  },
  { 
    id: 'peinture', 
    name: 'Peinture', 
    count: 6, 
    description: 'Peintures, enduits, vernis, et autres revêtements',
    icon: PaintBucket,
    color: 'bg-green-50 text-green-600', 
    borderColor: 'border-green-200'
  },
  { 
    id: 'autres', 
    name: 'Autres', 
    count: 9, 
    description: 'Autres matériaux et fournitures diverses',
    icon: Plus,
    color: 'bg-pink-50 text-pink-600', 
    borderColor: 'border-pink-200'
  },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter categories based on search term
  const filteredCategories = categoriesData.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Parcourir par catégorie
          </h1>
          <p className="text-gray-600">
            Explorez les différentes catégories de matériaux disponibles sur notre plateforme.
            Des matériaux de construction aux textiles, trouvez ce dont vous avez besoin pour votre prochain projet.
          </p>
        </div>
        
        {/* Search bar */}
        <div className="max-w-md mx-auto w-full">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        
        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Aucune catégorie ne correspond à votre recherche.</p>
            <button
              className="mt-4 text-green-600 hover:text-green-800 font-medium"
              onClick={() => setSearchTerm('')}
            >
              Voir toutes les catégories
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map(category => (
              <Link 
                key={category.id} 
                href={`/listings?category=${category.id}`}
                className={`block rounded-lg border ${category.borderColor} hover:shadow-md transition-shadow p-6`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`${category.color} p-3 rounded-lg`}>
                      <category.icon size={24} />
                    </div>
                    <div className="bg-gray-100 rounded-full px-3 py-1 text-gray-700 text-sm">
                      {category.count} {category.count > 1 ? 'annonces' : 'annonce'}
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h2>
                  <p className="text-gray-600 text-sm flex-grow">{category.description}</p>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-green-600 font-medium text-sm flex justify-between items-center">
                      <span>Voir les annonces</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {/* Popular searches */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recherches populaires</h2>
          <div className="flex flex-wrap gap-2">
            {['Briques', 'Bois de charpente', 'Panneaux solaires', 'Tissus', 'Câbles électriques', 'Carrelage', 'Peinture écologique'].map(term => (
              <Link 
                key={term} 
                href={`/listings?search=${term}`}
                className="bg-gray-100 hover:bg-gray-200 transition-colors rounded-full px-4 py-2 text-gray-700 text-sm"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
        
        {/* Call to action */}
        <div className="mt-12 bg-green-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Vous avez des matériaux à donner ou à vendre?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Contribuez à l'économie circulaire en donnant une seconde vie à vos matériaux inutilisés.
            Publiez gratuitement vos annonces et aidez d'autres à réaliser leurs projets tout en réduisant les déchets.
          </p>
          <Link 
            href="/listings/create"
            className="btn btn-primary inline-block px-6 py-3"
          >
            Déposer une annonce
          </Link>
        </div>
      </div>
    </div>
  );
} 