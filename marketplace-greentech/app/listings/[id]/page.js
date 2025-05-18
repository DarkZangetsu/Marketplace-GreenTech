'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  MapPin, 
  Calendar, 
  MessageSquare, 
  Heart, 
  Share2, 
  Flag, 
  ArrowLeft,
  Phone,
  Mail,
  User,
  Info,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

// Mock listing data (in a real app, this would come from an API)
const mockListing = {
  id: 1,
  title: 'Briques de construction',
  description: 'Lot de 100 briques rouges récupérées d\'un chantier de rénovation dans le centre-ville. Les briques sont en excellent état, sans fissures ni éclats majeurs. Dimensions standards: 22 x 10,5 x 6,5 cm. Idéal pour petites constructions, murets de jardin, ou projets de rénovation. \n\nCes briques ont environ 5 ans et proviennent d\'un bâtiment historique rénové. Elles ont été soigneusement démontées et nettoyées. Disponibles immédiatement, à venir chercher sur place.',
  category: 'Construction',
  condition: 'Excellent',
  quantity: 100,
  unit: 'pièces',
  price: 150000,
  location: 'Antananarivo',
  address: 'Quartier Analakely',
  contactMethod: 'platform',
  seller: {
    id: 101,
    name: 'Rakoto Jean',
    memberSince: 'Janvier 2023',
    rating: 4.8,
    responseRate: 95,
    avatar: null,
  },
  images: [
    '/images/bricks1.jpg',
    '/images/bricks2.jpg',
    '/images/bricks3.jpg',
  ],
  postedDate: '18/05/2023',
  views: 45,
  isFavorited: false,
};

export default function ListingDetailPage({ params }) {
  const router = useRouter();
  const { id } = params;
  
  // In a real app, we would fetch the listing data based on the id
  const listing = mockListing;
  
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isFavorite, setIsFavorite] = useState(listing.isFavorited);
  const [showSuccess, setShowSuccess] = useState(false);

  const nextImage = () => {
    setActiveImageIndex((prev) => 
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => 
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    setIsSending(true);
    
    try {
      // In a real app, we would send the message to an API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message briefly
      setShowSuccess(true);
      setMessage('');
      
      // Redirect to messages page after showing success
      setTimeout(() => {
        router.push(`/messages?listing=${id}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, we would update the favorite status in the database
  };

  const formatPrice = (price) => {
    if (price === 0) return 'Gratuit';
    return new Intl.NumberFormat('fr-MG', { 
      style: 'currency', 
      currency: 'MGA',
      maximumFractionDigits: 0 
    }).format(price);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} className="mr-2" />
          <span>Retour aux annonces</span>
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Images and details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative aspect-w-16 aspect-h-9 bg-gray-200">
              {listing.images.length > 0 ? (
                <>
                  {/* This would be an actual image in production */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500 text-lg">[Image: {listing.title} {activeImageIndex + 1}]</span>
                  </div>
                  
                  {/* Navigation arrows */}
                  {listing.images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                        aria-label="Image précédente"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                        aria-label="Image suivante"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-500">Aucune image disponible</span>
                </div>
              )}
            </div>
            
            {/* Thumbnails */}
            {listing.images.length > 1 && (
              <div className="flex p-2 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 mr-2 rounded overflow-hidden ${
                      index === activeImageIndex ? 'ring-2 ring-green-500' : 'opacity-70'
                    }`}
                  >
                    {/* This would be an actual thumbnail in production */}
                    <div className="w-full h-full flex items-center justify-center bg-gray-200">
                      <span className="text-gray-500 text-xs">{index + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Listing details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-y-2">
                <div className="flex items-center mr-4">
                  <MapPin size={16} className="mr-1" />
                  <span>{listing.location}</span>
                </div>
                <div className="flex items-center mr-4">
                  <Calendar size={16} className="mr-1" />
                  <span>Publié le {listing.postedDate}</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{listing.views} vues</span>
                </div>
              </div>
              
              <div className="flex items-center mb-6">
                <span className="text-3xl font-bold text-gray-900">{formatPrice(listing.price)}</span>
                {listing.price === 0 && (
                  <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Don</span>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                  <div className="text-gray-700 whitespace-pre-line">
                    {listing.description}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Détails</h2>
                    <ul className="space-y-2">
                      <li className="flex justify-between">
                        <span className="text-gray-600">Catégorie</span>
                        <span className="font-medium">{listing.category}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">État</span>
                        <span className="font-medium">{listing.condition}</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-600">Quantité</span>
                        <span className="font-medium">{listing.quantity} {listing.unit}</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-2">Localisation</h2>
                    <div className="flex items-start">
                      <MapPin size={18} className="text-gray-500 mr-2 mt-0.5" />
                      <div>
                        <p className="text-gray-700">{listing.location}</p>
                        {listing.address && <p className="text-gray-500 text-sm">{listing.address}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Seller info and actions */}
        <div className="space-y-6">
          {/* Seller card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Vendeur</h2>
              
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                  {listing.seller.avatar ? (
                    <img 
                      src={listing.seller.avatar} 
                      alt={listing.seller.name} 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{listing.seller.name}</h3>
                  <p className="text-gray-500 text-sm">Membre depuis {listing.seller.memberSince}</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Évaluation</span>
                  <div className="flex items-center">
                    <span className="font-medium mr-1">{listing.seller.rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(listing.seller.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">Taux de réponse</span>
                  <span className="font-medium">{listing.seller.responseRate}%</span>
                </div>
              </div>
              
              {/* Contact button */}
              {!showContactForm ? (
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <MessageSquare size={18} className="mr-2" />
                  <span>Contacter le vendeur</span>
                </button>
              ) : showSuccess ? (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                  <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700">Message envoyé avec succès!</p>
                  <p className="text-green-600 text-sm mt-1">Le vendeur vous répondra bientôt.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmitMessage} className="space-y-4">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Bonjour, je suis intéressé par votre annonce..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows={4}
                    required
                  />
                  
                  <div className="flex justify-between">
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    
                    <button
                      type="submit"
                      disabled={isSending}
                      className={`btn btn-primary ${isSending ? 'opacity-75 cursor-not-allowed' : ''}`}
                    >
                      {isSending ? 'Envoi...' : 'Envoyer'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Actions card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>
              
              <div className="space-y-3">
                <button
                  onClick={toggleFavorite}
                  className={`w-full flex items-center justify-center px-4 py-2 rounded-md ${
                    isFavorite 
                      ? 'bg-red-50 text-red-600 border border-red-200' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <Heart size={18} className={`mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                  <span>{isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}</span>
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-100">
                  <Share2 size={18} className="mr-2" />
                  <span>Partager l'annonce</span>
                </button>
                
                <button className="w-full flex items-center justify-center px-4 py-2 bg-gray-50 text-gray-700 border border-gray-200 rounded-md hover:bg-gray-100">
                  <Flag size={18} className="mr-2" />
                  <span>Signaler l'annonce</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Safety tips */}
          <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div className="flex items-start">
              <Info size={20} className="text-blue-500 mr-3 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Conseils de sécurité</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Rencontrez le vendeur dans un lieu public</li>
                  <li>• Vérifiez le matériel avant de payer</li>
                  <li>• Ne payez pas d'avance</li>
                </ul>
                <Link href="/safety-tips" className="text-xs text-blue-600 hover:underline mt-2 inline-block">
                  Plus de conseils de sécurité
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Similar listings section would go here */}
    </div>
  );
} 