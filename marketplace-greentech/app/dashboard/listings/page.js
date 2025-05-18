'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, Eye, Plus, AlertCircle, CheckCircle, XCircle } from 'lucide-react';

// Mock data for user listings
const mockListings = [
  {
    id: 1,
    title: 'Briques de construction',
    description: 'Lot de 100 briques rouges récupérées d\'un chantier, en excellent état.',
    category: 'Construction',
    image: '/images/bricks.jpg',
    location: 'Antananarivo',
    date: '18/05/2023',
    price: 150000,
    condition: 'Excellent',
    status: 'active',
    views: 45,
    messages: 3,
  },
  {
    id: 2,
    title: 'Poutres en bois',
    description: 'Ensemble de poutres en bois dur de diverses tailles, idéal pour la construction.',
    category: 'Bois',
    image: '/images/wood.jpg',
    location: 'Tamatave',
    date: '15/05/2023',
    price: 0,
    condition: 'Bon',
    status: 'active',
    views: 32,
    messages: 5,
  },
  {
    id: 3,
    title: 'Panneaux solaires usagés',
    description: 'Panneaux solaires fonctionnels mais avec quelques rayures. Puissance totale: 200W.',
    category: 'Électricité',
    image: '/images/solar.jpg',
    location: 'Mahajanga',
    date: '12/05/2023',
    price: 75000,
    condition: 'Acceptable',
    status: 'active',
    views: 28,
    messages: 2,
  },
  {
    id: 4,
    title: 'Tissus pour artisanat',
    description: 'Chutes de tissus colorés, parfaits pour l\'artisanat et la couture.',
    category: 'Textile',
    image: '/images/textile.jpg',
    location: 'Fianarantsoa',
    date: '10/05/2023',
    price: 25000,
    condition: 'Neuf',
    status: 'sold',
    views: 56,
    messages: 8,
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
    status: 'expired',
    views: 12,
    messages: 0,
  },
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

export default function UserListingsPage() {
  const [listings, setListings] = useState(mockListings);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  // Filter listings based on status
  const filteredListings = activeFilter === 'all' 
    ? listings 
    : listings.filter(listing => listing.status === activeFilter);

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setListings(prev => prev.filter(item => item.id !== listingToDelete.id));
    setShowDeleteModal(false);
    setDeleteSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setDeleteSuccess(false);
    }, 3000);
  };

  // Status badge component
  const StatusBadge = ({ status }) => {
    switch(status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle size={12} className="mr-1" />
            Active
          </span>
        );
      case 'sold':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            <CheckCircle size={12} className="mr-1" />
            Vendue
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle size={12} className="mr-1" />
            Expirée
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes annonces</h1>
            <p className="text-gray-600 mt-1">
              Gérez toutes vos annonces
            </p>
          </div>
          
          <Link href="/listings/create" className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nouvelle annonce</span>
          </Link>
        </div>
        
        {/* Success message */}
        {deleteSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md flex items-center">
            <CheckCircle size={18} className="mr-2" />
            <span>L'annonce a été supprimée avec succès.</span>
          </div>
        )}
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'all' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('all')}
          >
            Toutes ({listings.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('active')}
          >
            Actives ({listings.filter(l => l.status === 'active').length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'sold' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('sold')}
          >
            Vendues ({listings.filter(l => l.status === 'sold').length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'expired' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('expired')}
          >
            Expirées ({listings.filter(l => l.status === 'expired').length})
          </button>
        </div>
        
        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {activeFilter === 'all' 
                ? "Vous n'avez pas encore créé d'annonces." 
                : `Vous n'avez pas d'annonces ${activeFilter === 'active' ? 'actives' : activeFilter === 'sold' ? 'vendues' : 'expirées'}.`}
            </p>
            <Link href="/listings/create" className="btn btn-primary">
              Créer une annonce
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Annonce
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Prix
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Statut
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vues
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Messages
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded">
                            {/* This would be an actual image in production */}
                            <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">
                              Image
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                            <div className="text-sm text-gray-500">{listing.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatPrice(listing.price)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{listing.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={listing.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing.views}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing.messages > 0 ? (
                          <Link href={`/dashboard/messages?listing=${listing.id}`} className="text-blue-600 hover:text-blue-800">
                            {listing.messages}
                          </Link>
                        ) : (
                          '0'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            href={`/listings/${listing.id}`}
                            className="text-gray-600 hover:text-gray-900"
                            title="Voir l'annonce"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link 
                            href={`/listings/edit/${listing.id}`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Modifier l'annonce"
                          >
                            <Edit size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(listing)}
                            className="text-red-600 hover:text-red-900"
                            title="Supprimer l'annonce"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'annonce "{listingToDelete?.title}"? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 