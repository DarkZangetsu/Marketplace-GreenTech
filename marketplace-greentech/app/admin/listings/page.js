'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_LISTINGS_ADMIN } from '@/lib/graphql/queries';
import { UPDATE_LISTING_STATUS, DELETE_LISTING_ADMIN } from '@/lib/graphql/mutations';
import { Search, Filter, Trash2, Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminListings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, loading, refetch } = useQuery(GET_ALL_LISTINGS_ADMIN, {
    variables: {
      search: searchQuery,
      status: statusFilter || null
    }
  });

  const [updateListingStatus] = useMutation(UPDATE_LISTING_STATUS, {
    onCompleted: () => {
      refetch();
      toast.success('Statut de l\'annonce mis à jour');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const [deleteListing] = useMutation(DELETE_LISTING_ADMIN, {
    onCompleted: () => {
      refetch();
      setShowDeleteModal(false);
      toast.success('Annonce supprimée');
      
      // Ajuster la page courante si nécessaire
      const newTotal = listings.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  // Calcul de la pagination
  const listings = data?.allListings || [];
  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentListings = listings.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleStatusChange = async (listingId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    await updateListingStatus({
      variables: {
        listingId,
        status: newStatus
      }
    });
  };

  const handleDelete = async (listingId) => {
    await deleteListing({
      variables: {
        listingId
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Réinitialiser la page quand on change les filtres
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des annonces</h1>
        <p className="text-gray-600 mt-1">Gérez les annonces de la plateforme</p>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher une annonce..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
            <option value="pending">En attente</option>
          </select>
        </div>
      </div>

      {/* Liste des annonces */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Annonce
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : currentListings.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  Aucune annonce trouvée
                </td>
              </tr>
            ) : (
              currentListings.map((listing) => (
                <tr key={listing.id}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16 relative">
                        {listing.images?.[0] ? (
                          <Image
                            src={
                              listing.images[0].image.startsWith('http') || listing.images[0].image.startsWith('/')
                                ? listing.images[0].image
                                : `${process.env.NEXT_PUBLIC_MEDIA_URL || 'https://marketplace-greentech.onrender.com/media/'}${listing.images[0].image}`
                            }
                            alt={listing.title}
                            fill
                            className="object-cover rounded-lg"
                          />
                        ) : (
                          <div className="h-16 w-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{listing.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-2">{listing.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{listing.user.username}</div>
                    <div className="text-sm text-gray-500">{listing.user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{listing.category.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                        listing.status
                      )}`}
                    >
                      {listing.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusChange(listing.id, listing.status)}
                        className={`p-2 rounded-full ${
                          listing.status === 'active'
                            ? 'text-red-600 hover:bg-red-50'
                            : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={listing.status === 'active' ? 'Désactiver' : 'Activer'}
                      >
                        {listing.status === 'active' ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedListing(listing);
                          setShowDeleteModal(true);
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && listings.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Affichage de {startIndex + 1} à {Math.min(endIndex, listings.length)} sur {listings.length} annonces
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Précédent
                </button>
                
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        page === currentPage
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
                  }`}
                >
                  Suivant
                  <ChevronRight size={16} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Supprimer l'annonce
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'annonce "{selectedListing.title}" ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(selectedListing.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
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