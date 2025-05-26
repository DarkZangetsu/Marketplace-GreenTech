'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Edit2, Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { GET_ALL_CATEGORIES } from '@/lib/graphql/queries';
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '@/lib/graphql/mutations';
import toast from 'react-hot-toast';

export default function AdminCategories() {
  const { data, loading, refetch } = useQuery(GET_ALL_CATEGORIES);
  const [createCategory] = useMutation(CREATE_CATEGORY, { onCompleted: refetch });
  const [updateCategory] = useMutation(UPDATE_CATEGORY, { onCompleted: refetch });
  const [deleteCategory] = useMutation(DELETE_CATEGORY, { onCompleted: refetch });
  
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [form, setForm] = useState({ name: '', slug: '' });
  const [deleteModal, setDeleteModal] = useState(false);
  
  // États pour la pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Calcul de la pagination
  const categories = data?.categories || [];
  const totalPages = Math.ceil(categories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);

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

  const openAddModal = () => {
    setEditMode(false);
    setForm({ name: '', slug: '' });
    setModalOpen(true);
    toast.loading('Ouverture du formulaire...', { duration: 500 });
  };

  const openEditModal = (cat) => {
    setEditMode(true);
    setCurrentCategory(cat);
    setForm({ name: cat.name, slug: cat.slug });
    setModalOpen(true);
    toast.loading('Chargement des données...', { duration: 500 });
  };

  const openDeleteModal = (cat) => {
    setCurrentCategory(cat);
    setDeleteModal(true);
    toast.loading('Préparation de la suppression...', { duration: 500 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const loadingToast = toast.loading(editMode ? 'Modification en cours...' : 'Création en cours...');
    
    try {
      if (editMode) {
        await updateCategory({ 
          variables: { 
            id: currentCategory.id, 
            input: { name: form.name, slug: form.slug } 
          } 
        });
        toast.success('✅ Catégorie modifiée avec succès!', { id: loadingToast });
      } else {
        await createCategory({ 
          variables: { 
            input: { name: form.name, slug: form.slug } 
          } 
        });
        toast.success('✅ Catégorie créée avec succès!', { id: loadingToast });
      }
      
      setModalOpen(false);
      setCurrentCategory(null);
      setForm({ name: '', slug: '' });
    } catch (error) {
      toast.error('❌ Une erreur est survenue', { id: loadingToast });
    }
  };

  const handleDelete = async () => {
    const loadingToast = toast.loading('Suppression en cours...');
    
    try {
      await deleteCategory({ variables: { id: currentCategory.id } });
      toast.success('✅ Catégorie supprimée avec succès!', { id: loadingToast });
      setDeleteModal(false);
      setCurrentCategory(null);
      
      // Ajuster la page courante si nécessaire
      const newTotal = categories.length - 1;
      const newTotalPages = Math.ceil(newTotal / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      toast.error('❌ Erreur lors de la suppression', { id: loadingToast });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des catégories</h1>
          <p className="text-gray-600 mt-1">Ajoutez, modifiez ou supprimez des catégories</p>
        </div>
        <button 
          onClick={openAddModal} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2"
        >
          <Plus size={20} />
          Nouvelle catégorie
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créée le</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Chargement...</td></tr>
            ) : currentCategories.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Aucune catégorie</td></tr>
            ) : (
              currentCategories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-6 py-4 text-gray-500">{cat.slug}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(cat.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-3">
                      <button 
                        onClick={() => openEditModal(cat)} 
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                        title="Modifier"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => openDeleteModal(cat)} 
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        {!loading && categories.length > 0 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <span>
                  Affichage de {startIndex + 1} à {Math.min(endIndex, categories.length)} sur {categories.length} catégories
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

      {/* Modal ajout/édition */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              {editMode ? <Edit2 size={20} /> : <Plus size={20} />}
              {editMode ? 'Modifier' : 'Ajouter'} une catégorie
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Nom</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="Nom de la catégorie"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-medium">Slug</label>
              <input 
                type="text" 
                value={form.slug} 
                onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} 
                required 
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                placeholder="slug-de-la-categorie"
              />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button 
                type="button" 
                onClick={() => {
                  setModalOpen(false);
                  toast.success('❌ Action annulée');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                {editMode ? <Edit2 size={16} /> : <Plus size={16} />}
                {editMode ? 'Enregistrer' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal suppression */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-600">
              <Trash2 size={20} />
              Supprimer la catégorie
            </h2>
            <p className="mb-6 text-gray-700">
              Êtes-vous sûr de vouloir supprimer la catégorie{' '}
              <span className="font-semibold text-gray-900">{currentCategory?.name}</span> ?
            </p>
            <div className="flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => {
                  setDeleteModal(false);
                  toast.success('❌ Suppression annulée');
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button 
                type="button" 
                onClick={handleDelete} 
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