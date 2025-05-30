'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '@/lib/graphql/queries';
import Link from 'next/link';
import {
  Search, Filter, Grid, List, ChevronLeft, ChevronRight, X,
  // Matériaux de construction
  TreePine, Building, Hammer, Zap,
  // Outils
  Wrench, Cpu, HardHat, Shield,
  // Artisanat
  Scissors, Gem, Palette, Mountain,
  // Mobilier
  Armchair, Package, Sofa,
  // Recyclage
  Recycle, FileText, Layers, Smartphone,
  // Autres icônes
  Home, Droplets, Paintbrush, DoorOpen,
  Settings, Drill, Factory, ShoppingBag
} from 'lucide-react';

const categoryIcons = {
  // Matériaux de construction
  'bois': TreePine,
  'ciment-beton': Building,
  'briques-blocs': Building,
  'metaux': Wrench,
  'toiture': Home,
  'plomberie': Droplets,
  'electricite': Zap,
  'peinture-revetements': Paintbrush,
  'fenetres-portes': DoorOpen,
  'verre': Mountain,
  
  // Outils
  'outils-manuels': Hammer,
  'outils-electriques': Drill,
  'outils-info-electronique': Cpu,
  'equipement-chantier': HardHat,
  'protection': Shield,
  
  // Artisanat
  'tissus-textiles': Scissors,
  'perles-accessoires': Gem,
  'bois-artisanat': TreePine,
  'argile-terre': Mountain,
  'peintures-encres': Palette,
  
  // Mobilier
  'meubles-bois': Armchair,
  'mobilier-metal': Factory,
  'decoration': Sofa,
  'materiaux-reutilisables': Package,
  
  // Recyclage
  'plastique': Recycle,
  'carton-papier': FileText,
  'composites': Layers,
  'deee': Smartphone
};

const categoryColors = {
  default: { bg: 'bg-gray-50', text: 'text-gray-600', border: 'border-white' }
};

export default function CategoriesPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // État de recherche dynamique
  const [searchTerm, setSearchTerm] = useState('');

  // Filtres temporaires
  const [tempFilters, setTempFilters] = useState({
    sortBy: 'name-asc'
  });

  // Filtres appliqués
  const [appliedFilters, setAppliedFilters] = useState({
    sortBy: 'name-asc'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Hook pour détecter la taille d'écran
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const { data: categoriesData, loading, error } = useQuery(GET_CATEGORIES);

  // Gestionnaire pour la recherche dynamique
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Fonction pour réinitialiser uniquement la recherche
  const clearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleTempFilterChange = (e) => {
    const { name, value } = e.target;
    setTempFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters({ ...tempFilters });
    setCurrentPage(1);
    setShowFilters(false);
  };

  const resetFilters = () => {
    const defaultFilters = {
      sortBy: 'name-asc'
    };
    setTempFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  // Fonction pour réinitialiser tout
  const resetAll = () => {
    setSearchTerm('');
    resetFilters();
  };

  // Filtrer et trier les catégories
  const filteredAndSortedCategories = useMemo(() => {
    if (!categoriesData?.categories) return [];

    let result = [...categoriesData.categories];

    // Filtrage par recherche (dynamique, côté client)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(category =>
        category.name?.toLowerCase().includes(searchLower) ||
        category.slug?.toLowerCase().includes(searchLower)
      );
    }

    // Trier les catégories
    result.sort((a, b) => {
      if (appliedFilters.sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (appliedFilters.sortBy === 'name-desc') {
        return b.name.localeCompare(a.name);
      }
      return 0;
    });

    return result;
  }, [categoriesData?.categories, searchTerm, appliedFilters.sortBy]);

  const paginatedCategories = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCategories.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCategories, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedCategories.length / itemsPerPage);

  // Compter les filtres actifs
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.sortBy !== 'name-asc') count++;
    return count;
  }, [appliedFilters]);

  // Vérifier si une recherche est active
  const hasActiveSearch = searchTerm.trim() !== '';

  if (loading && !categoriesData) {
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Catégories</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {filteredAndSortedCategories.length} catégories disponibles
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search - complètement séparée et dynamique */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Rechercher une catégorie..."
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                {hasActiveSearch && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Filter button */}
              <button
                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white relative text-sm font-medium"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} />
                <span className="hidden sm:inline">
                  {showFilters ? 'Masquer' : 'Filtres'}
                </span>
                <span className="sm:hidden">Filtres</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* View mode toggle - Desktop only */}
              <div className="hidden lg:flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  className={`flex items-center justify-center p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  onClick={() => setViewMode('grid')}
                  aria-label="Vue en grille"
                >
                  <Grid size={18} />
                </button>
                <button
                  className={`flex items-center justify-center p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                  onClick={() => setViewMode('list')}
                  aria-label="Vue en liste"
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
              {/* Mobile filter header */}
              <div className="sm:hidden flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Filtres</h2>
                <button
                  className="p-1 hover:bg-gray-100 rounded"
                  onClick={() => setShowFilters(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 sm:p-6">
                <div className="hidden sm:flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold">Filtres</h2>
                  <button
                    className="text-green-600 hover:text-green-800 text-sm font-medium"
                    onClick={resetFilters}
                  >
                    Réinitialiser les filtres
                  </button>
                </div>

                {/* Filter sections */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {/* Sort filter */}
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Trier par</h3>
                    <select
                      name="sortBy"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      value={tempFilters.sortBy}
                      onChange={handleTempFilterChange}
                    >
                      <option value="name-asc">Nom (A-Z)</option>
                      <option value="name-desc">Nom (Z-A)</option>
                    </select>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={applyFilters}
                    className="flex-1 bg-green-600 text-white px-4 py-2.5 rounded-lg hover:bg-green-700 font-medium text-sm transition-colors"
                  >
                    Appliquer les filtres
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors"
                  >
                    Réinitialiser les filtres
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active filters and search display */}
          {(hasActiveSearch || activeFiltersCount > 0) && (
            <div className="flex flex-wrap gap-2 items-center">
              {/* Search indicator */}
              {hasActiveSearch && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <Search size={12} className="mr-1" />
                  Recherche: "{searchTerm}"
                  <button
                    onClick={clearSearch}
                    className="ml-2 hover:text-blue-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {/* Filter indicators */}
              {appliedFilters.sortBy !== 'name-asc' && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Tri: {appliedFilters.sortBy === 'name-desc' ? 'Z-A' : 'A-Z'}
                  <button
                    onClick={() => {
                      setTempFilters(prev => ({ ...prev, sortBy: 'name-asc' }));
                      setAppliedFilters(prev => ({ ...prev, sortBy: 'name-asc' }));
                    }}
                    className="ml-2 hover:text-green-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

              {/* Reset all button when both search and filters are active */}
              {hasActiveSearch && activeFiltersCount > 0 && (
                <button
                  onClick={resetAll}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Tout réinitialiser
                </button>
              )}
            </div>
          )}

          {/* Categories content */}
          <div className="flex-1">
            {paginatedCategories.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune catégorie trouvée</h3>
                <p className="text-gray-600 max-w-md mb-4">
                  {hasActiveSearch && activeFiltersCount > 0
                    ? "Essayez de modifier votre recherche ou vos filtres pour trouver ce que vous cherchez."
                    : hasActiveSearch
                    ? "Aucun résultat pour cette recherche. Essayez d'autres mots-clés."
                    : activeFiltersCount > 0
                    ? "Aucune catégorie ne correspond à vos filtres. Essayez de les modifier."
                    : "Aucune catégorie disponible pour le moment."
                  }
                </p>
                <div className="flex gap-2">
                  {hasActiveSearch && (
                    <button
                      className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                      onClick={clearSearch}
                    >
                      Effacer la recherche
                    </button>
                  )}
                  {activeFiltersCount > 0 && (
                    <button
                      className="text-green-600 hover:text-green-800 font-medium text-sm"
                      onClick={resetFilters}
                    >
                      Réinitialiser les filtres
                    </button>
                  )}
                  {hasActiveSearch && activeFiltersCount > 0 && (
                    <button
                      className="text-gray-600 hover:text-gray-800 font-medium text-sm"
                      onClick={resetAll}
                    >
                      Tout réinitialiser
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <>
                {/* View mode toggle - Mobile */}
                <div className="lg:hidden mb-4">
                  <div className="flex items-center bg-gray-100 rounded-lg p-1 w-fit">
                    <button
                      className={`flex items-center justify-center p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                      onClick={() => setViewMode('grid')}
                      aria-label="Vue en grille"
                    >
                      <Grid size={18} />
                    </button>
                    <button
                      className={`flex items-center justify-center p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
                      onClick={() => setViewMode('list')}
                      aria-label="Vue en liste"
                    >
                      <List size={18} />
                    </button>
                  </div>
                </div>

                {/* Categories grid/list */}
                <div className={viewMode === 'grid'
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
                  : "space-y-4"
                }>
                  {paginatedCategories.map(category => {
                    const Icon = categoryIcons[category.slug] || ShoppingBag;
                    const colors = categoryColors.default;

                    return viewMode === 'grid' ? (
                      <Link
                        key={category.id}
                        href={`/listings?category=${category.slug}`}
                        className="block bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 p-6"
                      >
                        <div className="flex flex-col h-full">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`${colors.bg} p-3 rounded-lg`}>
                              <Icon size={24} className={colors.text} />
                            </div>
                          </div>

                          <h2 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h2>

                          <div className="mt-auto pt-4 border-t border-gray-100">
                            <div className="text-gray-600 font-medium text-sm flex justify-between items-center">
                              <span>Voir les annonces</span>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        key={category.id}
                        href={`/listings?category=${category.slug}`}
                        className="block bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300 p-6"
                      >
                        <div className="flex items-center gap-4">
                          <div className={`${colors.bg} p-3 rounded-lg`}>
                            <Icon size={24} className={colors.text} />
                          </div>
                          <div className="flex-grow">
                            <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                          </div>
                          <div className="text-gray-600 font-medium text-sm flex items-center gap-2">
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    {/* Indicateur de page pour mobile */}
                    {isMobile && (
                      <div className="text-center mb-4">
                        <span className="text-sm text-gray-600">
                          Page {currentPage} sur {totalPages}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-center items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {/* Pagination intelligente pour mobile */}
                    {isMobile ? (
                      <>
                        {currentPage > 2 && (
                          <>
                            <button
                              onClick={() => setCurrentPage(1)}
                              className="px-3 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            >
                              1
                            </button>
                            {currentPage > 3 && <span className="px-2 text-gray-500">...</span>}
                          </>
                        )}

                        {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
                          .filter(page => page >= 1 && page <= totalPages)
                          .map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-lg border transition-colors ${page === currentPage ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                            >
                              {page}
                            </button>
                          ))
                        }

                        {currentPage < totalPages - 1 && (
                          <>
                            {currentPage < totalPages - 2 && <span className="px-2 text-gray-500">...</span>}
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              className="px-3 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </>
                    ) : totalPages <= 10 ? (
                      // Desktop : afficher toutes les pages si <= 10
                      Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-2 rounded-lg border transition-colors ${page === currentPage ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                        >
                          {page}
                        </button>
                      ))
                    ) : (
                      // Desktop : pagination intelligente si > 10 pages
                      <>
                        {currentPage > 3 && (
                          <>
                            <button
                              onClick={() => setCurrentPage(1)}
                              className="px-3 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            >
                              1
                            </button>
                            {currentPage > 4 && <span className="px-2 text-gray-500">...</span>}
                          </>
                        )}

                        {Array.from({ length: 5 }, (_, i) => currentPage - 2 + i)
                          .filter(page => page >= 1 && page <= totalPages)
                          .map(page => (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-3 py-2 rounded-lg border transition-colors ${page === currentPage ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                            >
                              {page}
                            </button>
                          ))
                        }

                        {currentPage < totalPages - 2 && (
                          <>
                            {currentPage < totalPages - 3 && <span className="px-2 text-gray-500">...</span>}
                            <button
                              onClick={() => setCurrentPage(totalPages)}
                              className="px-3 py-2 rounded-lg border bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                            >
                              {totalPages}
                            </button>
                          </>
                        )}
                      </>
                    )}

                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50 transition-colors"
                    >
                      <ChevronRight size={18} />
                    </button>
                    </div>
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