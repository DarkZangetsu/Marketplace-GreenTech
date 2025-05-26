'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_ALL_USERS } from '@/lib/graphql/queries';
import { UPDATE_USER_STATUS, DELETE_USER } from '@/lib/graphql/mutations';
import { Search, Filter, MoreVertical, Trash2, UserX, UserCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data, loading, refetch } = useQuery(GET_ALL_USERS, {
    variables: {
      search: searchQuery,
      isActive: showInactive ? null : true
    }
  });

  const [updateUserStatus] = useMutation(UPDATE_USER_STATUS, {
    onCompleted: () => {
      refetch();
      toast.success('✅ Statut utilisateur mis à jour');
    },
    onError: (error) => {
      toast.error(`❌ ${error.message}`);
    }
  });

  const [deleteUser] = useMutation(DELETE_USER, {
    onCompleted: () => {
      refetch();
      setShowDeleteModal(false);
      toast.success('✅ Utilisateur supprimé avec succès');
    },
    onError: (error) => {
      toast.error(`❌ ${error.message}`);
    }
  });

  // Calcul de la pagination
  const users = data?.allUsers || [];
  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = users.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(page);
    toast.loading(`Chargement de la page ${page}...`, { duration: 500 });
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      toast.loading('Page précédente...', { duration: 500 });
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      toast.loading('Page suivante...', { duration: 500 });
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const loadingToast = toast.loading(
      currentStatus ? 'Désactivation en cours...' : 'Activation en cours...'
    );
    
    try {
      await updateUserStatus({
        variables: {
          userId,
          isActive: !currentStatus
        }
      });
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
    }
  };

  const handleDelete = async (userId) => {
    const loadingToast = toast.loading('Suppression en cours...');
    
    try {
      await deleteUser({
        variables: {
          userId
        }
      });
      toast.dismiss(loadingToast);
      
      // Ajuster la page courante si nécessaire
      const newTotal = users.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
    }
  };

  const handleSearch = (value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset à la page 1 lors d'une recherche
    if (value) {
      toast.loading('Recherche en cours...', { duration: 500 });
    }
  };

  const handleFilterChange = (checked) => {
    setShowInactive(checked);
    setCurrentPage(1); // Reset à la page 1 lors du changement de filtre
    toast.loading(checked ? 'Affichage de tous les utilisateurs...' : 'Affichage des utilisateurs actifs...', { duration: 500 });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <p className="text-gray-600 mt-1">Gérez les utilisateurs de la plateforme</p>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showInactive}
              onChange={(e) => handleFilterChange(e.target.checked)}
              className="form-checkbox h-4 w-4 text-green-600"
            />
            <span className="text-sm text-gray-700">Afficher les utilisateurs inactifs</span>
          </label>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inscription
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Chargement...
                </td>
              </tr>
            ) : currentUsers.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              currentUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profilePicture ? (
                          <img
                            src={`http://localhost:8000/media/${user.profilePicture}`}
                            alt={user.username}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        <div className="text-sm text-gray-500">
                          {user.firstName} {user.lastName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(user.dateJoined).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleStatusChange(user.id, user.isActive)}
                        className={`p-2 rounded-lg transition-colors ${
                          user.isActive
                            ? 'text-red-600 hover:bg-red-50 hover:text-red-700'
                            : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                        }`}
                        title={user.isActive ? 'Désactiver' : 'Activer'}
                      >
                        {user.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                      </button>
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowDeleteModal(true);
                          toast.loading('Préparation de la suppression...', { duration: 500 });
                        }}
                        className="p-2 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors"
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
        {!loading && users.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Affichage de {startIndex + 1} à {Math.min(endIndex, users.length)} sur {users.length} utilisateurs
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
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
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Trash2 size={20} className="text-red-600" />
              Supprimer l'utilisateur
            </h3>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
              <span className="font-semibold text-gray-900">{selectedUser.username}</span> ? 
              Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  toast.success('❌ Suppression annulée');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => handleDelete(selectedUser.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}