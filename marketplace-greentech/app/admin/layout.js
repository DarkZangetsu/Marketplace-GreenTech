"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@apollo/client';
import { GET_ME } from '@/lib/graphql/queries';
import { 
  Users, 
  List, 
  BarChart2, 
  Settings, 
  AlertTriangle, 
  Tag, 
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
  Home
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Navigation items
  const navigationItems = [
    {
      name: 'Vue d\'ensemble',
      href: '/admin',
      icon: BarChart2,
      current: pathname === '/admin'
    },
    {
      name: 'Utilisateurs',
      href: '/admin/users',
      icon: Users,
      current: pathname === '/admin/users',
      badge: '12' // Exemple de badge
    },
    {
      name: 'Annonces',
      href: '/admin/listings',
      icon: List,
      current: pathname === '/admin/listings'
    },
    {
      name: 'Catégories',
      href: '/admin/categories',
      icon: Tag,
      current: pathname === '/admin/categories'
    },
    {
      name: 'Signalements',
      href: '/admin/reports',
      icon: AlertTriangle,
      current: pathname === '/admin/reports',
      badge: '5',
      badgeColor: 'bg-red-500'
    },
    {
      name: 'Paramètres',
      href: '/admin/settings',
      icon: Settings,
      current: pathname === '/admin/settings'
    }
  ];

  // Vérification avec le serveur
  const { data, loading, error } = useQuery(GET_ME, {
    errorPolicy: 'all',
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (data?.me?.isStaff) {
        setIsAuthorized(true);
      } else {
        router.replace('/');
      }
    },
    onError: (error) => {
      console.error('Auth error:', error);
      router.replace('/auth/login');
    }
  });

  // Handle logout
  const handleLogout = () => {
    // Logique de déconnexion
    router.push('/auth/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-800">
              Vérification des permissions
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Veuillez patienter...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error or unauthorized state
  if (error || !isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl border border-red-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Accès non autorisé
          </h3>
          <p className="text-gray-600 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à cette page.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex h-screen">
        {/* Sidebar - Toujours sombre */}
        <div className={`${sidebarOpen ? 'w-72' : 'w-20'} transition-all duration-300 bg-slate-800 shadow-xl border-r border-slate-700 flex flex-col`}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              {sidebarOpen && (
                <div>
                  <h1 className="text-xl font-bold text-slate-200">
                    Admin Panel
                  </h1>
                  <p className="text-sm text-slate-400 mt-1">
                    Tableau de bord
                  </p>
                </div>
              )}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Menu className="w-5 h-5 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                    item.current
                      ? 'bg-blue-900/20 text-blue-300 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : 'mx-auto'} flex-shrink-0`} />
                  {sidebarOpen && (
                    <>
                      <span className="flex-1">{item.name}</span>
                      {item.badge && (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.badgeColor === 'bg-red-500' 
                            ? 'bg-red-500 text-white' 
                            : 'bg-blue-900/40 text-blue-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                  {!sidebarOpen && item.badge && (
                    <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs flex items-center justify-center text-white ${
                      item.badgeColor || 'bg-blue-500'
                    }`}>
                      {item.badge}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-slate-700">
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-full flex items-center p-3 rounded-xl hover:bg-slate-700 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
                {sidebarOpen && (
                  <>
                    <div className="ml-3 flex-1 text-left">
                      <p className="text-sm font-medium text-slate-200">
                        {data?.me?.email || 'Admin'}
                      </p>
                      <p className="text-xs text-slate-400">
                        Administrateur
                      </p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  </>
                )}
              </button>

              {/* User dropdown */}
              {userMenuOpen && sidebarOpen && (
                <div className="absolute bottom-full mb-2 left-0 right-0 bg-slate-800 rounded-xl shadow-lg border border-slate-700 py-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 text-sm text-red-400 hover:bg-red-900/20"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Déconnexion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar - Sombre */}
          <header className="bg-slate-800 shadow-sm border-b border-slate-700 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-semibold text-slate-200">
                  {navigationItems.find(item => item.current)?.name || 'Dashboard'}
                </h2>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="md:hidden p-2 rounded-lg hover:bg-slate-700 transition-colors"
                >
                  <Menu className="w-5 h-5 text-slate-400" />
                </button>
              </div>
            </div>
          </header>

          {/* Page content - Blanc */}
          <main className="flex-1 overflow-auto bg-white p-6">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}