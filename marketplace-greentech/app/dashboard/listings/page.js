/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit, Trash2, Eye, Plus, AlertCircle, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { GET_ALL_LISTINGS } from '@/lib/graphql/queries';
import {
  DELETE_LISTING,
  CHANGE_LISTING_STATUS,
  UPDATE_LISTING
} from '@/lib/graphql/mutations';
import Image from 'next/image';

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
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [user, setUser] = useState(null);

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_ALL_LISTINGS, {
    errorPolicy: 'all'
  });

  const [deleteListing, { loading: deleteLoading }] = useMutation(DELETE_LISTING, {
    onCompleted: (data) => {
      if (data.deleteListing.success) {
        setDeleteSuccess(true);
        refetch(); // Refresh the listings
        setTimeout(() => setDeleteSuccess(false), 3000);
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la suppression:', error);
    }
  });

  const [changeListingStatus] = useMutation(CHANGE_LISTING_STATUS, {
    onCompleted: () => {
      refetch(); // Refresh the listings
    },
    onError: (error) => {
      console.error('Erreur lors du changement de statut:', error);
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
        console.error('Error parsing user data:', error);
        localStorage.removeItem('user');
        router.push('/auth/login');
      }
    }
  }, [router]);

  // Filter listings for current user
  const userListings = data?.listings?.filter(listing =>
    listing.userId === currentUserId || listing.user?.id === currentUserId
  ) || [];

  // Filter listings based on status
  const filteredListings = activeFilter === 'all'
    ? userListings
    : userListings.filter(listing => listing.status === activeFilter);

  const handleDeleteClick = (listing) => {
    setListingToDelete(listing);
    setShowDeleteModal(true);
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
        console.error('Erreur lors de la suppression:', error);
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
      console.error('Erreur lors du changement de statut:', error);
    }
  };

  // Status badge component
  const StatusBadge = ({ status, listingId }) => {
    const getStatusInfo = (status) => {
      switch (status?.toLowerCase()) {
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
        case 'expired':
          return {
            color: 'bg-gray-100 text-gray-800',
            icon: XCircle,
            label: 'Expirée'
          };
        case 'pending':
          return {
            color: 'bg-yellow-100 text-yellow-800',
            icon: AlertCircle,
            label: 'En attente'
          };
        default:
          return {
            color: 'bg-gray-100 text-gray-800',
            icon: AlertCircle,
            label: status || 'Inconnu'
          };
      }
    };

    const statusInfo = getStatusInfo(status);
    const IconComponent = statusInfo.icon;

    return (
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
          <IconComponent size={12} className="mr-1" />
          {statusInfo.label}
        </span>
        {status?.toLowerCase() === 'active' && (
          <select
            onChange={(e) => handleStatusChange(listingId, e.target.value)}
            className="text-xs border rounded px-1 py-0.5"
            defaultValue=""
          >
            <option value="" disabled>Changer</option>
            <option value="sold">Marquer comme vendue</option>
            <option value="expired">Marquer comme expirée</option>
          </select>
        )}
      </div>
    );
  };

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
            className="mt-2 text-sm underline"
          >
            Réessayer
          </button>
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
            <h1 className="text-3xl font-bold text-gray-900">Mes annonces</h1>
            <p className="text-gray-600 mt-1">
              Gérez toutes vos annonces ({userListings.length})
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
            Toutes ({userListings.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('active')}
          >
            Actives ({userListings.filter(l => l.status?.toLowerCase() === 'active').length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'sold' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('sold')}
          >
            Vendues ({userListings.filter(l => l.status?.toLowerCase() === 'sold').length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'expired' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('expired')}
          >
            Expirées ({userListings.filter(l => l.status?.toLowerCase() === 'expired').length})
          </button>
          <button
            className={`px-4 py-2 rounded-md text-sm font-medium ${activeFilter === 'pending' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setActiveFilter('pending')}
          >
            En attente ({userListings.filter(l => l.status?.toLowerCase() === 'pending').length})
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
                : `Vous n'avez pas d'annonces ${activeFilter === 'active' ? 'actives' :
                  activeFilter === 'sold' ? 'vendues' :
                    activeFilter === 'expired' ? 'expirées' :
                      'en attente'
                }.`}
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
                    <tr key={listing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded overflow-hidden">
                            {listing.images && listing.images.length > 0 ? (
                              <Image
                                src={`http://localhost:8000/media/${listing.images.find(img => img.isPrimary)?.image || listing.images[0]?.image}`}
                                alt={listing.title}
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center text-gray-500 text-xs">
                                Image
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 max-w-48 truncate">
                              {listing.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {listing.category?.name || 'Sans catégorie'} • {listing.condition}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatPrice(listing.price, listing.isFree)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(listing.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={listing.status} listingId={listing.id} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {listing.quantity} {listing.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-32 truncate">
                        {listing.location}
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
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'annonce "{listingToDelete?.title}"? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={deleteLoading}
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Suppression...
                  </>
                ) : (
                  'Supprimer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}