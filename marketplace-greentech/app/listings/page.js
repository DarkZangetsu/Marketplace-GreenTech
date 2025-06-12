/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_LISTINGS, GET_CATEGORIES } from '@/lib/graphql/queries';
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ListingCard from '../components/ListingCard';
import { conditions, locations } from '../components/constants/CreateListingConstant';

// Composant qui utilise useSearchParams
function ListingsPageContent() {
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Hook pour détecter la taille d'écran
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // État de recherche complètement séparé et dynamique
  const [searchTerm, setSearchTerm] = useState('');

  // Filtres temporaires (sans la recherche)
  const [tempFilters, setTempFilters] = useState({
    categoryId: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    status: 'active',
    sortBy: 'date-desc'
  });

  // Filtres appliqués (sans la recherche)
  const [appliedFilters, setAppliedFilters] = useState({
    categoryId: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    status: 'active',
    sortBy: 'date-desc'
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Fonction pour transformer les conditions en format API (UPPER_CASE)
  const formatConditionForAPI = (condition) => {
    if (!condition) return undefined;
    return condition.toUpperCase().replace('-', '_');
  };

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  // Hook pour initialiser les filtres depuis l'URL
  useEffect(() => {
    const categorySlug = searchParams.get('category');
    if (categorySlug && categoriesData?.categories) {
      // Trouver la catégorie par slug
      const category = categoriesData.categories.find(cat => cat.slug === categorySlug);
      if (category) {
        const newFilters = {
          categoryId: category.id,
          condition: '',
          minPrice: '',
          maxPrice: '',
          location: '',
          status: 'active',
          sortBy: 'date-desc'
        };
        setTempFilters(newFilters);
        setAppliedFilters(newFilters);
        setCurrentPage(1);
      }
    }
  }, [searchParams, categoriesData?.categories]);

  const { data: listingsData, loading, error } = useQuery(GET_LISTINGS, {
    variables: {
      categoryId: appliedFilters.categoryId || undefined,
      condition: formatConditionForAPI(appliedFilters.condition),
      minPrice: appliedFilters.minPrice ? parseFloat(appliedFilters.minPrice) : undefined,
      maxPrice: appliedFilters.maxPrice ? parseFloat(appliedFilters.maxPrice) : undefined,
      location: appliedFilters.location || undefined,
      status: appliedFilters.status
    }
  });

  // Gestionnaire pour la recherche dynamique
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset à la première page lors d'une nouvelle recherche
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
    setShowFilters(false); // Fermer les filtres sur mobile après application
  };

  const resetFilters = () => {
    const defaultFilters = {
      categoryId: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      status: 'active',
      sortBy: 'date-desc'
    };
    setTempFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  // Fonction pour réinitialiser tout (recherche + filtres)
  const resetAll = () => {
    setSearchTerm('');
    resetFilters();
  };

  const filteredAndSortedListings = useMemo(() => {
    if (!listingsData?.listings) return [];

    let result = [...listingsData.listings];

    // Filtrage par recherche (dynamique, côté client)
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      result = result.filter(listing => 
        listing.title?.toLowerCase().includes(searchLower) ||
        listing.description?.toLowerCase().includes(searchLower) ||
        listing.category?.name?.toLowerCase().includes(searchLower) ||
        listing.location?.toLowerCase().includes(searchLower)
      );
    }

    // Trier les annonces
    result.sort((a, b) => {
      if (appliedFilters.sortBy === 'date-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (appliedFilters.sortBy === 'date-asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (appliedFilters.sortBy === 'price-asc') {
        return a.price - b.price;
      } else if (appliedFilters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });

    return result;
  }, [listingsData?.listings, searchTerm, appliedFilters.sortBy]);

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedListings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedListings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedListings.length / itemsPerPage);

  // Compter les filtres actifs (séparément)
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (appliedFilters.categoryId) count++;
    if (appliedFilters.condition) count++;
    if (appliedFilters.minPrice || appliedFilters.maxPrice) count++;
    if (appliedFilters.location) count++;
    return count;
  }, [appliedFilters]);

  // Vérifier si une recherche est active
  const hasActiveSearch = searchTerm.trim() !== '';

  // Obtenir le nom de la catégorie sélectionnée
  const selectedCategoryName = useMemo(() => {
    if (appliedFilters.categoryId && categoriesData?.categories) {
      const category = categoriesData.categories.find(cat => cat.id === appliedFilters.categoryId);
      return category?.name || '';
    }
    return '';
  }, [appliedFilters.categoryId, categoriesData?.categories]);

  // Vérifier si on vient d'une catégorie (depuis l'URL)
  const isFromCategoryPage = useMemo(() => {
    return searchParams.get('category') !== null;
  }, [searchParams]);

  if (loading && !listingsData) {
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
          <div className="text-red-600">Erreur lors du chargement des annonces</div>
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
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {isFromCategoryPage && selectedCategoryName
                  ? `Annonces - ${selectedCategoryName}`
                  : 'Annonces'
                }
              </h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                {filteredAndSortedListings.length} matériaux disponibles
                {isFromCategoryPage && selectedCategoryName && (
                  <span className="text-green-600 font-medium"> dans {selectedCategoryName}</span>
                )}
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              {/* Search - complètement séparée et dynamique */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Rechercher une annonce..."
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
                  {/* Category filter */}
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Catégorie</h3>
                    <select
                      name="categoryId"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      value={tempFilters.categoryId}
                      onChange={handleTempFilterChange}
                    >
                      <option value="">Toutes les catégories</option>
                      {categoriesData?.categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Condition filter */}
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">État</h3>
                    <select
                      name="condition"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      value={tempFilters.condition}
                      onChange={handleTempFilterChange}
                    >
                      <option value="">Tous les états</option>
                      {conditions.map(condition => (
                        <option key={condition.id} value={condition.id}>{condition.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Price filter */}
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Prix (en Ariary)</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        name="minPrice"
                        value={tempFilters.minPrice}
                        onChange={handleTempFilterChange}
                        placeholder="Min"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                      <input
                        type="number"
                        name="maxPrice"
                        value={tempFilters.maxPrice}
                        onChange={handleTempFilterChange}
                        placeholder="Max"
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Location filter */}
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Localisation</h3>
                    <select
                      name="location"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      value={tempFilters.location}
                      onChange={handleTempFilterChange}
                    >
                      <option value="">Toutes les villes</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Sort filter */}
                  <div className="lg:col-span-1">
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Trier par</h3>
                    <select
                      name="sortBy"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                      value={tempFilters.sortBy}
                      onChange={handleTempFilterChange}
                    >
                      <option value="date-desc">Plus récentes</option>
                      <option value="date-asc">Plus anciennes</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
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
          {(hasActiveSearch || activeFiltersCount > 0 || isFromCategoryPage) && (
            <div className="flex flex-wrap gap-2 items-center">
              {/* Category indicator (when coming from category page) */}
              {isFromCategoryPage && selectedCategoryName && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  📂 Catégorie: {selectedCategoryName}
                  <button
                    onClick={() => {
                      // Réinitialiser le filtre de catégorie
                      const newFilters = { ...appliedFilters, categoryId: '' };
                      setTempFilters(newFilters);
                      setAppliedFilters(newFilters);
                      setCurrentPage(1);
                      // Optionnel: modifier l'URL pour supprimer le paramètre category
                      window.history.replaceState({}, '', '/listings');
                    }}
                    className="ml-2 hover:text-green-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}

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
              {appliedFilters.condition && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  État: {conditions.find(c => c.id === appliedFilters.condition)?.name}
                  <button 
                    onClick={() => {
                      setTempFilters(prev => ({ ...prev, condition: '' }));
                      setAppliedFilters(prev => ({ ...prev, condition: '' }));
                    }}
                    className="ml-2 hover:text-green-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {appliedFilters.location && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Ville: {locations.find(l => l.id === appliedFilters.location)?.name}
                  <button 
                    onClick={() => {
                      setTempFilters(prev => ({ ...prev, location: '' }));
                      setAppliedFilters(prev => ({ ...prev, location: '' }));
                    }}
                    className="ml-2 hover:text-green-600"
                  >
                    <X size={14} />
                  </button>
                </span>
              )}
              {(appliedFilters.minPrice || appliedFilters.maxPrice) && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Prix: {appliedFilters.minPrice || '0'}€ - {appliedFilters.maxPrice || '∞'}€
                  <button 
                    onClick={() => {
                      setTempFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
                      setAppliedFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }));
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
          
          {/* Listings content */}
          <div className="flex-1">
            {paginatedListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-8 sm:p-12 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
                <p className="text-gray-600 max-w-md mb-4">
                  {hasActiveSearch && activeFiltersCount > 0 
                    ? "Essayez de modifier votre recherche ou vos filtres pour trouver ce que vous cherchez."
                    : hasActiveSearch 
                    ? "Aucun résultat pour cette recherche. Essayez d'autres mots-clés."
                    : activeFiltersCount > 0
                    ? "Aucune annonce ne correspond à vos filtres. Essayez de les modifier."
                    : "Aucune annonce disponible pour le moment."
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
                
                {/* Listings grid/list */}
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6" 
                  : "space-y-4"
                }>
                  {paginatedListings.map(listing => (
                    <ListingCard 
                      key={listing.id} 
                      listing={listing} 
                      viewMode={viewMode} 
                    />
                  ))}
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

// Composant principal avec Suspense boundary
export default function ListingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des annonces...</p>
        </div>
      </div>
    }>
      <ListingsPageContent />
    </Suspense>
  );
}