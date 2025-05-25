'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Search, Heart, User, LogOut, MessageCircle, BarChart2 } from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { getProfilePictureUrl } from '@/app/components/messages/Helper';
import { useQuery } from '@apollo/client';
import { MY_MESSAGES } from '@/lib/graphql/queries';
import { GET_ME } from '@/lib/graphql/queries';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Requête pour récupérer les données de l'utilisateur
  const { data: userData } = useQuery(GET_ME, {
    skip: !isAuthenticated,
    onCompleted: (data) => {
      if (data?.me) {
        setUser(data.me);
        // Mettre à jour le localStorage avec les données complètes
        localStorage.setItem('user', JSON.stringify(data.me));
      }
    }
  });

  const { data: messagesData, refetch: refetchMessages } = useQuery(MY_MESSAGES, { 
    fetchPolicy: 'cache-and-network',
    skip: !isAuthenticated
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    setIsClient(true);
    checkAuthStatus();
    
    // Écouter les changements d'authentification
    const handleAuthChange = (event) => {
      checkAuthStatus();
    };
    
    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (messagesData?.myMessages) {
      const count = messagesData.myMessages.filter(msg => !msg.isRead && msg.receiver?.id === user?.id).length;
      setUnreadCount(count);
    }
  }, [messagesData, user?.id]);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Erreur parsing user data:', error);
        setUser(null);
      }
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  const handleLogout = () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        
        // Dispatcher un événement pour informer les autres composants
        window.dispatchEvent(new CustomEvent('authChanged', { 
          detail: { isAuthenticated: false, user: null } 
        }));
        
        // Redirection avec rechargement complet
        window.location.href = '/';
        resolve();
      }, 1000);
    });

    toast.promise(promise, {
      loading: 'Déconnexion en cours...',
      success: 'Déconnexion réussie !',
      error: 'Erreur lors de la déconnexion'
    });
  };

  const confirmLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      handleLogout();
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Rediriger vers la page de recherche avec la query
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center group">
                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent group-hover:from-green-700 group-hover:to-emerald-700 transition-all duration-200">
                  GreenTech
                </span>
              </Link>
            </div>

            {/* Barre de recherche centrale - Desktop */}
            <div className="hidden md:flex flex-1 max-w-lg mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <div className={`relative transition-all duration-200 ${
                  isSearchFocused ? 'transform scale-105' : ''
                }`}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    placeholder="Rechercher des produits écologiques..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-full bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all duration-200 text-gray-700 placeholder-gray-400"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  {searchQuery && (
                    <button
                      type="submit"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-full transition-colors duration-200"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Navigation desktop */}
            <div className="hidden md:flex md:items-center md:space-x-1">
              <NavLink href="/listings">Annonces</NavLink>
              <NavLink href="/categories">Catégories</NavLink>
              <NavLink href="/about">À propos</NavLink>
              <NavLink href="/contact">Contact</NavLink>

              {!isClient ? (
                <div className="flex items-center space-x-3 ml-4">
                  <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-3 ml-4">
                  {/* Notifications/Messages */}
                  <Link
                    href="/messages"
                    className="relative p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
                  >
                    <MessageCircle className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Favoris */}
                  <Link
                    href="/favorites"
                    className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200"
                  >
                    <Heart className="h-5 w-5" />
                  </Link>

                  {/* Menu utilisateur */}
                  <HeadlessMenu as="div" className="relative">
                    <HeadlessMenu.Button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20">
                      {user?.profilePicture ? (
                        <Image
                          src={getProfilePictureUrl(user.profilePicture)}
                          alt={user.username || 'Profil'}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <ChevronDown className="h-4 w-4" />
                    </HeadlessMenu.Button>
                    <Transition
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <HeadlessMenu.Items className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
                        <div className="py-2">
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                            <p className="text-sm text-gray-500">{user?.email}</p>
                          </div>
                          <MenuItemWithIcon href="/dashboard" icon={User}>
                            Mon tableau de bord
                          </MenuItemWithIcon>
                          {user?.isStaff && (
                            <MenuItemWithIcon href="/admin" icon={BarChart2}>
                              Tableau de bord admin
                            </MenuItemWithIcon>
                          )}
                          <MenuItemWithIcon href="/messages" icon={MessageCircle}>
                            Messages
                          </MenuItemWithIcon>
                          <MenuItemWithIcon href="/favorites" icon={Heart}>
                            Mes favoris
                          </MenuItemWithIcon>
                          <div className="border-t border-gray-100 my-1"></div>
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <button
                                onClick={confirmLogout}
                                className={`${
                                  active ? 'bg-red-50 text-red-700' : 'text-red-600'
                                } flex items-center space-x-3 w-full text-left px-4 py-2 text-sm transition-colors duration-150`}
                              >
                                <LogOut className="h-4 w-4" />
                                <span>Déconnexion</span>
                              </button>
                            )}
                          </HeadlessMenu.Item>
                        </div>
                      </HeadlessMenu.Items>
                    </Transition>
                  </HeadlessMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-4">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                  >
                    Inscription
                  </Link>
                </div>
              )}
            </div>

            {/* Bouton menu mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Barre de recherche mobile */}
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 focus:outline-none transition-all duration-200"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </form>
          </div>
        </div>

        {/* Menu mobile */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95 backdrop-blur-sm border-t border-gray-100">
              <MobileNavLink href="/listings">Annonces</MobileNavLink>
              <MobileNavLink href="/categories">Catégories</MobileNavLink>
              <MobileNavLink href="/about">À propos</MobileNavLink>
              <MobileNavLink href="/contact">Contact</MobileNavLink>

              {!isClient ? (
                <div className="px-3 py-2">
                  <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="border-t border-gray-100 my-2 pt-2">
                    <div className="px-3 py-2">
                      <p className="text-sm font-medium text-gray-900">{user?.username}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <MobileNavLink href="/dashboard">Mon tableau de bord</MobileNavLink>
                  <MobileNavLink href="/profile">Mon profil</MobileNavLink>
                  <MobileNavLink href="/messages">Messages</MobileNavLink>
                  <MobileNavLink href="/favorites">Mes favoris</MobileNavLink>
                  <button
                    onClick={confirmLogout}
                    className="block w-full text-left px-3 py-2 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/auth/login">Connexion</MobileNavLink>
                  <MobileNavLink href="/auth/register">Inscription</MobileNavLink>
                </>
              )}
            </div>
          </div>
        </Transition>
      </nav>
    </>
  );
}

// Composant NavLink pour desktop
function NavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 whitespace-nowrap"
    >
      {children}
    </Link>
  );
}

// Composant MobileNavLink pour mobile
function MobileNavLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded-lg text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200"
    >
      {children}
    </Link>
  );
}

// Composant MenuItemWithIcon pour le menu utilisateur
function MenuItemWithIcon({ href, icon: Icon, children }) {
  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <Link
          href={href}
          className={`${
            active ? 'bg-green-50 text-green-700' : 'text-gray-700'
          } flex items-center space-x-3 px-4 py-2 text-sm transition-colors duration-150`}
        >
          <Icon className="h-4 w-4" />
          <span>{children}</span>
        </Link>
      )}
    </HeadlessMenu.Item>
  );
}