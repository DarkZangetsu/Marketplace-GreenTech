'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/lib/graphql/queries';
import Link from 'next/link';
import { Search, Filter, Grid, List, Hammer, Trees, Zap, Droplet, Scissors, Wrench, PaintBucket, Plus } from 'lucide-react';


const categoryIcons = {
  construction: Hammer,
  bois: Trees,
  electricite: Zap,
  plomberie: Droplet,
  textile: Scissors,
  metal: Wrench,
  peinture: PaintBucket,
  autres: Plus
};

const categoryColors = {
  default: { bg: 'bg-green-50', text: 'text-green-600', border: 'border-white' }
};

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    sortBy: 'name-asc'
  });

  const { data: categoriesData, loading, error } = useQuery(GET_CATEGORIES);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      sortBy: 'name-asc'
    });
  };

  // Filtrer et trier les catégories
  const filteredAndSortedCategories = categoriesData?.categories
    ?.filter(category => 
      category.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      category.slug.toLowerCase().includes(filters.search.toLowerCase())
    )
    .sort((a, b) => {
      if (filters.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (filters.sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    }) || [];

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex flex-col bg-gray-50">
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex flex-col bg-gray-50">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-red-600">Erreur lors du chargement des catégories</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-lg shadow-sm border border-green-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Catégories</h1>
            <p className="text-gray-600 mt-1">
              {filteredAndSortedCategories.length} catégories disponibles
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                name="search"
                placeholder="Rechercher une catégorie..."
                className="w-full pl-10 pr-4 py-2 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filters.search}
                onChange={handleFilterChange}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
            {/* Filter button (mobile) */}
            <button
              className="md:hidden flex items-center justify-center gap-2 w-full py-2 border border-green-200 rounded-md hover:bg-green-50 text-green-700"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              <span>{showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}</span>
            </button>
            
            {/* View mode toggle */}
            <div className="hidden md:flex items-center bg-gray-100 rounded-md p-1">
              <button
                className={`flex items-center justify-center p-1 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                onClick={() => setViewMode('grid')}
                aria-label="Vue en grille"
              >
                <Grid size={20} />
              </button>
              <button
                className={`flex items-center justify-center p-1 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                onClick={() => setViewMode('list')}
                aria-label="Vue en liste"
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Filters and content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar filters */}
          <div className={`md:w-64 md:block ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white p-5 border border-green-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Filtres</h2>
                <button 
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </button>
              </div>
              
              {/* Filter sections */}
              <div className="space-y-6">
                {/* Sort filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Trier par</h3>
                  <select
                    name="sortBy"
                    className="w-full border border-green-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                  >
                    <option value="name-asc">Nom (A-Z)</option>
                    <option value="name-desc">Nom (Z-A)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Categories content */}
          <div className="flex-1">
            {filteredAndSortedCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white border border-green-200 rounded-lg p-8 text-center shadow-sm">
                <div className="bg-green-50 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
                <p className="text-gray-600 max-w-md">
                  Essayez de modifier votre recherche pour trouver ce que vous cherchez.
                </p>
                <button
                  className="mt-4 text-green-600 hover:text-green-800 font-medium"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <>
                {viewMode === 'grid' ? (
                  /* Grid view */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAndSortedCategories.map(category => {
                      const Icon = categoryIcons[category.slug] || Plus;
                      const colors = categoryColors.default;
                      
                      return (
                        <Link 
                          key={category.id} 
                          href={`/listings?category=${category.slug}`}
                          className={`block bg-white rounded-lg border ${colors.border} hover:shadow-md transition-all duration-200 hover:border-green-300 p-6`}
                        >
                          <div className="flex flex-col h-full">
                            <div className="flex items-start justify-between mb-4">
                              <div className={`${colors.bg} p-3 rounded-lg`}>
                                <Icon size={24} className={colors.text} />
                              </div>
                            </div>
                            
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h2>
                            
                            <div className="mt-auto pt-4 border-t border-gray-100">
                              <div className="text-green-600 font-medium text-sm flex justify-between items-center">
                                <span>Voir les annonces</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  /* List view */
                  <div className="space-y-4">
                    {filteredAndSortedCategories.map(category => {
                      const Icon = categoryIcons[category.slug] || Plus;
                      const colors = categoryColors.default;
                      
                      return (
                        <Link 
                          key={category.id} 
                          href={`/listings?category=${category.slug}`}
                          className={`block bg-white rounded-lg border ${colors.border} hover:shadow-md transition-all duration-200 hover:border-green-300 p-6`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`${colors.bg} p-3 rounded-lg`}>
                              <Icon size={24} className={colors.text} />
                            </div>
                            <div className="flex-grow">
                              <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                            </div>
                            <div className="text-green-600 font-medium text-sm flex items-center gap-2">
                              <span>Voir les annonces</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}