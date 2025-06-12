/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Loader2, X, Info, MapPin } from 'lucide-react';
import {
  UPDATE_LISTING
} from '@/lib/graphql/mutations';
import { GET_CATEGORIES, GET_ME } from '@/lib/graphql/queries';
import toast from 'react-hot-toast';
import { conditions, locations } from '@/app/components/constants/CreateListingConstant';

export const EditListingModal = ({ listing, isOpen, onClose, onUpdate }) => {
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: userData } = useQuery(GET_ME);
  const categories = categoriesData?.categories || [];
  const currentUser = userData?.me;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    condition: '',
    quantity: 1,
    unit: 'unité',
    price: 0,
    isFree: false,
    location: '',
    address: '',
    contactMethod: 'platform',
    phoneNumber: '',
    email: '',
    categoryId: ''
  });

  const [updateListing, { loading: updateLoading }] = useMutation(UPDATE_LISTING, {
    onCompleted: (data) => {
      if (data.updateListing.listing) {
        toast.success('Annonce mise à jour avec succès');
        onUpdate();
        onClose();
      }
    },
    onError: (error) => {
      console.error('Erreur lors de la mise à jour:', error);
      toast.error('Erreur lors de la mise à jour de l\'annonce');
    }
  });

  // Remplir le formulaire avec les données existantes
  useEffect(() => {
    if (listing && isOpen) {
      setFormData({
        title: listing.title || '',
        description: listing.description || '',
        condition: listing.condition || 'new',
        quantity: listing.quantity || 1,
        unit: listing.unit || 'unité',
        price: listing.price || 0,
        isFree: listing.isFree || false,
        location: listing.location || '',
        address: listing.address || '',
        contactMethod: listing.contactMethod || 'platform',
        phoneNumber: listing.phoneNumber || '',
        email: listing.email || '',
        categoryId: listing.category?.id || ''
      });
    }
  }, [listing, isOpen]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));

      // If marking as free, reset price
      if (name === 'isFree' && checked) {
        setFormData(prev => ({
          ...prev,
          price: 0
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!listing?.id || !currentUser?.id) return;

    try {
      // Préparer les données pour la mutation
      const updateInput = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        condition: formData.condition,
        quantity: parseInt(formData.quantity),
        unit: formData.unit,
        price: formData.isFree ? 0 : parseFloat(formData.price),
        isFree: formData.isFree,
        location: formData.location.trim(),
        address: formData.address.trim(),
        contactMethod: formData.contactMethod,
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        categoryId: formData.categoryId || null,
        userId: currentUser.id // Ajout du userId requis
      };

      await updateListing({
        variables: {
          id: listing.id,
          input: updateInput
        }
      });
    } catch (error) {
      console.error('Erreur lors de la soumission:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full h-[90vh] shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Modifier l'annonce</h1>
            <p className="text-gray-600 mt-1">
              Mettez à jour les détails de votre annonce.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            disabled={updateLoading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 overflow-hidden">
          <form onSubmit={handleSubmit} className="h-full flex">
            
            {/* Left Column */}
            <div className="w-1/2 border-r border-gray-200 overflow-y-auto">
              
              {/* Informations générales */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Informations générales</h2>

                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Titre de l'annonce*
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Lot de 100 briques rouges en excellent état"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Décrivez vos matériaux en détail: origine, dimensions, quantité, état, etc."
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Soyez précis pour aider les acheteurs potentiels à comprendre ce que vous proposez.
                    </p>
                  </div>

                  {/* Category and Condition */}
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                        Catégorie*
                      </label>
                      <select
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                        État*
                      </label>
                      <select
                        id="condition"
                        name="condition"
                        value={formData.condition}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Sélectionner l'état</option>
                        {conditions.map(condition => (
                          <option key={condition.id} value={condition.id}>{condition.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Quantity and Unit */}
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                        Quantité
                      </label>
                      <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        required
                        min="1"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
                        Unité
                      </label>
                      <input
                        type="text"
                        id="unit"
                        name="unit"
                        value={formData.unit}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Ex: unité, kg, m², etc."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Prix */}
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Prix</h2>

                <div className="space-y-6">
                  {/* Free checkbox */}
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isFree"
                        name="isFree"
                        type="checkbox"
                        checked={formData.isFree}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isFree" className="font-medium text-gray-700">Je donne ces matériaux gratuitement</label>
                      <p className="text-gray-500">Cochez cette case si vous souhaitez donner ces matériaux sans contrepartie financière.</p>
                    </div>
                  </div>

                  {/* Price */}
                  {!formData.isFree && (
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Prix (en Ariary)*
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          required={!formData.isFree}
                          min="0"
                          step="100"
                          className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="0"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 border-r border-gray-300">
                          Ar
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-1/2 overflow-y-auto">
              
              {/* Localisation */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Localisation</h2>

                <div className="space-y-6">
                  {/* Location */}
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Ville*
                    </label>
                    <select
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Sélectionner une ville</option>
                      {locations.map(location => (
                        <option key={location.id} value={location.id}>{location.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Address */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Adresse précise (facultatif)
                    </label>
                    <div className="flex">
                      <div className="relative flex-grow">
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="Quartier, rue, etc."
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <MapPin size={16} className="text-gray-400" />
                        </div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      L'adresse précise ne sera partagée qu'avec les acheteurs sérieux.
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>

                <div className="space-y-6">
                  {/* Contact method */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Comment souhaitez-vous être contacté?*
                    </label>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          id="platform"
                          name="contactMethod"
                          type="radio"
                          value="platform"
                          checked={formData.contactMethod === 'platform'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <label htmlFor="platform" className="ml-3 text-sm font-medium text-gray-700">
                          Via la messagerie de la plateforme (recommandé)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="phone"
                          name="contactMethod"
                          type="radio"
                          value="phone"
                          checked={formData.contactMethod === 'phone'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <label htmlFor="phone" className="ml-3 text-sm font-medium text-gray-700">
                          Par téléphone
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          id="email"
                          name="contactMethod"
                          type="radio"
                          value="email"
                          checked={formData.contactMethod === 'email'}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <label htmlFor="email" className="ml-3 text-sm font-medium text-gray-700">
                          Par e-mail
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Phone number */}
                  {(formData.contactMethod === 'phone') && (
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Numéro de téléphone*
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+261 XX XX XXX XX"
                      />
                    </div>
                  )}

                  {/* Email */}
                  {(formData.contactMethod === 'email') && (
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Adresse e-mail*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="votre@email.com"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Note informative */}
              <div className="p-6">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 flex">
                  <div className="flex-shrink-0">
                    <Info className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-700">
                      Les modifications seront visibles immédiatement après la mise à jour de votre annonce.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Actions - Fixed Footer */}
        <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between rounded-b-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            disabled={updateLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            form="edit-listing-form"
            onClick={handleSubmit}
            className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center transition-colors ${updateLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
            disabled={updateLoading}
          >
            {updateLoading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Mise à jour...
              </>
            ) : (
              'Mettre à jour l\'annonce'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};