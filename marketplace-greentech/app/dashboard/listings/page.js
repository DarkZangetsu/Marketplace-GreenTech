/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Trash2, Eye, Plus, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import {
  DELETE_LISTING,
  CHANGE_LISTING_STATUS,
} from '@/lib/graphql/mutations';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { MY_LISTINGS } from '@/lib/graphql/queries';
import { EditListingModal } from '@/app/components/EditListingModal';

// Helper to format price
const formatPrice = (price, isFree) => {
  if (isFree || price === 0) return 'Gratuit';
  return new Intl.NumberFormat('fr-MG', {
    style: 'currency',
    currency: 'MGA',
    maximumFractionDigits: 0
  }).format(price);
};

// Helper to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

export default function UserListingsPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [listingToEdit, setListingToEdit] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);

  // GraphQL queries and mutations 
  const { data, loading, error, refetch } = useQuery(MY_LISTINGS, {
    errorPolicy: 'all'
  });

  const [deleteListing, { loading: deleteLoading }] = useMutation(DELETE_LISTING, {
    onCompleted: (data) => {
      if (data.deleteListing.success) {
        toast.success('L\'annonce a été supprimée avec succès');
        refetch(); // Refresh the listings
      }
    },
    onError: (error) => {
      // Error logging removed for production security
      toast.error('Erreur lors de la suppression de l\'annonce');
    }
  });

  const [changeListingStatus] = useMutation(CHANGE_LISTING_STATUS, {
    onCompleted: () => {
      toast.success('Statut de l\'annonce mis à jour');
      refetch(); // Refresh the listings
    },
    onError: (error) => {
      // Error logging removed for production security
      toast.error('Erreur lors du changement de statut');
    }
  });

  // Récupérer les données utilisateur depuis localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token) {
      router.push('/auth/login');
      return;
    }

    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setCurrentUserId(parsedUser.id);
      } catch (error) {
        // Error logging removed for production security
        localStorage.removeItem('user');
        router.push('/auth/login');
      }
    }
  }, [router]);

  // Utilisation de myListings au lieu de filtrer manuellement
  const userListings = data?.myListings || [];

  // Normalize status function - corrigée
  const normalizeStatus = (status) => {
    if (!status) return 'active'; // Par défaut

    // Convertir en string au cas où ce serait un autre type
    const normalized = String(status).toLowerCase().trim();

    // Debug logging removed for production security

    // Mapping des variantes possibles - correction ici
    const statusMapping = {
      // Active variants
      'active': 'active',

      // Sold variants
      'sold': 'sold',

      // Inactive variants - CORRECTION: inactive reste inactive
      'inactive': 'inactive', // au lieu de 'inactif'
    };

    const result = statusMapping[normalized];

    if (!result) {
      // Warning logging removed for production security
      return 'active';
    }

    // Debug logging removed for production security
    return result;
  };

  // Calculate counts for each status
  const getStatusCounts = () => {
    const counts = {
      all: userListings.length,
      active: 0,
      sold: 0,
      inactive: 0
    };

    // Debug logging removed for production security
    userListings.forEach((listing, index) => {
      const originalStatus = listing.status;
      const normalizedStatus = normalizeStatus(originalStatus);

      if (counts.hasOwnProperty(normalizedStatus)) {
        counts[normalizedStatus]++;
      } else {
        // Warning logging removed for production security
        counts.active++; // Fallback
      }
    });

    // Debug logging removed for production security
    return counts;
  };

  const statusCounts = getStatusCounts();

  // Filter listings based on status
  const getFilteredListings = () => {
    // Debug logging removed for production security

    if (activeFilter === 'all') {
      // Debug logging removed for production security
      return userListings;
    }

    const filtered = userListings.filter(listing => {
      const listingStatus = normalizeStatus(listing.status);
      const matches = listingStatus === activeFilter;

      // Debug logging removed for production security

      return matches;
    });

    // Debug logging removed for production security

    return filtered;
  };

  const filteredListings = getFilteredListings();

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
  };

  const handleEditClick = (listing) => {
    setListingToEdit(listing);
    setShowEditModal(true);
  };

  const confirmDelete = async () => {
    if (listingToDelete?.id) {
      try {
        await deleteListing({
          variables: {
            id: listingToDelete.id
          }
        });
        setShowDeleteModal(false);
        setListingToDelete(null);
      } catch (error) {
        // Error logging removed for production security
      }
    }
  };

  const handleStatusChange = async (listingId, newStatus) => {
    try {
      await changeListingStatus({
        variables: {
          id: listingId,
          status: newStatus
        }
      });
    } catch (error) {
      // Error logging removed for production security
    }
  };

  const handleEditModalClose = () => {
    setShowEditModal(false);
    setListingToEdit(null);
  };

  const handleEditUpdate = () => {
    refetch(); // Refresh the listings after update
  };

  // Status badge component
  const StatusBadge = ({ status, listingId }) => {
    const normalizedStatus = normalizeStatus(status);

    const getStatusInfo = (status) => {
      switch (status) {
        case 'active':
          return {
            color: 'bg-green-100 text-green-800',
            icon: CheckCircle,
            label: 'Active'
          };
        case 'sold':
          return {
            color: 'bg-blue-100 text-blue-800',
            icon: CheckCircle,
            label: 'Vendue'
          };
        case 'inactive':
          return {
            color: 'bg-gray-100 text-gray-800',
            icon: XCircle,
            label: 'Inactive'
          };
        default:
          return {
            color: 'bg-yellow-100 text-yellow-800',
            icon: AlertCircle,
            label: 'Inconnu'
          };
      }
    };

    const statusInfo = getStatusInfo(normalizedStatus);
    const IconComponent = statusInfo.icon;

    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
          <IconComponent size={12} className="mr-1" />
          {statusInfo.label}
        </span>

        {/* Dropdown pour changer le statut */}
        <select
          onChange={(e) => {
            if (e.target.value) {
              handleStatusChange(listingId, e.target.value);
              // Reset select to default
              e.target.value = '';
            }
          }}
          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white hover:bg-gray-50"
          defaultValue=""
        >
          <option value="" disabled>Modifier</option>
          {normalizedStatus !== 'active' && (
            <option value="active">Marquer comme active</option>
          )}
          {normalizedStatus !== 'sold' && (
            <option value="sold">Marquer comme vendue</option>
          )}
          {normalizedStatus !== 'inactive' && (
            <option value="inactive">Marquer comme inactive</option>
          )}
        </select>
      </div>
    );
  };

  // Tab component
  const TabButton = ({ filter, label, count, isActive, onClick }) => (
    <button
      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${isActive
        ? 'bg-green-100 text-green-800 border border-green-200'
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
        }`}
      onClick={() => onClick(filter)}
    >
      {label} ({count})
    </button>
  );

  if (loading || !currentUserId) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-green-600" />
          <span className="ml-2 text-gray-600">Chargement des annonces...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p>Erreur lors du chargement des annonces: {error.message}</p>
          <button
            onClick={() => refetch()}
            className="mt-2 text-sm underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const getEmptyStateMessage = () => {
    switch (activeFilter) {
      case 'active':
        return "Vous n'avez pas d'annonces actives.";
      case 'sold':
        return "Vous n'avez pas d'annonces vendues.";
      case 'inactive':
        return "Vous n'avez pas d'annonces inactives.";
      default:
        return "Vous n'avez pas encore créé d'annonces.";
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
              Gérez toutes vos annonces ({statusCounts.all})
            </p>
          </div>

          <Link href="/listings/create" className="btn btn-primary flex items-center gap-2">
            <Plus size={18} />
            <span>Nouvelle annonce</span>
          </Link>
        </div>

        {/* Filters/Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <TabButton
            filter="all"
            label="Toutes"
            count={statusCounts.all}
            isActive={activeFilter === 'all'}
            onClick={setActiveFilter}
          />
          <TabButton
            filter="active"
            label="Actives"
            count={statusCounts.active}
            isActive={activeFilter === 'active'}
            onClick={setActiveFilter}
          />
          <TabButton
            filter="sold"
            label="Vendues"
            count={statusCounts.sold}
            isActive={activeFilter === 'sold'}
            onClick={setActiveFilter}
          />
          <TabButton
            filter="inactive"
            label="Inactives"
            count={statusCounts.inactive}
            isActive={activeFilter === 'inactive'}
            onClick={setActiveFilter}
          />
        </div>

        {/* Current filter indicator */}
        <div className="text-sm text-gray-600">
          Affichage de {filteredListings.length} annonce{filteredListings.length !== 1 ? 's' : ''}
          {activeFilter !== 'all' && (
            <span className="font-medium">
              {' '}• Filtre: {
                activeFilter === 'active' ? 'Actives' :
                  activeFilter === 'sold' ? 'Vendues' :
                    activeFilter === 'inactive' ? 'Inactives' : ''
              }
            </span>
          )}
        </div>

        {/* Listings */}
        {filteredListings.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune annonce trouvée</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {getEmptyStateMessage()}
            </p>
            <Link href="/listings/create" className="btn btn-primary">
              Créer une annonce
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
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
                      Quantité
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Lieu
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredListings.map((listing) => (
                    <tr key={listing.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-lg overflow-hidden">
                            {listing.primaryImage ? (
                              <Image
                                src={`${process.env.NEXT_PUBLIC_MEDIA_URL}${listing.primaryImage.image}`}
                                alt={listing.title}
                                width={48}
                                height={48}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">
                                <AlertCircle size={20} />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-48 truncate" title={listing.title}>
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {listing.category?.name || 'Sans catégorie'} • {listing.condition}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatPrice(listing.price, listing.isFree)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(listing.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={listing.status} listingId={listing.id} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing.quantity} {listing.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-32 truncate" title={listing.location}>
                        {listing.location}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link
                            href={`/listings/${listing.id}`}
                            className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100 transition-colors"
                            title="Voir l'annonce"
                          >
                            <Eye size={18} />
                          </Link>
                          <button
                            onClick={() => handleEditClick(listing)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Modifier l'annonce"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(listing)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Supprimer l'annonce"
                            disabled={deleteLoading}
                          >
                            {deleteLoading ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Trash2 size={18} />
                            )}
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
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'annonce "<strong>{listingToDelete?.title}</strong>" ?
              Cette action est irréversible et toutes les données associées seront perdues.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={deleteLoading}
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center transition-colors"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  'Supprimer définitivement'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <EditListingModal
        listing={listingToEdit}
        isOpen={showEditModal}
        onClose={handleEditModalClose}
        onUpdate={handleEditUpdate}
      />
    </div>
  );
}