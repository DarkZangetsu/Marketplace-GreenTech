"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ME } from '@/lib/graphql/queries';
import { Users, List, BarChart2, Settings, AlertTriangle, Tag } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Vérification directe avec le serveur
  const { data, loading, error } = useQuery(GET_ME, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      console.log('GET_ME response:', data);
      
      if (data?.me?.isStaff) {
        console.log('User is admin, access granted');
        setIsAuthorized(true);
      } else {
        console.log('User is not admin, redirecting');
        router.replace('/');
      }
    },
    onError: (error) => {
      console.error('Auth error:', error);
      // Si erreur d'auth, rediriger vers login
      router.replace('/auth/login');
    }
  });

  // Pendant le chargement
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mb-4"></div>
          <p className="text-gray-600">Vérification des permissions...</p>
        </div>
      </div>
    );
  }

  // Si erreur ou pas autorisé
  if (error || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <p className="text-gray-600">Accès non autorisé...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 min-h-screen bg-white shadow-md">
          <div className="p-4">
            <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
          </div>
          <nav className="mt-4">
            <Link
              href="/admin"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                router.pathname === '/admin' ? 'bg-gray-100 border-r-4 border-green-500' : ''
              }`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart2 className="w-5 h-5 mr-2" />
              Vue d'ensemble
            </Link>
            <Link
              href="/admin/users"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                router.pathname === '/admin/users' ? 'bg-gray-100 border-r-4 border-green-500' : ''
              }`}
              onClick={() => setActiveTab('users')}
            >
              <Users className="w-5 h-5 mr-2" />
              Utilisateurs
            </Link>
            <Link
              href="/admin/listings"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                router.pathname === '/admin/listings' ? 'bg-gray-100 border-r-4 border-green-500' : ''
              }`}
              onClick={() => setActiveTab('listings')}
            >
              <List className="w-5 h-5 mr-2" />
              Annonces
            </Link>
            <Link
              href="/admin/categories"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                router.pathname === '/admin/categories' ? 'bg-gray-100 border-r-4 border-green-500' : ''
              }`}
              onClick={() => setActiveTab('categories')}
            >
              <Tag className="w-5 h-5 mr-2" />
              Catégories
            </Link>
            <Link
              href="/admin/reports"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                router.pathname === '/admin/reports' ? 'bg-gray-100 border-r-4 border-green-500' : ''
              }`}
              onClick={() => setActiveTab('reports')}
            >
              <AlertTriangle className="w-5 h-5 mr-2" />
              Signalements
            </Link>
            <Link
              href="/admin/settings"
              className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                router.pathname === '/admin/settings' ? 'bg-gray-100 border-r-4 border-green-500' : ''
              }`}
              onClick={() => setActiveTab('settings')}
            >
              <Settings className="w-5 h-5 mr-2" />
              Paramètres
            </Link>
          </nav>
        </div>
        {/* Main content */}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
}