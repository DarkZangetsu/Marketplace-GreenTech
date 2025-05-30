'use client';

import Link from 'next/link';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Menu, X, ChevronDown, User, LogOut, MessageCircle, BarChart2 } from 'lucide-react';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';
import Image from 'next/image';
import { getProfilePictureUrl } from '@/app/components/messages/Helper';
import { useQuery } from '@apollo/client';
import { MY_MESSAGES } from '@/lib/graphql/queries';
import { useWebSocket } from '@/lib/hooks/useWebSocket';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  const { data: messagesData } = useQuery(MY_MESSAGES, {
    fetchPolicy: 'cache-and-network',
    skip: !isAuthenticated,
    pollInterval: 30000, 
    errorPolicy: 'all'
  });

  const [unreadCount, setUnreadCount] = useState(0);
  const [allMessages, setAllMessages] = useState([]);
  const [lastMessageUpdate, setLastMessageUpdate] = useState(Date.now());

  // Gestionnaire de nouveaux messages WebSocket
  const handleNewMessage = useCallback((messageData) => {
    // Extraction correcte du message selon la structure reçue
    let message = messageData;

    // Si c'est une mutation SendMessage, extraire le message
    if (messageData?.sendMessage) {
      message = messageData.sendMessage;
    }

    // Si c'est wrappé dans messageObj
    if (messageData?.messageObj) {
      message = messageData.messageObj;
    }

    // Si c'est wrappé dans data
    if (messageData?.data) {
      message = messageData.data;
    }

    if (!message || !message.id) {
      return;
    }

    // Vérifier que toutes les propriétés nécessaires sont présentes
    if (!message.sender || !message.receiver || !message.listing) {
      return;
    }

    setAllMessages(prev => {
      // Vérifier si le message existe déjà
      const messageExists = prev.some(msg => msg?.id === message.id);
      if (messageExists) {
        return prev;
      }

      const newMessages = [...prev, message];

      // Forcer la mise à jour du compteur IMMÉDIATEMENT
      setLastMessageUpdate(Date.now());

      return newMessages;
    });

    // Afficher une notification toast pour les nouveaux messages reçus
    if (user && message.receiver && message.sender &&
        message.receiver.id === user.id && message.sender.id !== user.id) {
      const senderName = message.sender.firstName || message.sender.username || 'Utilisateur';
      toast.success(`Nouveau message de ${senderName}`, {
        duration: 4000,
        icon: '💬',
      });
    }
  }, [user]);

  // Initialiser WebSocket pour les notifications en temps réel
  useWebSocket(user?.id, handleNewMessage);

  useEffect(() => {
    setIsClient(true);
    checkAuthStatus();

    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('authChanged', handleAuthChange);
    return () => window.removeEventListener('authChanged', handleAuthChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Synchroniser les messages GraphQL avec l'état local
  useEffect(() => {
    if (messagesData?.myMessages) {
      setAllMessages(prevMessages => {
        const graphqlMessages = messagesData.myMessages.filter(msg => msg && msg.id);
        const existingMessageIds = new Set(prevMessages.map(msg => msg?.id).filter(Boolean));

        // Ajouter uniquement les nouveaux messages GraphQL
        const newGraphqlMessages = graphqlMessages.filter(msg => !existingMessageIds.has(msg.id));

        if (newGraphqlMessages.length > 0) {
          const mergedMessages = [...prevMessages, ...newGraphqlMessages];

          // Trier par date de création
          const sortedMessages = mergedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

          // Déclencher la mise à jour du compteur IMMÉDIATEMENT
          setLastMessageUpdate(Date.now());

          return sortedMessages;
        }

        return prevMessages;
      });
    }
  }, [messagesData?.myMessages]);

  // Calculer le nombre de messages non lus en temps réel
  const unreadMessagesCount = useMemo(() => {
    if (!user || !allMessages.length) {
      return 0;
    }

    const unreadMessages = allMessages.filter(msg =>
      msg &&
      msg.receiver &&
      msg.receiver.id === user.id &&
      !msg.isRead
    );

    return unreadMessages.length;
  }, [allMessages, user, lastMessageUpdate]);

  // Mettre à jour le compteur affiché IMMÉDIATEMENT
  useEffect(() => {
    setUnreadCount(unreadMessagesCount);
  }, [unreadMessagesCount]);

  // Écouter les événements de marquage de messages comme lus depuis d'autres composants
  useEffect(() => {
    const handleMessageMarkedAsRead = (event) => {
      const { messageId } = event.detail;

      setAllMessages(prev =>
        prev.map(msg =>
          msg.id === messageId ? { ...msg, isRead: true } : msg
        )
      );

      // Déclencher la mise à jour du compteur IMMÉDIATEMENT
      setLastMessageUpdate(Date.now());
    };

    const handleMultipleMessagesMarkedAsRead = (event) => {
      const { messageIds } = event.detail;

      setAllMessages(prev =>
        prev.map(msg =>
          messageIds.includes(msg.id) ? { ...msg, isRead: true } : msg
        )
      );

      // Déclencher la mise à jour du compteur IMMÉDIATEMENT
      setLastMessageUpdate(Date.now());
    };

    window.addEventListener('messageMarkedAsRead', handleMessageMarkedAsRead);
    window.addEventListener('multipleMessagesMarkedAsRead', handleMultipleMessagesMarkedAsRead);

    return () => {
      window.removeEventListener('messageMarkedAsRead', handleMessageMarkedAsRead);
      window.removeEventListener('multipleMessagesMarkedAsRead', handleMultipleMessagesMarkedAsRead);
    };
  }, []);

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

        window.dispatchEvent(new CustomEvent('authChanged', {
          detail: { isAuthenticated: false, user: null }
        }));

        window.location.href = '/';
        resolve();
      }, 1000);
    });

    toast.promise(promise, {
      loading: 'Déconnexion en cours...',
      success: 'À bientôt !',
      error: 'Erreur lors de la déconnexion'
    });
  };

  const confirmLogout = () => {
    if (window.confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      handleLogout();
    }
  };

  // Fermer le menu mobile quand on clique sur un lien
  const closeMobileMenu = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#f9fafb',
            color: '#374151',
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          },
        }}
      />

      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100'
          : 'bg-white/90 backdrop-blur-sm'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center group">
                <div className="relative flex items-center space-x-3">
                  {/* Texte du nom */}
                  <div className="relative">
                    <span className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent group-hover:from-green-700 group-hover:via-emerald-700 group-hover:to-teal-700 transition-all duration-300">
                      GreenTech Marketplace
                    </span>
                    <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></div>
                  </div>
                </div>
              </Link>
            </div>

            {/* Navigation desktop */}
            <div className="hidden md:flex md:items-center md:space-x-2">
              <NavLink href="/listings">Annonces</NavLink>
              <NavLink href="/categories">Catégories</NavLink>
              <NavLink href="/about">À propos</NavLink>
              <NavLink href="/contact">Contact</NavLink>

              {!isClient ? (
                <div className="flex items-center space-x-3 ml-6">
                  <div className="animate-pulse flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded-lg"></div>
                  </div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-3 ml-6">

                  {/* Messages avec badge */}
                  <Link
                    href="/messages"
                    className="relative p-2.5 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 group"
                  >
                    <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Menu utilisateur */}
                  <HeadlessMenu as="div" className="relative">
                    <HeadlessMenu.Button className="flex items-center space-x-2 p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 group">
                      {user?.profilePicture ? (
                        <Image
                          src={getProfilePictureUrl(user.profilePicture)}
                          alt={user.username || 'Profil'}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-green-100 group-hover:ring-green-200 transition-all duration-200"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center ring-2 ring-green-100 group-hover:ring-green-200 transition-all duration-200">
                          <span className="text-white text-sm font-bold">
                            {user?.username?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                      <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
                    </HeadlessMenu.Button>

                    <Transition
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95 translate-y-[-10px]"
                      enterTo="transform opacity-100 scale-100 translate-y-0"
                      leave="transition ease-in duration-150"
                      leaveFrom="transform opacity-100 scale-100 translate-y-0"
                      leaveTo="transform opacity-0 scale-95 translate-y-[-10px]"
                    >
                      <HeadlessMenu.Items className="absolute right-0 mt-3 w-64 rounded-2xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100 overflow-hidden">
                        <div className="py-2">
                          {/* En-tête du profil */}
                          <div className="px-4 py-4 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              {user?.profilePicture ? (
                                <Image
                                  src={getProfilePictureUrl(user.profilePicture)}
                                  alt={user.username}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                  <span className="text-white font-bold">
                                    {user?.username?.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                                <p className="text-xs text-gray-600">{user?.email}</p>
                              </div>
                            </div>
                          </div>

                          {/* Menu items */}
                          <div className="py-1">
                            <MenuItemWithIcon href="/dashboard" icon={User}>
                              Mon tableau de bord
                            </MenuItemWithIcon>
                            {user?.isStaff && (
                              <MenuItemWithIcon href="/admin" icon={BarChart2}>
                                Administration
                              </MenuItemWithIcon>
                            )}
                            <MenuItemWithIcon href="/messages" icon={MessageCircle} badge={unreadCount}>
                              Messages
                            </MenuItemWithIcon>
                          </div>

                          <div className="border-t border-gray-100 my-1"></div>

                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <button
                                onClick={confirmLogout}
                                className={`${active ? 'bg-red-50 text-red-700' : 'text-red-600'
                                  } flex items-center space-x-3 w-full text-left px-4 py-3 text-sm transition-all duration-200 hover:bg-red-50 group`}
                              >
                                <LogOut className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                                <span className="font-medium">Déconnexion</span>
                              </button>
                            )}
                          </HeadlessMenu.Item>
                        </div>
                      </HeadlessMenu.Items>
                    </Transition>
                  </HeadlessMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-3 ml-6">
                  <Link
                    href="/auth/login"
                    className="px-4 py-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 font-medium"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg font-medium"
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
                className="p-2 text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all duration-200"
              >
                {isOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <Transition
          show={isOpen}
          enter="transition ease-out duration-200"
          enterFrom="transform opacity-0 scale-95 translate-y-[-10px]"
          enterTo="transform opacity-100 scale-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="transform opacity-100 scale-100 translate-y-0"
          leaveTo="transform opacity-0 scale-95 translate-y-[-10px]"
        >
          <div className="md:hidden">
            <div className="px-4 pt-2 pb-4 space-y-2 bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
              <MobileNavLink href="/listings" onClick={closeMobileMenu}>
                Annonces
              </MobileNavLink>
              <MobileNavLink href="/categories" onClick={closeMobileMenu}>
                Catégories
              </MobileNavLink>
              <MobileNavLink href="/about" onClick={closeMobileMenu}>
                À propos
              </MobileNavLink>
              <MobileNavLink href="/contact" onClick={closeMobileMenu}>
                Contact
              </MobileNavLink>

              {!isClient ? (
                <div className="px-3 py-2">
                  <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  <div className="border-t border-gray-200 my-3 pt-3">
                    <div className="flex items-center space-x-3 px-3 py-2">
                      {user?.profilePicture ? (
                        <Image
                          src={getProfilePictureUrl(user.profilePicture)}
                          alt={user.username}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {user?.username?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{user?.username}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  <MobileNavLink href="/dashboard" onClick={closeMobileMenu}>
                    Mon tableau de bord
                  </MobileNavLink>
                  <MobileNavLink href="/messages" onClick={closeMobileMenu}>
                    Messages {unreadCount > 0 && `(${unreadCount})`}
                  </MobileNavLink>

                  <button
                    onClick={confirmLogout}
                    className="block w-full text-left px-3 py-2 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 font-medium"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <MobileNavLink href="/auth/login" onClick={closeMobileMenu}>
                    Connexion
                  </MobileNavLink>
                  <MobileNavLink href="/auth/register" onClick={closeMobileMenu} className="bg-green-50 text-green-700 font-medium">
                    Inscription
                  </MobileNavLink>
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
      className="relative px-4 py-2 text-gray-700 hover:text-green-600 rounded-lg transition-all duration-200 whitespace-nowrap group font-medium"
    >
      {children}
      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-green-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-center"></span>
    </Link>
  );
}

// Composant MobileNavLink pour mobile
function MobileNavLink({ href, children, onClick, className = "" }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2.5 rounded-xl text-gray-700 hover:text-green-600 hover:bg-green-50 transition-all duration-200 ${className}`}
    >
      {children}
    </Link>
  );
}

// Composant MenuItemWithIcon pour le menu utilisateur
function MenuItemWithIcon({ href, icon: Icon, children, badge }) {
  return (
    <HeadlessMenu.Item>
      {({ active }) => (
        <Link
          href={href}
          className={`${active ? 'bg-green-50 text-green-700' : 'text-gray-700'
            } flex items-center justify-between px-4 py-3 text-sm transition-all duration-200 hover:bg-green-50 group`}
        >
          <div className="flex items-center space-x-3">
            <Icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium">{children}</span>
          </div>
          {badge > 0 && (
            <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-bold">
              {badge > 9 ? '9+' : badge}
            </span>
          )}
        </Link>
      )}
    </HeadlessMenu.Item>
  );
}