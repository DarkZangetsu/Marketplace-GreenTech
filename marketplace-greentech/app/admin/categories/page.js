'use client';
import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
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

  const openAddModal = () => {
    setEditMode(false);
    setForm({ name: '', slug: '' });
    setModalOpen(true);
  };
  const openEditModal = (cat) => {
    setEditMode(true);
    setCurrentCategory(cat);
    setForm({ name: cat.name, slug: cat.slug });
    setModalOpen(true);
  };
  const openDeleteModal = (cat) => {
    setCurrentCategory(cat);
    setDeleteModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editMode) {
      await updateCategory({ variables: { id: currentCategory.id, input: { name: form.name, slug: form.slug } } });
      toast.success('Catégorie modifiée');
    } else {
      await createCategory({ variables: { input: { name: form.name, slug: form.slug } } });
      toast.success('Catégorie créée');
    }
    setModalOpen(false);
    setCurrentCategory(null);
    setForm({ name: '', slug: '' });
  };
  const handleDelete = async () => {
    await deleteCategory({ variables: { id: currentCategory.id } });
    toast.success('Catégorie supprimée');
    setDeleteModal(false);
    setCurrentCategory(null);
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des catégories</h1>
          <p className="text-gray-600 mt-1">Ajoutez, modifiez ou supprimez des catégories</p>
        </div>
        <button onClick={openAddModal} className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-700">+ Nouvelle catégorie</button>
      </div>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créée le</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Chargement...</td></tr>
            ) : data?.categories?.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">Aucune catégorie</td></tr>
            ) : (
                data.categories.map((cat) => (
                <tr key={cat.id}>
                  <td className="px-6 py-4">{cat.name}</td>
                  <td className="px-6 py-4">{cat.slug}</td>
                  <td className="px-6 py-4">{new Date(cat.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => openEditModal(cat)} className="text-blue-600 hover:underline mr-4">Modifier</button>
                    <button onClick={() => openDeleteModal(cat)} className="text-red-600 hover:underline">Supprimer</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal ajout/édition */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">{editMode ? 'Modifier' : 'Ajouter'} une catégorie</h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Nom</label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required className="input" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Slug</label>
              <input type="text" value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} required className="input" />
            </div>
            <div className="flex justify-end gap-4 mt-6">
              <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{editMode ? 'Enregistrer' : 'Créer'}</button>
            </div>
          </form>
        </div>
      )}
      {/* Modal suppression */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-xl font-bold mb-4">Supprimer la catégorie</h2>
            <p className="mb-6">Êtes-vous sûr de vouloir supprimer la catégorie <span className="font-semibold">{currentCategory?.name}</span> ?</p>
            <div className="flex justify-end gap-4">
              <button type="button" onClick={() => setDeleteModal(false)} className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Annuler</button>
              <button type="button" onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 