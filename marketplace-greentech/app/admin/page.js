'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ME, GET_ADMIN_STATS } from '@/lib/graphql/queries';
import { Users, List, BarChart2, Settings, AlertTriangle, Tag } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Vérifier si l'utilisateur est admin
  const { data: userData } = useQuery(GET_ME, {
    onCompleted: (data) => {
      if (!data?.me?.isStaff) {
        router.push('/');
      } else {
        setIsAdmin(true);
      }
    },
    onError: () => {
      router.push('/');
    }
  });

  // Récupérer les statistiques
  const { data: statsData } = useQuery(GET_ADMIN_STATS, {
    skip: !isAdmin
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Main content uniquement, sans sidebar */}
        <div className="flex-1 p-8">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Statistiques */}
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Utilisateurs</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statsData?.adminStats?.totalUsers || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {statsData?.adminStats?.activeUsers || 0} actifs
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Annonces</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statsData?.adminStats?.totalListings || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {statsData?.adminStats?.activeListings || 0} actives
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Catégories</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statsData?.adminStats?.totalCategories || 0}
                </p>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700">Messages</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {statsData?.adminStats?.totalMessages || 0}
                </p>
              </div>

              {/* Graphiques */}
              <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Utilisateurs par mois</h3>
                {/* Ajouter un graphique ici */}
              </div>

              <div className="col-span-2 bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Annonces par statut</h3>
                {/* Ajouter un graphique ici */}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 