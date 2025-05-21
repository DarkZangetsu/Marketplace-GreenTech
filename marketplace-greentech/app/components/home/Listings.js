import { GET_LISTINGS } from '@/lib/graphql/queries';
import { useQuery } from '@apollo/client';
import { ArrowRight, Gift, MapPin } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// Helper to format price
const formatPrice = (price) => {
  if (price === 0) return "Gratuit";
  return new Intl.NumberFormat("fr-MG", { style: "currency", currency: "MGA" }).format(price);
};

export default function Listings() {
  // Requête GraphQL pour récupérer exactement 4 annonces actives
  const { data: listingsData, loading: listingsLoading } = useQuery(GET_LISTINGS, {
    variables: {
      limit: 4,
      status: 'active'
    }
  });

  return (
    <div>
      {/* Featured Listings - Affichage limité à 4 annonces */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Annonces Récentes</h2>
            <Link href="/listings" className="text-green-600 hover:text-green-700 flex items-center">
              Voir tout <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {listingsLoading ? (
              // Affichage de 4 placeholders pendant le chargement
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="card hover:shadow-lg transition-shadow animate-pulse">
                  <div className="relative h-48 w-full bg-gray-200"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : listingsData?.listings?.length ? (
              // Affichage des 4 annonces récupérées (ou moins si moins disponibles)
              listingsData.listings.slice(0, 4).map(listing => (
                <div key={listing.id} className="card hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full bg-gray-200">
                    {listing.images && listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0].image}
                        alt={listing.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                        <span className="text-gray-500 text-xs">[Image: {listing.title}]</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <span className="text-sm font-bold text-green-600">{formatPrice(listing.price)}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{listing.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex items-center text-gray-500 text-sm">
                        <MapPin size={14} className="mr-1" />
                        <span>{listing.location}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(listing.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="px-4 py-3 bg-gray-50 border-t">
                    <Link href={`/listings/${listing.id}`} className="text-green-600 hover:text-green-700 text-sm font-medium">
                      Voir les détails
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              // Message si aucune annonce n'est disponible
              <div className="col-span-full flex flex-col items-center justify-center py-16">
                <div className="bg-green-50 p-6 rounded-full mb-4 flex items-center justify-center">
                  <Gift className="h-12 w-12 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Aucune annonce disponible pour le moment</h3>
                <p className="text-gray-500 mb-4">Soyez le premier à publier une annonce ou revenez plus tard !</p>
                <Link href="/listings/create" className="btn bg-green-600 text-white hover:bg-green-700">Déposer une annonce</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}