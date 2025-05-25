/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { GET_LISTINGS, GET_CATEGORIES } from '@/lib/graphql/queries';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Filter, MapPin, Calendar, ArrowUpDown, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react';

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  const timeoutRef = useRef();
  
  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setDebounced(value);
    }, delay);
    return () => clearTimeout(timeoutRef.current);
  }, [value, delay]);
  return debounced;
}

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    categoryId: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    status: 'active',
    sortBy: 'date-desc'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Debounced filters pour la recherche et les champs texte seulement
  const debouncedSearch = useDebouncedValue(filters.search, 800);
  const debouncedLocation = useDebouncedValue(filters.location, 800);
  const debouncedMinPrice = useDebouncedValue(filters.minPrice, 1000);
  const debouncedMaxPrice = useDebouncedValue(filters.maxPrice, 1000);

  // Créer les variables pour Apollo en combinant les valeurs debounced et non-debounced
  const apolloVariables = useMemo(() => ({
    search: debouncedSearch || undefined,
    categoryId: filters.categoryId || undefined,
    condition: filters.condition || undefined,
    minPrice: debouncedMinPrice ? parseFloat(debouncedMinPrice) : undefined,
    maxPrice: debouncedMaxPrice ? parseFloat(debouncedMaxPrice) : undefined,
    location: debouncedLocation || undefined,
    status: filters.status
  }), [debouncedSearch, debouncedLocation, debouncedMinPrice, debouncedMaxPrice, filters.categoryId, filters.condition, filters.status]);

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: listingsData, loading, error } = useQuery(GET_LISTINGS, {
    variables: apolloVariables
  });

  // Utiliser useCallback pour éviter les re-créations inutiles de la fonction
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // Réinitialiser la page seulement pour certains filtres
    if (name !== 'sortBy') {
      setCurrentPage(1);
    }
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      categoryId: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      status: 'active',
      sortBy: 'date-desc'
    });
    setCurrentPage(1);
  }, []);

  const filteredAndSortedListings = useMemo(() => {
    if (!listingsData?.listings) return [];

    let result = [...listingsData.listings];

    // Trier les annonces
    result.sort((a, b) => {
      if (filters.sortBy === 'date-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else if (filters.sortBy === 'date-asc') {
        return new Date(a.createdAt) - new Date(b.createdAt);
      } else if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      } else if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      return 0;
    });

    return result;
  }, [listingsData?.listings, filters.sortBy]);

  const paginatedListings = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedListings.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedListings, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedListings.length / itemsPerPage);
  const hasMore = currentPage < totalPages;

  // Mémoriser les composants d'input pour éviter les re-renders
  const SearchInput = useMemo(() => (
    <div className="relative w-full md:w-64">
      <input
        type="text"
        name="search"
        placeholder="Rechercher une annonce..."
        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        value={filters.search}
        onChange={handleFilterChange}
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
    </div>
  ), [filters.search, handleFilterChange]);

  const CategorySelect = useMemo(() => (
    <select
      name="categoryId"
      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      value={filters.categoryId}
      onChange={handleFilterChange}
    >
      <option value="">Toutes les catégories</option>
      {categoriesData?.categories.map(category => (
        <option key={category.id} value={category.id}>{category.name}</option>
      ))}
    </select>
  ), [filters.categoryId, handleFilterChange, categoriesData?.categories]);

  const ConditionSelect = useMemo(() => (
    <select
      name="condition"
      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      value={filters.condition}
      onChange={handleFilterChange}
    >
      <option value="">Tous les états</option>
      <option value="new">Neuf</option>
      <option value="like_new">Comme neuf</option>
      <option value="good">Bon état</option>
      <option value="fair">État moyen</option>
      <option value="poor">Mauvais état</option>
    </select>
  ), [filters.condition, handleFilterChange]);

  const PriceInputs = useMemo(() => (
    <div className="grid grid-cols-2 gap-2">
      <input
        type="number"
        name="minPrice"
        value={filters.minPrice}
        onChange={handleFilterChange}
        placeholder="Min"
        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
      <input
        type="number"
        name="maxPrice"
        value={filters.maxPrice}
        onChange={handleFilterChange}
        placeholder="Max"
        className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </div>
  ), [filters.minPrice, filters.maxPrice, handleFilterChange]);

  const LocationInput = useMemo(() => (
    <input
      type="text"
      name="location"
      value={filters.location}
      onChange={handleFilterChange}
      placeholder="Ville, région..."
      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
    />
  ), [filters.location, handleFilterChange]);

  const SortSelect = useMemo(() => (
    <select
      name="sortBy"
      className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
      value={filters.sortBy}
      onChange={handleFilterChange}
    >
      <option value="date-desc">Plus récentes</option>
      <option value="date-asc">Plus anciennes</option>
      <option value="price-asc">Prix croissant</option>
      <option value="price-desc">Prix décroissant</option>
    </select>
  ), [filters.sortBy, handleFilterChange]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Annonces</h1>
            <p className="text-gray-600 mt-1">
              {filteredAndSortedListings.length} matériaux disponibles
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            {SearchInput}
            
            {/* Filter button (mobile) */}
            <button
              className="md:hidden flex items-center justify-center gap-2 w-full py-2 border border-gray-200 rounded-md hover:bg-gray-50"
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
            <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Filtres</h2>
                <button 
                  className="text-green-600 hover:text-green-800 text-sm font-medium"
                  onClick={resetFilters}
                >
                  Réinitialiser
                </button>
              </div>
              
              {/* Filter sections */}
              <div className="space-y-6">
                {/* Category filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Catégorie</h3>
                  {CategorySelect}
                </div>
                
                {/* Condition filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">État</h3>
                  {ConditionSelect}
                </div>
                
                {/* Price filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Prix</h3>
                  {PriceInputs}
                </div>
                
                {/* Location filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Localisation</h3>
                  {LocationInput}
                </div>
                
                {/* Sort filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Trier par</h3>
                  {SortSelect}
                </div>
              </div>
            </div>
          </div>
          
          {/* Listings content */}
          <div className="flex-1">
            {paginatedListings.length === 0 ? (
              <div className="flex flex-col items-center justify-center bg-white border border-gray-200 rounded-lg p-8 text-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
                <p className="text-gray-600 max-w-md">
                  Essayez de modifier vos filtres ou votre recherche pour trouver ce que vous cherchez.
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
                {/* Sort dropdown (mobile) */}
                <div className="md:hidden mb-4">
                  <div className="flex items-center bg-white px-3 py-2 border border-gray-200 rounded-md">
                    <ArrowUpDown size={16} className="text-gray-500 mr-2" />
                    <select
                      name="sortBy"
                      className="w-full bg-transparent border-none focus:outline-none text-sm"
                      value={filters.sortBy}
                      onChange={handleFilterChange}
                    >
                      <option value="date-desc">Plus récentes</option>
                      <option value="date-asc">Plus anciennes</option>
                      <option value="price-asc">Prix croissant</option>
                      <option value="price-desc">Prix décroissant</option>
                    </select>
                  </div>
                </div>
                
                {viewMode === 'grid' ? (
                  /* Grid view */
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedListings.map(listing => (
                      <Link 
                        href={`/listings/${listing.id}`} 
                        key={listing.id}
                        className="card hover:shadow-lg transition-shadow"
                      >
                        <div className="relative h-48 w-full bg-gray-200">
                          {listing.images && listing.images.length > 0 ? (
                            <Image
                              src={`http://localhost:8000/media/${listing.images[0].image}`}
                              alt={listing.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                              <span className="text-gray-500 text-xs">Pas d'image</span>
                            </div>
                          )}
                          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
                            <span className="font-medium text-green-600">
                              {listing.isFree ? 'Gratuit' : `${listing.price} Ar`}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-lg">{listing.title}</h3>
                          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{listing.description}</p>
                          <div className="mt-4 flex justify-between items-center">
                            <div className="flex items-center text-gray-500 text-sm">
                              <MapPin size={14} className="mr-1" />
                              <span>{listing.location}</span>
                            </div>
                            <div className="flex items-center text-gray-500 text-sm">
                              <Calendar size={14} className="mr-1" />
                              <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {listing.category.name}
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                              {listing.condition}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  /* List view */
                  <div className="space-y-4">
                    {paginatedListings.map(listing => (
                      <Link 
                        href={`/listings/${listing.id}`} 
                        key={listing.id}
                        className="card hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative h-48 sm:h-auto sm:w-48 bg-gray-200">
                            {listing.images && listing.images.length > 0 ? (
                              <Image
                                src={`http://localhost:8000/media/${listing.images[0].image}`}
                                alt={listing.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                                <span className="text-gray-500 text-xs">Pas d'image</span>
                              </div>
                            )}
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                              <h3 className="font-semibold text-lg">{listing.title}</h3>
                              <div className="mt-2 sm:mt-0 bg-green-50 px-3 py-1 rounded-full text-green-600 font-medium">
                                {listing.isFree ? 'Gratuit' : `${listing.price} Ar`}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">{listing.description}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {listing.category.name}
                              </span>
                              <span className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded-full">
                                {listing.condition}
                              </span>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                              <div className="flex items-center text-gray-500 text-sm">
                                <MapPin size={14} className="mr-1" />
                                <span>{listing.location}</span>
                              </div>
                              <div className="flex items-center text-gray-500 text-sm">
                                <Calendar size={14} className="mr-1" />
                                <span>{new Date(listing.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {/* Load more button */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      ) : (
                        'Charger plus d\'annonces'
                      )}
                    </button>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center items-center gap-2">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`px-3 py-1 rounded border ${page === currentPage ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      <ChevronRight size={18} />
                    </button>
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