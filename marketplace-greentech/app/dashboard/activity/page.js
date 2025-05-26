'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_LISTINGS } from '@/lib/graphql/queries';
import { Package } from 'lucide-react';
import Link from 'next/link';

export default function ActivityPage() {
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: listingsData, loading } = useQuery(GET_ALL_LISTINGS);

  useEffect(() => {
    setIsClient(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setCurrentUserId(parsedUser.id);
      } catch {}
    }
  }, []);

  // Filtrer les annonces de l'utilisateur
  const userListings = listingsData?.listings?.filter(listing => 
    listing.userId === currentUserId || listing.user?.id === currentUserId
  ) || [];

  // Historique d'activité sur les annonces (création, modif, suppression)
  const listingActivities = userListings
    .map(listing => ({
      id: listing.id,
      title: listing.title,
      action: listing.updatedAt !== listing.createdAt ? 'modifié' : 'créé',
      date: new Date(listing.updatedAt !== listing.createdAt ? listing.updatedAt : listing.createdAt),
    }))
    .sort((a, b) => b.date - a.date);

  // Pagination
  const totalPages = Math.ceil(listingActivities.length / itemsPerPage);
  const paginatedActivities = listingActivities.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  if (!isClient) {
    return <div className="container mx-auto px-4 py-8">Chargement...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mon historique d'activité</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div>Chargement...</div>
        ) : paginatedActivities.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Aucune activité trouvée</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {paginatedActivities.map(act => (
              <li key={act.id} className="flex items-center gap-4 py-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <Package size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="text-gray-900">
                    Annonce <span className="font-semibold">{act.title}</span> {act.action}
                  </p>
                  <p className="text-gray-500 text-sm mt-1">
                    {act.date.toLocaleDateString()}
                  </p>
                </div>
                <Link href={`/dashboard/listings`} className="ml-auto text-green-600 hover:text-green-800 text-sm font-medium">
                  Voir l'annonce
                </Link>
              </li>
            ))}
          </ul>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 rounded border ${p === page ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 