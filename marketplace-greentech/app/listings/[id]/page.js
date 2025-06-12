/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, use, useEffect } from 'react';
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
import Image from 'next/image';
import { useQuery, useMutation } from '@apollo/client';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { GET_LISTING, GET_ME } from '@/lib/graphql/queries';
import { SEND_MESSAGE } from '@/lib/graphql/mutations';
import { getProfilePictureUrl } from '@/app/components/messages/Helper';
import { EditListingDetailModal } from '@/app/components/EditListingDetailModal';

export default function ListingDetailPage({ params }) {
  // Utiliser React.use() pour déballer params
  const unwrappedParams = use(params);
  const { id } = unwrappedParams;

  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Vérifier si l'utilisateur est connecté (par exemple en vérifiant le token)
  useEffect(() => {
    // Vérifiez votre méthode d'authentification ici
    // Par exemple, vérifier le localStorage, sessionStorage, ou un cookie
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
    setCheckingAuth(false);
  }, []);

  // Fetch listing data from GraphQL API
  const { loading, error, data, refetch } = useQuery(GET_LISTING, {
    variables: { id },
  });

  // Fetch current user data SEULEMENT si l'utilisateur est connecté
  const { data: userData } = useQuery(GET_ME, {
    skip: !isAuthenticated, // Skip cette requête si l'utilisateur n'est pas authentifié
    errorPolicy: 'ignore', // Ignorer les erreurs pour cette requête
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // GraphQL mutation for sending message
  const [sendMessage, { loading: isSending }] = useMutation(SEND_MESSAGE, {
    onCompleted: (data) => {
      if (data.sendMessage.messageObj) {
        setShowSuccess(true);
        setMessage('');
        
        setTimeout(() => {
          router.push(`/dashboard/messages`);
        }, 2000);
      }
    },
    onError: (error) => {
      console.error('Error sending message:', error);
    }
  });

  // Obtenir l'utilisateur actuel seulement s'il est authentifié
  const currentUser = isAuthenticated ? userData?.me : null;

  // Handle loading and error states
  if (loading || checkingAuth) return <div className="container mx-auto px-4 py-8 flex justify-center"><p>Chargement en cours...</p></div>;
  if (error) return <div className="container mx-auto px-4 py-8 flex justify-center"><p>Erreur de chargement: {error.message}</p></div>;

  // Get the listing from the data
  const listing = data?.listing;

  // If no listing found
  if (!listing) return <div className="container mx-auto px-4 py-8 flex justify-center"><p>Annonce introuvable</p></div>;

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

    if (!message.trim() || !currentUser) return;

    try {
      await sendMessage({
        variables: {
          listingId: id,
          message: message.trim(),
          receiverId: listing.user.id
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const formatPrice = (price) => {
    if (price === 0 || listing.isFree) return 'Gratuit';
    return new Intl.NumberFormat('fr-MG', {
      style: 'currency',
      currency: 'MGA',
      maximumFractionDigits: 0
    }).format(price);
  };

  // Format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy", { locale: fr });
  };

  // Get seller's full name
  const sellerName = listing.user.firstName && listing.user.lastName
    ? `${listing.user.firstName} ${listing.user.lastName}`
    : listing.user.username;

  const memberSince = format(new Date(listing.user.createdAt || new Date()), "MMMM yyyy", { locale: fr });

  // Helper function to generate correct image URL
  const getImageUrl = (imagePath) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    // Si c'est un chemin relatif
    const baseUrl = process.env.NEXT_PUBLIC_MEDIA_URL || 'https://marketplace-greentech.onrender.com/media/';
    return `${baseUrl}${imagePath}`;
  };

  // Check if current user is the owner of the listing
  const isOwner = currentUser && currentUser.id === listing.user.id;

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
            <div className="relative aspect-w-16 aspect-h-9 bg-gray-200" style={{ height: '400px' }}>
              {listing.images && listing.images.length > 0 ? (
                <>
                  <Image
                    src={getImageUrl(listing.images[activeImageIndex].image)}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />

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
            {listing.images && listing.images.length > 1 && (
              <div className="flex p-2 overflow-x-auto">
                {listing.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 mr-2 rounded overflow-hidden ${index === activeImageIndex ? 'ring-2 ring-green-500' : 'opacity-70'
                      }`}
                  >
                    <Image
                      src={getImageUrl(image.image)}
                      alt={`${listing.title} - thumbnail ${index + 1}`}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Listing details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              {/* Header section */}
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-3">{listing.title}</h1>

                {/* Meta information */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <MapPin size={16} className="mr-1.5" />
                    <span>{listing.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-1.5" />
                    <span>Publié le {formatDate(listing.createdAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>{listing.viewCount || 0} vues</span>
                  </div>
                </div>

                {/* Price section */}
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(listing.price)}</span>
                  {(listing.price === 0 || listing.isFree) && (
                    <span className="ml-3 px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                      Don
                    </span>
                  )}
                </div>
              </div>

              {/* Content sections */}
              <div className="space-y-8">
                {/* Description */}
                <section>
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Description</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </div>
                </section>

                {/* Details and Location grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Details section */}
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Détails</h2>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">Catégorie</span>
                        <span className="font-medium text-gray-900">{listing.category?.name || 'Non spécifié'}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="text-gray-600">État</span>
                        <span className="font-medium text-gray-900">{listing.condition || 'Non spécifié'}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Quantité</span>
                        <span className="font-medium text-gray-900">{listing.quantity} {listing.unit}</span>
                      </div>
                    </div>
                  </section>

                  {/* Location section */}
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Localisation</h2>
                    <div className="flex items-start space-x-3">
                      <MapPin size={20} className="text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="space-y-1">
                        <p className="text-gray-900 font-medium">{listing.location}</p>
                        {listing.address && (
                          <p className="text-gray-500 text-sm leading-relaxed">{listing.address}</p>
                        )}
                      </div>
                    </div>
                  </section>
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
                  {listing.user?.profilePicture ? (
                    <Image
                      src={getProfilePictureUrl(listing.user.profilePicture)}
                      alt={sellerName}
                      width={48}
                      height={48}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-gray-400" />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{sellerName}</h3>
                  <p className="text-gray-500 text-sm">Membre depuis {memberSince}</p>
                </div>
              </div>

              {/* Contact section - Show different content based on user status */}
              {!isAuthenticated ? (
                // Not logged in
                <div className="bg-gray-50 border border-gray-200 rounded-md p-4 text-center">
                  <p className="text-gray-600 mb-3">Connectez-vous pour contacter le vendeur</p>
                  <Link
                    href="/auth/login"
                    className="btn btn-primary"
                  >
                    Se connecter
                  </Link>
                </div>
              ) : isOwner ? (
                // Owner viewing their own listing
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-center">
                  <p className="text-blue-700 mb-3">C'est votre annonce</p>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="btn btn-primary"
                  >
                    Modifier l'annonce
                  </button>
                </div>
              ) : !showContactForm ? (
                // Contact button for other users
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full btn btn-primary flex items-center justify-center"
                >
                  <MessageSquare size={18} className="mr-2" />
                  <span>Contacter le vendeur</span>
                </button>
              ) : showSuccess ? (
                // Success message
                <div className="bg-green-50 border border-green-200 rounded-md p-4 text-center">
                  <svg className="w-6 h-6 text-green-600 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-700">Message envoyé avec succès!</p>
                  <p className="text-green-600 text-sm mt-1">Redirection vers vos messages...</p>
                </div>
              ) : (
                // Contact form
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

              {/* Contact methods if specified */}
              {!isOwner && listing.contactMethod !== 'platform' && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-3">Coordonnées du vendeur</h3>

                  {listing.contactMethod === 'phone' || listing.contactMethod === 'both' ? (
                    <div className="flex items-center mb-2">
                      <Phone size={16} className="text-gray-500 mr-2" />
                      <a href={`tel:${listing.phoneNumber || listing.user.phoneNumber}`} className="text-gray-700 hover:underline">
                        {listing.phoneNumber || listing.user.phoneNumber || 'Non spécifié'}
                      </a>
                    </div>
                  ) : null}

                  {listing.contactMethod === 'email' || listing.contactMethod === 'both' ? (
                    <div className="flex items-center">
                      <Mail size={16} className="text-gray-500 mr-2" />
                      <a href={`mailto:${listing.email || listing.user.email}`} className="text-gray-700 hover:underline">
                        {listing.email || listing.user.email || 'Non spécifié'}
                      </a>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Actions card */}
          {!isOwner && isAuthenticated && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions</h2>

                <div className="space-y-3">
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
          )}

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

      {/* Ajouter le modal d'édition */}
      {isAuthenticated && (
        <EditListingDetailModal
          listing={listing}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={() => {
            // Rafraîchir les données de l'annonce
            refetch();
          }}
        />
      )}
    </div>
  );
}