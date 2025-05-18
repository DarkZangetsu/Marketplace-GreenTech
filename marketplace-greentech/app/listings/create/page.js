'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Camera, X, Info, Upload, MapPin } from 'lucide-react';

// Categories
const categories = [
  { id: 'construction', name: 'Construction' },
  { id: 'bois', name: 'Bois' },
  { id: 'electricite', name: 'Électricité' },
  { id: 'plomberie', name: 'Plomberie' },
  { id: 'textile', name: 'Textile' },
  { id: 'metal', name: 'Métaux' },
  { id: 'peinture', name: 'Peinture' },
  { id: 'autres', name: 'Autres' },
];

// Conditions
const conditions = [
  { id: 'neuf', name: 'Neuf' },
  { id: 'excellent', name: 'Excellent' },
  { id: 'bon', name: 'Bon' },
  { id: 'acceptable', name: 'Acceptable' },
  { id: 'a-renover', name: 'À rénover' },
];

// Locations
const locations = [
  { id: 'antananarivo', name: 'Antananarivo' },
  { id: 'tamatave', name: 'Tamatave' },
  { id: 'mahajanga', name: 'Mahajanga' },
  { id: 'fianarantsoa', name: 'Fianarantsoa' },
  { id: 'toliara', name: 'Toliara' },
  { id: 'antsiranana', name: 'Antsiranana' },
  { id: 'autre', name: 'Autre ville' },
];

export default function CreateListingPage() {
  const router = useRouter();
  
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + previewImages.length > 5) {
      setErrors(prev => ({
        ...prev,
        images: 'Vous ne pouvez pas télécharger plus de 5 images.'
      }));
      return;
    }
    
    // Create preview URLs and add to state
    const newPreviewImages = files.map(file => ({
      file,
      url: URL.createObjectURL(file),
      name: file.name
    }));
    
    setPreviewImages(prev => [...prev, ...newPreviewImages]);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    
    // Clear error if it exists
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: null
      }));
    }
  };

  const removeImage = (index) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(previewImages[index].url);
    
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);
    setPreviewImages(newPreviewImages);
    
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      images: newImages
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
      newErrors.condition = "L'état est requis";
    }
    
    if (!formData.isFree && (!formData.price || formData.price <= 0)) {
      newErrors.price = 'Le prix est requis ou doit être supérieur à 0';
    }
    
    if (!formData.location) {
      newErrors.location = 'La ville est requise';
    }
    
    if (formData.contactMethod === 'phone' && !formData.phoneNumber) {
      newErrors.phoneNumber = 'Le numéro de téléphone est requis';
    }
    
    if (formData.contactMethod === 'email' && !formData.email) {
      newErrors.email = "L'adresse e-mail est requise";
    }
    
    // Images are optional but we recommend at least one
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would upload images and submit data to an API
      // For this demo, we'll simulate a successful submission
      console.log('Form data submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setShowSuccess(true);
      
      // Redirect to listings page after 2 seconds
      setTimeout(() => {
        router.push('/dashboard/listings');
      }, 2000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Une erreur est survenue. Veuillez réessayer.'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    className={`w-full px-3 py-2 border ${errors.category ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600 error-message">{errors.category}</p>}
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
                        onChange={handleImageUpload}
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
                        <img
                          src={image.url}
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
                      <p className="mt-1 text-xs text-gray-500 truncate">{image.name}</p>
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