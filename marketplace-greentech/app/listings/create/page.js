/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, X, Info, MapPin } from 'lucide-react';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_LISTING, UPLOAD_LISTING_IMAGE } from '@/lib/graphql/mutations';
import { GET_CATEGORIES } from '@/lib/graphql/queries';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import { conditions, locations } from '@/app/components/constants/CreateListingConstant';

export default function CreateListingPage() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    quantity: 1,
    unit: 'unité',
    price: '',
    isFree: false,
    location: '',
    address: '',
    contactMethod: 'platform',
    phoneNumber: '',
    email: '',
    images: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImages, setPreviewImages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      toast.error('Vous devez être connecté pour créer une annonce');
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    // Debug logging removed for production security

    setToken(storedToken);
    setUser(parsedUser);
  }, [router]);

  // GraphQL queries and mutations with proper auth headers
  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    },
    skip: !token,
    fetchPolicy: 'network-only'
  });

  const [createListing] = useMutation(CREATE_LISTING, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  });

  const [uploadImage] = useMutation(UPLOAD_LISTING_IMAGE, {
    context: {
      headers: {
        Authorization: token ? `Bearer ${token}` : ''
      }
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));

      // If marking as free, reset price
      if (name === 'isFree' && checked) {
        setFormData(prev => ({
          ...prev,
          price: '0'
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB max

      if (!isValidType) {
        toast.error(`${file.name} n'est pas un type d'image valide. Utilisez JPG, PNG ou WebP.`);
      }
      if (!isValidSize) {
        toast.error(`${file.name} est trop volumineux. Taille maximale: 5MB.`);
      }

      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    // Create preview URLs
    const newPreviews = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));

    setPreviewImages(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }));
  };

  const removeImage = (index) => {f
    setPreviewImages(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].preview);
      newPreviews.splice(index, 1);
      return newPreviews;
    });

    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (!formData.category) {
      newErrors.category = 'La catégorie est requise';
    }

    if (!formData.condition) {
      newErrors.condition = 'L\'état est requis';
    }

    if (!formData.location) {
      newErrors.location = 'La localisation est requise';
    }

    if (!formData.isFree && !formData.price) {
      newErrors.price = 'Le prix est requis pour les annonces payantes';
    }

    if (formData.contactMethod === 'phone' && !formData.phoneNumber) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis pour ce mode de contact';
    }

    if (formData.contactMethod === 'email' && !formData.email) {
      newErrors.email = 'L\'email est requis pour ce mode de contact';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadListingImages = async (listingId, images) => {
    if (!token) {
      throw new Error('Authentication required for image upload');
    }

    const results = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const isPrimary = i === 0;

      try {
        // Important: ne PAS envelopper le fichier dans un autre objet
        const { data } = await uploadImage({
          variables: {
            listingId: listingId,
            image: file,  // Passer directement le fichier
            isPrimary: isPrimary
          }
        });

        results.push(data);
      } catch (error) {
      results.push({ error });
      }
    }

    return results;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!user || !token) {
      toast.error('Vous devez être connecté pour créer une annonce');
      router.push('/auth/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the listing
      const { data: listingData } = await createListing({
        variables: {
          input: {
            title: formData.title,
            description: formData.description,
            categoryId: formData.category,
            condition: formData.condition,
            quantity: parseInt(formData.quantity),
            unit: formData.unit,
            price: formData.isFree ? 0.0 : parseFloat(formData.price || 0),
            isFree: formData.isFree,
            location: formData.location,
            contactMethod: formData.contactMethod,
            userId: user.id,
            ...(formData.address && { address: formData.address }),
            ...(formData.phoneNumber && { phoneNumber: formData.phoneNumber }),
            ...(formData.email && { email: formData.email })
          }
        }
      });

      if (listingData?.createListing?.listing) {
        const listingId = listingData.createListing.listing.id;

        // Upload images if any
        if (formData.images.length > 0) {
          try {
            const uploadResults = await uploadListingImages(listingId, formData.images);
          } catch (uploadError) {
          }
        }

        toast.success('Annonce créée avec succès !');
        router.push(`/listings/${listingId}`);
      }
    } catch (error) {

      // Extract error message
      let errorMessage = 'Une erreur est survenue lors de la création de l\'annonce';

      if (error.graphQLErrors && error.graphQLErrors.length > 0) {
        errorMessage = error.graphQLErrors[0].message;
      } else if (error.networkError) {
        errorMessage = 'Erreur de connexion au serveur. Veuillez vérifier votre connexion.';
      }

      setErrors({
        submit: errorMessage
      });

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Vous devez être connecté pour créer une annonce. Redirection...
                </p>
              </div>
            </div>
          </div>
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Annonce créée avec succès!</h1>
          <p className="text-gray-600 mb-8">
            Votre annonce a été publiée et est maintenant visible par les autres utilisateurs.
            Vous allez être redirigé vers vos annonces.
          </p>
          <div className="animate-pulse">
            <span className="text-sm text-gray-500">Redirection en cours...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Déposer une annonce</h1>
          <p className="text-gray-600 mt-2">
            Partagez les détails de vos matériaux pour leur donner une seconde vie.
          </p>
        </div>

        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Form sections */}
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
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.title ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Ex: Lot de 100 briques rouges en excellent état"
                />
                {errors.title && <p className="mt-1 text-sm text-red-600 error-message">{errors.title}</p>}
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
                  onChange={handleChange}
                  rows={5}
                  className={`w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  placeholder="Décrivez vos matériaux en détail: origine, dimensions, quantité, état, etc."
                />
                {errors.description && <p className="mt-1 text-sm text-red-600 error-message">{errors.description}</p>}
                <p className="mt-1 text-sm text-gray-500">
                  Soyez précis pour aider les acheteurs potentiels à comprendre ce que vous proposez.
                </p>
              </div>

              {/* Category and Condition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie*
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    disabled={categoriesLoading}
                    className={`w-full px-3 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${categoriesLoading ? 'bg-gray-100' : ''}`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categoriesData?.categories?.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600 error-message">{errors.category}</p>}
                  {categoriesLoading && (
                    <p className="mt-1 text-sm text-gray-500">Chargement des catégories...</p>
                  )}
                </div>

                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                    État*
                  </label>
                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.condition ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  >
                    <option value="">Sélectionner l'état</option>
                    {conditions.map(condition => (
                      <option key={condition.id} value={condition.id}>{condition.name}</option>
                    ))}
                  </select>
                  {errors.condition && <p className="mt-1 text-sm text-red-600 error-message">{errors.condition}</p>}
                </div>
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantité
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    min="1"
                    value={formData.quantity}
                    onChange={handleChange}
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
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: unité, kg, m², etc."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
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
                    onChange={handleChange}
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
                      onChange={handleChange}
                      min="0"
                      className={`w-full pl-12 pr-3 py-2 border ${errors.price ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                      placeholder="0"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center px-3 pointer-events-none text-gray-500 border-r border-gray-300">
                      Ar
                    </div>
                  </div>
                  {errors.price && <p className="mt-1 text-sm text-red-600 error-message">{errors.price}</p>}
                </div>
              )}
            </div>
          </div>

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
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.location ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                  <option value="">Sélectionner une ville</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.id}>{location.name}</option>
                  ))}
                </select>
                {errors.location && <p className="mt-1 text-sm text-red-600 error-message">{errors.location}</p>}
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
                      onChange={handleChange}
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

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Contact</h2>

            <div className="space-y-6">
              {/* Contact method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comment souhaitez-vous être contacté?*
                </label>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="platform"
                      name="contactMethod"
                      type="radio"
                      value="platform"
                      checked={formData.contactMethod === 'platform'}
                      onChange={handleChange}
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
                      onChange={handleChange}
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
                      onChange={handleChange}
                      className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <label htmlFor="email" className="ml-3 text-sm font-medium text-gray-700">
                      Par e-mail
                    </label>
                  </div>
                </div>
              </div>

              {/* Phone number */}
              {formData.contactMethod === 'phone' && (
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Numéro de téléphone*
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.phoneNumber ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="+261 XX XX XXX XX"
                  />
                  {errors.phoneNumber && <p className="mt-1 text-sm text-red-600 error-message">{errors.phoneNumber}</p>}
                </div>
              )}

              {/* Email */}
              {formData.contactMethod === 'email' && (
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse e-mail*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                    placeholder="votre@email.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600 error-message">{errors.email}</p>}
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Photos</h2>

            <div className="space-y-6">
              <div className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Camera className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4 flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                    >
                      <span>Télécharger des photos</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">ou glissez-déposez</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF jusqu'à 5 Mo (max. 5 images)
                  </p>
                </div>
              </div>

              {errors.images && <p className="mt-1 text-sm text-red-600 error-message">{errors.images}</p>}

              {/* Image previews */}
              {previewImages.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {previewImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200">
                        <Image
                          height={100}
                          width={100}
                          src={image.preview}
                          alt={`Preview ${index + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow-sm opacity-70 group-hover:opacity-100"
                      >
                        <X size={16} className="text-gray-700" />
                      </button>
                      <p className="mt-1 text-xs text-gray-500 truncate">{image.file.name}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 flex">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Des photos de qualité augmentent considérablement vos chances de trouver un preneur rapidement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submit buttons */}
          <div className="px-6 py-4 bg-gray-50 flex justify-between">
            <Link
              href="/dashboard/listings"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Annuler
            </Link>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-primary ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Publication en cours...' : 'Publier l\'annonce'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
} 