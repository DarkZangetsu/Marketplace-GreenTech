'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, MapPin, Calendar, ArrowUpDown, Grid, List } from 'lucide-react';

// Mock data for listings
const mockListings = [
  {
    id: 1,
    title: 'Briques de construction',
    description: 'Lot de 100 briques rouges récupérées d\'un chantier, en excellent état. Idéal pour petites constructions ou rénovations.',
    category: 'Construction',
    image: '/images/bricks.jpg',
    location: 'Antananarivo',
    date: '18/05/2023',
    price: 150000,
    condition: 'Excellent',
  },
  {
    id: 2,
    title: 'Poutres en bois',
    description: 'Ensemble de poutres en bois dur de diverses tailles, idéal pour la construction ou l\'artisanat. Bois massif de haute qualité.',
    category: 'Bois',
    image: '/images/wood.jpg',
    location: 'Tamatave',
    date: '15/05/2023',
    price: 0,
    condition: 'Bon',
  },
  {
    id: 3,
    title: 'Panneaux solaires usagés',
    description: 'Panneaux solaires fonctionnels mais avec quelques rayures. Puissance totale: 200W. Parfait pour petites installations.',
    category: 'Électricité',
    image: '/images/solar.jpg',
    location: 'Mahajanga',
    date: '12/05/2023',
    price: 75000,
    condition: 'Acceptable',
  },
  {
    id: 4,
    title: 'Tissus pour artisanat',
    description: 'Chutes de tissus colorés, parfaits pour l\'artisanat et la couture. Différentes textures et motifs disponibles.',
    category: 'Textile',
    image: '/images/textile.jpg',
    location: 'Fianarantsoa',
    date: '10/05/2023',
    price: 25000,
    condition: 'Neuf',
  },
  {
    id: 5,
    title: 'Tuyaux en PVC',
    description: 'Lot de tuyaux en PVC de différents diamètres. Idéal pour plomberie ou projets DIY.',
    category: 'Plomberie',
    image: '/images/pipes.jpg',
    location: 'Antananarivo',
    date: '08/05/2023',
    price: 35000,
    condition: 'Bon',
  },
  {
    id: 6,
    title: 'Portes en bois massif',
    description: 'Deux portes en bois massif avec poignées et charnières. Parfait état, démontées soigneusement.',
    category: 'Bois',
    image: '/images/doors.jpg',
    location: 'Toliara',
    date: '05/05/2023',
    price: 120000,
    condition: 'Excellent',
  },
  {
    id: 7,
    title: 'Câbles électriques',
    description: 'Lot de câbles électriques de différentes sections. Environ 50 mètres au total.',
    category: 'Électricité',
    image: '/images/cables.jpg',
    location: 'Antananarivo',
    date: '03/05/2023',
    price: 40000,
    condition: 'Bon',
  },
  {
    id: 8,
    title: 'Carreaux de céramique',
    description: 'Carreaux de céramique bleus, 15x15cm. Reste d\'un projet de rénovation, environ 12 m².',
    category: 'Construction',
    image: '/images/tiles.jpg',
    location: 'Mahajanga',
    date: '01/05/2023',
    price: 60000,
    condition: 'Neuf',
  },
];

// Categories
const categories = [
  { id: 'all', name: 'Toutes les catégories' },
  { id: 'construction', name: 'Construction' },
  { id: 'bois', name: 'Bois' },
  { id: 'electricite', name: 'Électricité' },
  { id: 'plomberie', name: 'Plomberie' },
  { id: 'textile', name: 'Textile' },
  { id: 'metal', name: 'Métaux' },
  { id: 'peinture', name: 'Peinture' },
];

// Locations
const locations = [
  { id: 'all', name: 'Toute l\'île' },
  { id: 'antananarivo', name: 'Antananarivo' },
  { id: 'tamatave', name: 'Tamatave' },
  { id: 'mahajanga', name: 'Mahajanga' },
  { id: 'fianarantsoa', name: 'Fianarantsoa' },
  { id: 'toliara', name: 'Toliara' },
  { id: 'antsiranana', name: 'Antsiranana' },
];

// Conditions
const conditions = [
  { id: 'all', name: 'Tous états' },
  { id: 'neuf', name: 'Neuf' },
  { id: 'excellent', name: 'Excellent' },
  { id: 'bon', name: 'Bon' },
  { id: 'acceptable', name: 'Acceptable' },
  { id: 'a-renover', name: 'À rénover' },
];

// Price ranges
const priceRanges = [
  { id: 'all', name: 'Tous les prix' },
  { id: 'free', name: 'Gratuit' },
  { id: '0-50000', name: 'Moins de 50 000 Ar' },
  { id: '50000-100000', name: '50 000 - 100 000 Ar' },
  { id: '100000-200000', name: '100 000 - 200 000 Ar' },
  { id: '200000+', name: 'Plus de 200 000 Ar' },
];

// Helper to format price
const formatPrice = (price) => {
  if (price === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-MG', { 
    style: 'currency', 
    currency: 'MGA',
    maximumFractionDigits: 0 
  }).format(price);
};

export default function ListingsPage() {
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: 'all',
    location: 'all',
    condition: 'all',
    priceRange: 'all',
    sortBy: 'date-desc',
  });

  // Filter listings based on search and filters
  const filteredListings = mockListings.filter(listing => {
    // Search term filter
    if (searchTerm && !listing.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !listing.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Category filter
    if (filters.category !== 'all' && listing.category.toLowerCase() !== filters.category) {
      return false;
    }
    
    // Location filter
    if (filters.location !== 'all' && listing.location.toLowerCase() !== filters.location) {
      return false;
    }
    
    // Condition filter
    if (filters.condition !== 'all' && listing.condition.toLowerCase() !== filters.condition.toLowerCase()) {
      return false;
    }
    
    // Price range filter
    if (filters.priceRange !== 'all') {
      if (filters.priceRange === 'free' && listing.price !== 0) {
        return false;
      } else if (filters.priceRange === '0-50000' && (listing.price > 50000 || listing.price === 0)) {
        return false;
      } else if (filters.priceRange === '50000-100000' && (listing.price < 50000 || listing.price > 100000)) {
        return false;
      } else if (filters.priceRange === '100000-200000' && (listing.price < 100000 || listing.price > 200000)) {
        return false;
      } else if (filters.priceRange === '200000+' && listing.price < 200000) {
        return false;
      }
    }
    
    return true;
  }).sort((a, b) => {
    // Sort listings
    const dateSortFactor = filters.sortBy.includes('desc') ? -1 : 1;
    
    if (filters.sortBy.includes('date')) {
      return dateSortFactor * (new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-')));
    } else if (filters.sortBy.includes('price')) {
      return filters.sortBy.includes('desc') ? b.price - a.price : a.price - b.price;
    }
    
    return 0;
  });

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  const resetFilters = () => {
    setFilters({
      category: 'all',
      location: 'all',
      condition: 'all',
      priceRange: 'all',
      sortBy: 'date-desc',
    });
    setSearchTerm('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Annonces</h1>
            <p className="text-gray-600 mt-1">
              {filteredListings.length} matériaux disponibles
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Rechercher une annonce..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            </div>
            
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
                  <select
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filters.category}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Location filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Localisation</h3>
                  <select
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  >
                    {locations.map(location => (
                      <option key={location.id} value={location.id}>{location.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Condition filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">État</h3>
                  <select
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filters.condition}
                    onChange={(e) => handleFilterChange('condition', e.target.value)}
                  >
                    {conditions.map(condition => (
                      <option key={condition.id} value={condition.id}>{condition.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Price filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Prix</h3>
                  <select
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filters.priceRange}
                    onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                  >
                    {priceRanges.map(range => (
                      <option key={range.id} value={range.id}>{range.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Sort filter */}
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Trier par</h3>
                  <select
                    className="w-full border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  >
                    <option value="date-desc">Plus récentes</option>
                    <option value="date-asc">Plus anciennes</option>
                    <option value="price-asc">Prix croissant</option>
                    <option value="price-desc">Prix décroissant</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Listings content */}
          <div className="flex-1">
            {filteredListings.length === 0 ? (
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
                      className="w-full bg-transparent border-none focus:outline-none text-sm"
                      value={filters.sortBy}
                      onChange={(e) => handleFilterChange('sortBy', e.target.value)}
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
                    {filteredListings.map(listing => (
                      <Link 
                        href={`/listings/${listing.id}`} 
                        key={listing.id}
                        className="card hover:shadow-lg transition-shadow"
                      >
                        <div className="relative h-48 w-full bg-gray-200">
                          {/* This would be an actual image in production */}
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                            <span className="text-gray-500 text-xs">[Image: {listing.title}]</span>
                          </div>
                          <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-md shadow-sm">
                            <span className="font-medium text-green-600">{formatPrice(listing.price)}</span>
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
                              <span>{listing.date}</span>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between">
                            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                              {listing.category}
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
                    {filteredListings.map(listing => (
                      <Link 
                        href={`/listings/${listing.id}`} 
                        key={listing.id}
                        className="card hover:shadow-lg transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row">
                          <div className="relative h-48 sm:h-auto sm:w-48 bg-gray-200">
                            {/* This would be an actual image in production */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                              <span className="text-gray-500 text-xs">[Image: {listing.title}]</span>
                            </div>
                          </div>
                          <div className="p-4 flex-1">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                              <h3 className="font-semibold text-lg">{listing.title}</h3>
                              <div className="mt-2 sm:mt-0 bg-green-50 px-3 py-1 rounded-full text-green-600 font-medium">
                                {formatPrice(listing.price)}
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2">{listing.description}</p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                                {listing.category}
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
                                <span>{listing.date}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
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