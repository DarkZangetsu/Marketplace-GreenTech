'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Bell, Search, ShoppingBag, ChevronDown } from 'lucide-react';
import MessageNotification from './MessageNotification';
import { useQuery } from '@apollo/client';
import { GET_ME } from '@/lib/graphql/queries';
import { Menu as HeadlessMenu, Transition } from '@headlessui/react';
import toast, { Toaster } from 'react-hot-toast';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Récupérer les données de l'utilisateur connecté
  const { data: userData, loading: userLoading, error } = useQuery(GET_ME, {
    fetchPolicy: 'network-only',
    skip: !isClient || !localStorage.getItem('token'),
    onCompleted: (data) => {
      if (data?.me) {
        setIsAuthenticated(true);
      }
    },
    onError: () => {
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    }
  });

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
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

  const handleLogout = () => {
    const promise = new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
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

  return (
    <>
      <Toaster position="top-right" />
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-green-600">GreenTech</span>
              </Link>
            </div>

            {/* Navigation desktop */}
            <div className="hidden md:flex md:items-center md:space-x-8">
              <Link href="/listings" className="text-gray-700 hover:text-green-600">
                Annonces
              </Link>
              <Link href="/categories" className="text-gray-700 hover:text-green-600">
                Catégories
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-green-600">
                À propos
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-green-600">
                Contact
              </Link>

              {!isClient || userLoading ? (
                <div className="flex items-center space-x-4">
                  <div className="animate-pulse h-5 w-5 bg-gray-200 rounded-full"></div>
                </div>
              ) : isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <MessageNotification />
                  <HeadlessMenu as="div" className="relative">
                    <HeadlessMenu.Button className="flex items-center space-x-2 text-gray-700 hover:text-green-600 focus:outline-none">
                      <span>{userData?.me?.username || 'Mon compte'}</span>
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
                      <HeadlessMenu.Items className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                href="/dashboard"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Mon tableau de bord
                              </Link>
                            )}
                          </HeadlessMenu.Item>
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                href="/profile"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Mon profil
                              </Link>
                            )}
                          </HeadlessMenu.Item>
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <Link
                                href="/messages"
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block px-4 py-2 text-sm text-gray-700`}
                              >
                                Messages
                              </Link>
                            )}
                          </HeadlessMenu.Item>
                          <HeadlessMenu.Item>
                            {({ active }) => (
                              <button
                                onClick={confirmLogout}
                                className={`${
                                  active ? 'bg-gray-100' : ''
                                } block w-full text-left px-4 py-2 text-sm text-red-600`}
                              >
                                Déconnexion
                              </button>
                            )}
                          </HeadlessMenu.Item>
                        </div>
                      </HeadlessMenu.Items>
                    </Transition>
                  </HeadlessMenu>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/auth/login"
                    className="text-gray-700 hover:text-green-600"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="btn btn-primary"
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
                className="text-gray-700 hover:text-green-600"
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
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
              <Link
                href="/listings"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
              >
                Annonces
              </Link>
              <Link
                href="/categories"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
              >
                Catégories
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
              >
                À propos
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 text-gray-700 hover:text-green-600"
              >
                Contact
              </Link>

              {!isClient || userLoading ? (
                <div className="px-3 py-2">
                  <div className="animate-pulse h-4 w-20 bg-gray-200 rounded"></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600"
                  >
                    Mon tableau de bord
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600"
                  >
                    Mon profil
                  </Link>
                  <Link
                    href="/messages"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600"
                  >
                    Messages
                  </Link>
                  <button
                    onClick={confirmLogout}
                    className="block w-full text-left px-3 py-2 text-red-600 hover:text-red-700"
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600"
                  >
                    Connexion
                  </Link>
                  <Link
                    href="/auth/register"
                    className="block px-3 py-2 text-gray-700 hover:text-green-600"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
} 